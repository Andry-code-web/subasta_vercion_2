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

      // Ya no actualizamos el ganador aquí
      // Solo guardamos el mensaje de la puja
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


  /* faltata guardar el ganador y quitar las oportunidades si gana */


  // Finalizar la subasta y guardar el ganador
  static async endAuction(room) {
    try {
      // Obtener la última oferta más alta
      const [lastBid] = await conection.promise().query(
        `SELECT o.*, u.usuario
         FROM ofertas o
         JOIN usuarios u ON o.id_usuario = u.id
         WHERE o.id_subasta = ?
         ORDER BY o.monto_oferta DESC, o.fecha_subasta DESC, o.hora_subasta DESC
         LIMIT 1`,
        [room]
      );

      // Obtener información de la subasta
      const [subastaInfo] = await conection.promise().query(
        `SELECT * FROM subastas WHERE id = ?`,
        [room]
      );

      if (!subastaInfo[0]) {
        throw new Error('Subasta no encontrada');
      }

      let winner = null;
      let finalBid = null;
      let message = '';

      if (lastBid && lastBid.length > 0) {
        // Si hubo pujas, usar la más alta
        winner = lastBid[0].usuario;
        finalBid = lastBid[0].monto_oferta;
        message = `¡Subasta finalizada! Ganador: ${winner} con una oferta de ${finalBid}`;
      } else {
        // Si no hubo pujas, marcar como desierta
        winner = 'DESIERTA';
        finalBid = subastaInfo[0].precio_base;
        message = '¡Subasta finalizada sin ofertas! Subasta declarada desierta.';
      }

      // Actualizar la subasta con el resultado final
      await conection.promise().query(
        `UPDATE subastas 
         SET auctionEnded = true,
             currentWinner = ?,
             currentBid = ?,
             fecha_hora_fin = NOW(),
             status = ?
         WHERE id = ?`,
        [winner, finalBid, 'finalizada', room]
      );

      // Guardar mensaje final
      await MessageService.saveMessage(
        room,
        lastBid?.[0]?.id_usuario || null, // Si no hay ganador, el ID será null
        message,
        finalBid
      );

      return {
        winner: winner,
        finalBid: finalBid,
        message: message
      };
    } catch (error) {
      console.error("Error al finalizar subasta:", error);
      throw error;
    }
  }

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