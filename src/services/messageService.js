  const { conection } = require('../database/db');

  class MessageService {
    // Guardar mensaje
    static async saveMessage(subastaId, userId, mensaje, monto) {
      try {
        const [result] = await conection.promise().query(
          `INSERT INTO mensajes_subasta (id_subasta, id_usuario, mensaje, monto) 
          VALUES (?, ?, ?, ?)`,
          [subastaId, userId, mensaje, monto]
        );
        return result.insertId; // Retorna el ID del mensaje insertado
      } catch (error) {
        console.error('Error al guardar mensaje:', error);
        throw error; // Lanza el error para manejarlo donde se llame
      }
    }

    // Obtener mensajes
    static async getMessages(subastaId) {
      try {
        const [messages] = await conection.promise().query(
          `SELECT m.*, u.usuario as user, m.monto as bid, m.fecha_hora as timestamp
          FROM mensajes_subasta m
          JOIN usuarios u ON m.id_usuario = u.id
          WHERE m.id_subasta = ?
          ORDER BY m.fecha_hora ASC`,
          [subastaId]
        );
        return messages; // Retorna la lista de mensajes
      } catch (error) {
        console.error('Error al obtener mensajes:', error);
        throw error; // Lanza el error para manejarlo donde se llame
      }
    }
  }

  module.exports = MessageService;
