const AuctionService = require('./auctionService');
const MessageService = require('./messageService');
const BotUserService = require('./botUserService');

class BotService {
    constructor(io) {
        this.io = io;
        this.activeBotRooms = new Set();
        this.botBidCounts = new Map();
        this.botsUsedInCurrentBidding = new Map();
        this.bidTimeouts = new Map();
        this.processingBids = new Map();
    }

    async startBotBidding(room) {
        console.log(`[BotService] Iniciando pujas de bots en sala ${room}`);

        if (this.activeBotRooms.has(room)) {
            console.log(`[BotService] Los bots ya están activos en la sala ${room}`);
            return;
        }

        const bots = await AuctionService.getActiveBots();
        console.log(`[BotService] Bots activos encontrados:`, bots);

        if (!bots || bots.length === 0) {
            console.log('[BotService] No hay bots activos disponibles');
            return;
        }

        await BotUserService.ensureBotsRegistered(bots);

        this.activeBotRooms.add(room);
        this.botBidCounts.set(room, 0);
        this.botsUsedInCurrentBidding.set(room, new Set());
        await this.initiateBotBidding(room, bots);
    }

    async initiateBotBidding(room, bots) {
        try {
            const auctionState = await AuctionService.getAuctionState(room);
            console.log(`[BotService] Estado actual de la subasta:`, auctionState);
    
            if (!auctionState) {
                console.log(`[BotService] No se pudo obtener el estado de la subasta para sala ${room}`);
                return;
            }
    
            const currentBid = parseFloat(auctionState.currentBid);
            const randomBot = bots[Math.floor(Math.random() * bots.length)];
    
            const usedBots = this.botsUsedInCurrentBidding.get(room);
            if (usedBots.has(randomBot.bot_name)) {
                console.log(`[BotService] El bot ${randomBot.bot_name} ya ha pujado. Eligiendo otro bot.`);
                return;
            }
    
            const botCount = this.botBidCounts.get(room) || 0;
            if (botCount >= 10) { // Asegurarse de que no supere las 10 pujas
                console.log(`[BotService] Límite de 10 pujas alcanzado en sala ${room}`);
                this.stopBotBidding(room); // Detener las pujas de bots
                return;
            }
    
            const nextBid = this.calculateNextBid(currentBid);
            const bidKey = `${room}-${randomBot.bot_name}-${nextBid}`;
            const now = Date.now();
    
            const lastBidTime = this.processingBids.get(bidKey);
            if (lastBidTime && now - lastBidTime < 1000) {
                console.log(`[BotService] Puja muy reciente para ${bidKey}, esperando...`);
                return;
            }
    
            this.processingBids.set(bidKey, now);
            usedBots.add(randomBot.bot_name);
    
            console.log(`[BotService] Bot ${randomBot.bot_name} preparando puja de ${nextBid}`);
    
            const timeout = setTimeout(async () => {
                try {
                    const result = await this.processBotBid(room, randomBot.bot_name, nextBid);
                    if (result.success) {
                        this.botBidCounts.set(room, botCount + 1); // Incrementa el conteo de pujas
                        if (this.activeBotRooms.has(room) && botCount < 9) { // Continuar solo si hay menos de 10 pujas
                            await this.initiateBotBidding(room, bots);
                        }
                    }
                } finally {
                    setTimeout(() => {
                        this.processingBids.delete(bidKey);
                    }, 300);
                }
            }, 50); // Tiempo entre pujas reducido a 500ms
    
            this.bidTimeouts.set(room, timeout);
        } catch (error) {
            console.error('[BotService] Error en initiateBotBidding:', error);
        }
    }
    

    calculateNextBid(currentBid) {
        const increment = 100;
        return currentBid + increment;
    }

    async processBotBid(room, botName, bidAmount) {
        try {
            console.log(`[BotService] Procesando puja del bot ${botName} por ${bidAmount}`);
        
            const userId = await AuctionService.getUserId(botName);
            if (!userId) {
                console.log(`[BotService] No se encontró ID para el bot ${botName}`);
                return { success: false };
            }
        
            const result = await AuctionService.saveBid(room, userId, bidAmount, botName);
            console.log(`[BotService] Resultado de la puja:`, result);
        
            if (result.success) {
                const bidData = {
                    id: result.messageId,
                    user: botName,
                    mensaje: result.messageText,
                    monto: bidAmount,
                    bid: bidAmount,
                    room: room,
                    timestamp: new Date()
                };
        
                this.io.to(room).emit('bid', bidData);
        
                // Reiniciar la barra de progreso
                this.io.to(room).emit('resetProgressBar');
        
                const updatedState = await AuctionService.getAuctionState(room);
                this.io.to(room).emit('auctionState', {
                    ...updatedState,
                    timeLeft: 30,
                    countdownRunning: true
                });
            }
        
            return result;
        } catch (error) {
            console.error('[BotService] Error en processBotBid:', error);
            return { success: false };
        }
    }
    

    handleUserBid(room) {
        console.log(`[BotService] Usuario realizó puja en sala ${room}`);
        this.botBidCounts.set(room, 0);
        this.botsUsedInCurrentBidding.get(room)?.clear();

        const timeout = this.bidTimeouts.get(room);
        if (timeout) {
            clearTimeout(timeout);
            this.bidTimeouts.delete(room);
        }

        setTimeout(() => {
            if (this.activeBotRooms.has(room)) {
                this.startBotBidding(room);
            }
        }, 2000);
    }

    stopBotBidding(room) {
        console.log(`[BotService] Deteniendo pujas de bots en sala ${room}`);

        const timeout = this.bidTimeouts.get(room);
        if (timeout) {
            clearTimeout(timeout);
            this.bidTimeouts.delete(room);
        }

        this.activeBotRooms.delete(room);
        this.botBidCounts.delete(room);
        this.botsUsedInCurrentBidding.delete(room);
        
        for (const [key] of this.processingBids) {
            if (key.startsWith(`${room}-`)) {
                this.processingBids.delete(key);
            }
        }
    }
}

module.exports = BotService;