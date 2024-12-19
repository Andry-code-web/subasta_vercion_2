class BotStateManager {
    constructor() {
        this.activeBotRooms = new Set();
        this.botBidCounts = new Map();
        this.bidTimeouts = new Map();
        this.targetPrices = new Map();
    }

    shouldSkipBidding(room, auctionState) {
        if (this.activeBotRooms.has(room)) {
            console.log(`[BotService] Los bots ya están activos en la sala ${room}`);
            return true;
        }

        if (auctionState && auctionState.auctionEnded) {
            console.log(`[BotService] La subasta ${room} ya terminó. No se iniciarán pujas de bots.`);
            return true;
        }

        return false;
    }

    shouldStopBidding(room, auctionState) {
        if (!auctionState || auctionState.auctionEnded) {
            console.log(`[BotService] La subasta ${room} ha terminado. Deteniendo pujas de bots.`);
            return true;
        }

        const currentBid = parseFloat(auctionState.currentBid);
        const targetPrice = this.targetPrices.get(room);

        if (currentBid >= targetPrice) {
            console.log(`[BotService] Precio objetivo alcanzado en sala ${room}`);
            return true;
        }

        return false;
    }

    initializeRoom(room) {
        this.activeBotRooms.add(room);
        this.botBidCounts.set(room, 0);
    }

    isRoomActive(room) {
        return this.activeBotRooms.has(room);
    }

    setBidTimeout(room, timeout) {
        this.bidTimeouts.set(room, timeout);
    }

    clearTimeout(room) {
        const timeout = this.bidTimeouts.get(room);
        if (timeout) {
            clearTimeout(timeout);
            this.bidTimeouts.delete(room);
        }
    }

    resetBidCount(room) {
        this.botBidCounts.set(room, 0);
    }

    cleanupRoom(room) {
        this.clearTimeout(room);
        this.activeBotRooms.delete(room);
        this.botBidCounts.delete(room);
        this.targetPrices.delete(room);
    }
}

module.exports = BotStateManager;