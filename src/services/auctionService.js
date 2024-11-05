const { conection } = require("../database/db");
const MessageService = require("./messageService");

class AuctionService {
  // Obtener el estado de la subasta
  static async getAuctionState(room) {
    const [results] = await conection.promise().query(
      `SELECT s.*, 
          COALESCE(
              (SELECT monto_oferta 
               FROM ofertas 
               WHERE id_subasta = s.id 
               ORDER BY fecha_subasta, hora_subasta DESC
               LIMIT 1), 
              s.precio_base
          ) as current_bid,
          (SELECT u.usuario 
           FROM usuarios u 
           JOIN ofertas o ON u.id = o.id_usuario  
           WHERE o.id_subasta = s.id 
           ORDER BY o.fecha_subasta, o.hora_subasta DESC 
           LIMIT 1) as current_winner,
          (SELECT COUNT(*) FROM ofertas WHERE id_subasta = s.id) as bid_count
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
      isFirstBid: results[0].bid_count === 0
    };
  }

  static async saveBid(room, userId, bidValue, username) {
    try {
      await conection.promise().query(
        `INSERT INTO ofertas (id_subasta, id_usuario, monto_oferta, fecha_subasta, hora_subasta) 
         VALUES (?, ?, ?, CURDATE(), CURTIME())`,
        [room, userId, bidValue]
      );

      await conection.promise().query(
        `UPDATE subastas 
         SET currentWinner = ?, currentBid = ? 
         WHERE id = ?`,
        [username, bidValue, room]
      );

      await MessageService.saveMessage(
        room,
        userId,
        `${username} ha pujado con ${bidValue}`,
        bidValue
      );

      // Verificar si es la primera puja
      const [bidCount] = await conection.promise().query(
        'SELECT COUNT(*) as count FROM ofertas WHERE id_subasta = ?',
        [room]
      );

      return {
        success: true,
        isFirstBid: bidCount[0].count === 1
      };
    } catch (error) {
      console.error("Error al guardar puja:", error);
      throw error;
    }
  }

  // Finalizar la subasta
  static async endAuction(room) {
    try {
      await conection
        .promise()
        .query("UPDATE subastas SET auctionEnded = true WHERE id = ?", [room]);
      return true;
    } catch (error) {
      console.error("Error al finalizar subasta:", error);
      throw error;
    }
  }

  // Obtener el ID del usuario a partir de su nombre
  static async getUserId(username) {
    try {
      const [results] = await conection
        .promise()
        .query("SELECT id FROM usuarios WHERE usuario = ?", [username]);
      return results.length > 0 ? results[0].id : null;
    } catch (error) {
      console.error("Error al obtener ID de usuario:", error);
      throw error;
    }
  }
}

module.exports = AuctionService;
