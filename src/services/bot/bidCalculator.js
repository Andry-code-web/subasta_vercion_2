function calculateNextBid(currentBid) {
    return currentBid + 100;
}

function calculateTargetPrice(initialBid) {
    return initialBid * 1.2; // 20% más que la puja inicial
}

module.exports = {
    calculateNextBid,
    calculateTargetPrice
};