class BidManager {
    constructor() {
        this.processingBids = new Map();
        this.botsUsedInCurrentBidding = new Map();
    }

    async prepareBotBid(room, bots, auctionState) {
        const currentBid = parseFloat(auctionState.currentBid);
        const availableBots = this.getAvailableBots(room, bots);
        
        if (availableBots.length === 0) {
            this.resetUsedBots(room);
            return null;
        }

        const bot = this.selectRandomBot(availableBots, bots);
        const nextBid = this.calculateNextBid(currentBid);
        
        if (this.isBidProcessing(room, bot.bot_name, nextBid)) {
            return null;
        }

        this.markBidAsProcessing(room, bot, nextBid);
        return { bot, nextBid };
    }

    getAvailableBots(room, bots) {
        const usedBots = this.botsUsedInCurrentBidding.get(room) || new Set();
        return bots.filter(bot => !usedBots.has(bot.bot_name));
    }

    selectRandomBot(availableBots, allBots) {
        return availableBots.length > 0 
            ? availableBots[Math.floor(Math.random() * availableBots.length)]
            : allBots[Math.floor(Math.random() * allBots.length)];
    }

    calculateNextBid(currentBid) {
        return currentBid + 100;
    }

    isBidProcessing(room, botName, bid) {
        return this.processingBids.has(`${room}-${botName}-${bid}`);
    }

    markBidAsProcessing(room, bot, bid) {
        const bidKey = `${room}-${bot.bot_name}-${bid}`;
        this.processingBids.set(bidKey, Date.now());
        
        const usedBots = this.botsUsedInCurrentBidding.get(room) || new Set();
        usedBots.add(bot.bot_name);
        this.botsUsedInCurrentBidding.set(room, usedBots);
    }

    cleanupBid(room, botName, bid) {
        this.processingBids.delete(`${room}-${botName}-${bid}`);
    }

    clearUsedBots(room) {
        const usedBots = this.botsUsedInCurrentBidding.get(room);
        if (usedBots) {
            usedBots.clear();
        }
    }

    resetUsedBots(room) {
        this.botsUsedInCurrentBidding.set(room, new Set());
    }

    cleanupRoom(room) {
        this.botsUsedInCurrentBidding.delete(room);
        for (const [key] of this.processingBids) {
            if (key.startsWith(`${room}-`)) {
                this.processingBids.delete(key);
            }
        }
    }
}

module.exports = BidManager;