const { conection } = require("../database/db");
const MessageService = require("./messageService");
const CountdownService = require("./countdownService"); // Import CountdownService

class AuctionService {
    static countdownService;

    static setCountdownService(service) {
        this.countdownService = service;
    }

    static async getAuctionState(room) {
        try {
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
                     LIMIT 1) as current_winner,
                    s.precio_base
                FROM subastas s 
                WHERE s.id = ?`,
                [room]
            );

            if (results.length === 0) return null;

            const messages = await MessageService.getMessages(room);

            return {
                auctionEnded: results[0].auctionEnded === 1,
                currentWinner: results[0].current_winner || null,
                currentBid: parseFloat(results[0].current_bid) || results[0].precio_base,
                startTime: results[0].fecha_hora_inicio,
                endTime: results[0].fecha_hora_fin,
                precio_base: results[0].precio_base,
                messages,
            };
        } catch (error) {
            console.error("[AuctionService] Error en getAuctionState:", error);
            return null;
        }
    }

    static async getActiveBots() {
        try {
            const [results] = await conection.promise().query(
                'SELECT id, bot_name FROM bot_configs WHERE is_active = true'
            );
            return results;
        } catch (error) {
            console.error("[AuctionService] Error al obtener bots activos:", error);
            return [];
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
            console.error("[AuctionService] Error al obtener ID de usuario:", error);
            return null;
        }
    }

    static async saveBid(room, userId, bidValue, username) {
        try {
            // Verificar si ya existe una puja idéntica en el último segundo
            const [existingBid] = await conection.promise().query(
                `SELECT id FROM ofertas 
                 WHERE id_subasta = ? 
                 AND id_usuario = ? 
                 AND monto_oferta = ? 
                 AND fecha_subasta >= CURDATE() 
                 AND hora_subasta >= DATE_SUB(CURTIME(), INTERVAL 1 SECOND)`,
                [room, userId, bidValue]
            );

            if (existingBid.length > 0) {
                console.log('[AuctionService] Puja duplicada detectada, ignorando...');
                return { success: false, error: 'Puja duplicada' };
            }

            await conection.promise().query(
                `INSERT INTO ofertas (id_subasta, id_usuario, monto_oferta, fecha_subasta, hora_subasta) 
                 VALUES (?, ?, ?, CURDATE(), CURTIME())`,
                [room, userId, bidValue]
            );

            // Guardar el mensaje de la puja
            const messageText = `${username} ha pujado con ${bidValue}`;
            const messageId = await MessageService.saveMessage(room, userId, messageText, bidValue);

            // Reset the countdown timer
            this.countdownService.resetCountdown(room);

            return { 
                success: true,
                messageId,
                messageText,
                bidValue,
                username
            };
        } catch (error) {
            console.error("[AuctionService] Error al guardar puja:", error);
            return { success: false, error };
        }
    }

    static async endAuction(room) {
        try {
            // Obtener la última oferta de la subasta
            const [lastBid] = await conection.promise().query(
                `SELECT o.*, u.usuario, u.id, u.oportunidades
                 FROM ofertas o
                 JOIN usuarios u ON o.id_usuario = u.id
                 WHERE o.id_subasta = ?
                 ORDER BY o.fecha_subasta DESC, o.hora_subasta DESC
                 LIMIT 1`,
                [room]
            );
    
            // Si hay una oferta, extraer los datos del ganador
            const winnerId = lastBid.length > 0 ? lastBid[0].id : null;
            const winnerUsername = lastBid.length > 0 ? lastBid[0].usuario : 'DESIERTA';
            const finalBid = lastBid.length > 0 ? lastBid[0].monto_oferta : null;
    
            // Actualizar la subasta con los datos del ganador
            await conection.promise().query(
                `UPDATE subastas 
                 SET auctionEnded = 1,
                     currentWinner = ?,
                     currentBid = ?
                 WHERE id = ?`,
                [winnerUsername, finalBid, room]
            );
    
            // Si hay un ganador válido, restar una oportunidad (sin permitir negativas)
            if (winnerId !== null) {
                await conection.promise().query(
                    `UPDATE usuarios 
                     SET oportunidades = oportunidades - 1 
                     WHERE id = ? AND oportunidades > 0`,
                    [winnerId]
                );
            }
    
            return {
                success: true,
                winner: winnerUsername,
                finalBid
            };
        } catch (error) {
            console.error("[AuctionService] Error al finalizar subasta:", error);
            throw error;
        }
    }
    
}

module.exports = AuctionService;