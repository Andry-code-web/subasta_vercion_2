const AuctionService = require('../services/auctionService');
const MessageService = require('../services/messageService');
const BotUserService = require('../services/botUserService');
const BidManager = require('./bot/BidManager');
const BotStateManager = require('./bot/BotStateManager');
const { calculateNextBid, calculateTargetPrice } = require('./bot/bidCalculator');

class BotService {
    constructor(io) {
        this.io = io;
        this.bidManager = new BidManager();
        this.stateManager = new BotStateManager();
    }

    async startBotBidding(room) {
        const auctionState = await AuctionService.getAuctionState(room);
        if (this.stateManager.shouldSkipBidding(room, auctionState)) {
            return;
        }

        const bots = await AuctionService.getActiveBots();
        if (!bots || bots.length === 0) {
            console.log('[BotService] No hay bots activos disponibles');
            return;
        }

        await BotUserService.ensureBotsRegistered(bots);
        this.stateManager.initializeRoom(room);
        await this.initiateBotBidding(room, bots);
    }

    async initiateBotBidding(room, bots) {
        try {
            const auctionState = await AuctionService.getAuctionState(room);
            if (this.stateManager.shouldStopBidding(room, auctionState)) {
                return;
            }

            const bidDetails = await this.bidManager.prepareBotBid(room, bots, auctionState);
            if (!bidDetails) return;

            await this.scheduleBotBid(room, bots, bidDetails);
        } catch (error) {
            console.error('[BotService] Error en initiateBotBidding:', error);
            this.stopBotBidding(room);
        }
    }

    async scheduleBotBid(room, bots, { bot, nextBid }) {
        const timeout = setTimeout(async () => {
            try {
                const result = await this.processBotBid(room, bot.bot_name, nextBid);
                if (result.success) {
                    await this.handleSuccessfulBid(room, bots);
                }
            } finally {
                this.bidManager.cleanupBid(room, bot.bot_name, nextBid);
            }
        }, 2000);

        this.stateManager.setBidTimeout(room, timeout);
    }

    async processBotBid(room, botName, bidAmount) {
        try {
            const auctionState = await AuctionService.getAuctionState(room);
            if (this.stateManager.shouldStopBidding(room, auctionState)) {
                return { success: false };
            }

            const userId = await AuctionService.getUserId(botName);
            if (!userId) return { success: false };

            const result = await AuctionService.saveBid(room, userId, bidAmount, botName);
            if (result.success) {
                await this.emitBidUpdates(room, result, botName, bidAmount);
            }

            return result;
        } catch (error) {
            console.error('[BotService] Error en processBotBid:', error);
            return { success: false };
        }
    }

    async emitBidUpdates(room, result, botName, bidAmount) {
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
        this.io.to(room).emit('resetProgressBar');

        const updatedState = await AuctionService.getAuctionState(room);
        this.io.to(room).emit('auctionState', {
            ...updatedState,
            timeLeft: 30,
            countdownRunning: true
        });
    }

    async handleSuccessfulBid(room, bots) {
        try {
            console.log(`[BotService] Pujas exitosas en la sala ${room}`);

            // Actualizar el estado de la subasta (si aplica)
            const updatedState = await AuctionService.getAuctionState(room);
            this.io.to(room).emit('auctionState', updatedState);

            // Reiniciar el proceso de pujas para los bots
            if (this.stateManager.isRoomActive(room)) {
                await this.initiateBotBidding(room, bots);
            }
        } catch (error) {
            console.error('[BotService] Error en handleSuccessfulBid:', error);
            this.stopBotBidding(room);
        }
    }

    handleUserBid(room) {
        this.stateManager.resetBidCount(room);
        this.bidManager.clearUsedBots(room);
        this.stateManager.clearTimeout(room);

        setTimeout(() => {
            if (this.stateManager.isRoomActive(room)) {
                this.startBotBidding(room);
            }
        }, 2000);
    }

    stopBotBidding(room) {
        this.stateManager.cleanupRoom(room);
        this.bidManager.cleanupRoom(room);
    }
}

module.exports = BotService;