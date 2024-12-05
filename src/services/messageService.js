const { conection } = require("../database/db");

class MessageService {
    static async saveMessage(room, userId, message, amount) {
        try {
            const [existingMessage] = await conection.promise().query(
                `SELECT id FROM mensajes_subasta 
                 WHERE id_subasta = ? 
                 AND id_usuario = ? 
                 AND mensaje = ? 
                 AND monto = ? 
                 AND fecha_hora >= NOW() - INTERVAL 1 SECOND`,
                [room, userId, message, amount]
            );

            if (existingMessage.length > 0) {
                console.log('[MessageService] Mensaje duplicado detectado, ignorando...');
                return existingMessage[0].id;
            }

            const [result] = await conection.promise().query(
                `INSERT INTO mensajes_subasta (id_subasta, id_usuario, mensaje, monto, fecha_hora) 
                 VALUES (?, ?, ?, ?, NOW())`,
                [room, userId, message, amount]
            );

            return result.insertId;
        } catch (error) {
            console.error('[MessageService] Error al guardar mensaje:', error);
            throw error;
        }
    }

    static async getMessages(room) {
        try {
            const [messages] = await conection.promise().query(
                `SELECT DISTINCT
                    m.id,
                    m.id_subasta,
                    m.id_usuario,
                    m.mensaje,
                    m.monto,
                    m.fecha_hora,
                    u.usuario as user,
                    m.monto as bid,
                    m.fecha_hora as timestamp
                 FROM mensajes_subasta m
                 JOIN usuarios u ON m.id_usuario = u.id
                 WHERE m.id_subasta = ?
                 ORDER BY m.fecha_hora ASC`,
                [room]
            );
            return messages;
        } catch (error) {
            console.error('[MessageService] Error al obtener mensajes:', error);
            return [];
        }
    }
}

module.exports = MessageService;