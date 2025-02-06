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

            const basePrice = auctionState.precio_base;
            const currentBid = auctionState.currentBid;
            const maxAllowedBid = basePrice * 1.2;

            console.log(`[BotService] Base price: ${basePrice}, Current bid: ${currentBid}, Max allowed bid: ${maxAllowedBid}`);

            // Check if the current bid exceeds the base price by 20%
            if (currentBid >= maxAllowedBid) {
                console.log(`[BotService] Bot bidding stopped for room ${room} as current bid exceeds 20% of base price.`);
                this.stopBotBidding(room);
                return;
            }

            const bidDetails = await this.bidManager.prepareBotBid(room, bots, auctionState);
            if (!bidDetails) return;

            // Ensure the bot's bid does not exceed the 20% limit before scheduling the bid
            if (bidDetails.nextBid > maxAllowedBid) {
                console.log(`[BotService] Bot bid of ${bidDetails.nextBid} exceeds 20% of base price. Stopping bot bidding.`);
                this.stopBotBidding(room);
                return;
            }

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
        }, 5500);

        this.stateManager.setBidTimeout(room, timeout);
    }

    async processBotBid(room, botName, bidAmount) {
        try {
            const auctionState = await AuctionService.getAuctionState(room);
            const basePrice = auctionState.precio_base;
            const maxAllowedBid = basePrice * 1.2;

            console.log(`[BotService] Processing bot bid: ${bidAmount}, Base price: ${basePrice}, Max allowed bid: ${maxAllowedBid}`);

            // Check if the current bid exceeds the base price by 20%
            if (bidAmount > maxAllowedBid) {
                console.log(`[BotService] Bot bid of ${bidAmount} exceeds 20% of base price. Stopping bot bidding.`);
                this.stopBotBidding(room);
                return { success: false };
            }

            if (this.stateManager.shouldStopBidding(room, auctionState)) {
                return { success: false };
            }

            const userId = await AuctionService.getUserId(botName);
            if (!userId) return { success: false };

            // Ensure the bot's bid is higher than the current highest bid
            const nextBid = auctionState.currentBid + 100;
            if (nextBid > maxAllowedBid) {
                console.log(`[BotService] Bot bid of ${nextBid} exceeds 20% of base price. Stopping bot bidding.`);
                this.stopBotBidding(room);
                return { success: false };
            }

            const result = await AuctionService.saveBid(room, userId, nextBid, botName);
            if (result.success) {
                await this.emitBidUpdates(room, result, botName, nextBid);
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

            const basePrice = updatedState.precio_base;
            const currentBid = updatedState.currentBid;
            const maxAllowedBid = basePrice * 1.2;

            console.log(`[BotService] Base price: ${basePrice}, Current bid: ${currentBid}, Max allowed bid: ${maxAllowedBid}`);

            // Stop further bidding if the current bid has reached or exceeded the 20% limit
            if (currentBid >= maxAllowedBid) {
                console.log(`[BotService] Bot bidding stopped for room ${room} as current bid has reached or exceeded 20% of base price.`);
                this.stopBotBidding(room);
                return;
            }

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
