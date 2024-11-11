const { conection } = require("../database/db");
const MessageService = require("./messageService");

class AuctionService {
  static async getAuctionState(room) {
    const [results] = await conection.promise().query(
      `SELECT s.*, 
          COALESCE(
              (SELECT monto_oferta 
               FROM ofertas 
               WHERE id_subasta = s.id 
               ORDER BY fecha_subasta DESC, hora_subasta DESC
               LIMIT 1), 
              s.precio_base
          ) as current_bid,
          (SELECT u.usuario 
           FROM usuarios u 
           JOIN ofertas o ON u.id = o.id_usuario  
           WHERE o.id_subasta = s.id 
           ORDER BY o.fecha_subasta DESC, o.hora_subasta DESC 
           LIMIT 1) as current_winner
      FROM subastas s 
      WHERE s.id = ?`,
      [room]
    );

    if (results.length === 0) return null;

    const messages = await MessageService.getMessages(room);

    return {
      auctionEnded: results[0].auctionEnded === 1,
      currentWinner: results[0].current_winner || null,
      currentBid: results[0].current_bid || results[0].precio_base,
      startTime: results[0].fecha_hora_inicio,
      endTime: results[0].fecha_hora_fin,
      messages,
    };
  }

  static async saveBid(room, userId, bidValue, username) {
    try {
      // Solo guardamos la oferta en la tabla ofertas
      await conection.promise().query(
        `INSERT INTO ofertas (id_subasta, id_usuario, monto_oferta, fecha_subasta, hora_subasta) 
         VALUES (?, ?, ?, CURDATE(), CURTIME())`,
        [room, userId, bidValue]
      );

      await MessageService.saveMessage(
        room,
        userId,
        `${username} ha pujado con ${bidValue}`,
        bidValue
      );

      const [bidCount] = await conection.promise().query(
        'SELECT COUNT(*) as count FROM ofertas WHERE id_subasta = ?',
        [room]
      );

      return {
        success: true,
        isFirstBid: bidCount[0].count === 1,
      };
    } catch (error) {
      console.error("Error al guardar puja:", error);
      throw error;
    }
  }

  static async endAuction(room) {
    try {
      // Obtener la última oferta y el usuario ganador
      const [lastBid] = await conection.promise().query(
        `SELECT o.*, u.usuario, u.id as userId
         FROM ofertas o
         JOIN usuarios u ON o.id_usuario = u.id
         WHERE o.id_subasta = ?
         ORDER BY o.monto_oferta DESC, o.fecha_subasta DESC, o.hora_subasta DESC
         LIMIT 1`,
        [room]
      );
  
      let winner = 'DESIERTA';
      let finalBid = null;
      let winnerId = null;
  
      if (lastBid && lastBid.length > 0) {
        winner = lastBid[0].usuario;
        finalBid = lastBid[0].monto_oferta;
        winnerId = lastBid[0].userId;
  
        // Restar una oportunidad al ganador
        await conection.promise().query(
          `UPDATE usuarios 
           SET oportunidades = GREATEST(0, oportunidades - 1) 
           WHERE id = ?`,
          [winnerId]
        );
      }
  
      // Marcar la subasta como finalizada y guardar el ganador y monto final
      await conection.promise().query(
        `UPDATE subastas 
         SET auctionEnded = 1,
             currentWinner = ?,
             currentBid = ?
         WHERE id = ?`,
        [winner, finalBid, room]
      );
  
      return {
        winner,
        finalBid,
        winnerId
      };
    } catch (error) {
      console.error("Error al finalizar subasta:", error);
      throw error;
    }
  }
  

  static async getUserId(username) {
    try {
      const [results] = await conection.promise().query(
        "SELECT id FROM usuarios WHERE usuario = ?", 
        [username]
      );
      return results.length > 0 ? results[0].id : null;
    } catch (error) {
      console.error("Error al obtener ID de usuario:", error);
      throw error;
    }
  }
}

module.exports = AuctionService;