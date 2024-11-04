class CountdownService {
  constructor(io) {
    this.io = io;
    this.countdowns = new Map();
  }

  startCountdown(room) {
    if (this.countdowns.has(room)) {
      clearInterval(this.countdowns.get(room).interval);
    }

    const countdown = {
      timeLeft: 180,
      interval: setInterval(() => {
        const current = this.countdowns.get(room);
        if (!current) return;

        current.timeLeft -= 1;
        this.io.to(room).emit("updateCountdown", current.timeLeft);

        if (current.timeLeft <= 0) {
          this.stopCountdown(room);
          this.io.to(room).emit("auctionEnded", { timeExpired: true });
        }
      }, 1000),
    };

    this.countdowns.set(room, countdown);
    return countdown.timeLeft;
  }

  resetCountdown(room) {
    this.stopCountdown(room);
    const timeLeft = this.startCountdown(room);
    this.io.to(room).emit("syncCountdown", timeLeft);
  }

  stopCountdown(room) {
    const countdown = this.countdowns.get(room);
    if (countdown) {
      clearInterval(countdown.interval);
      this.countdowns.delete(room);
    }
  }

  getTimeLeft(room) {
    return this.countdowns.get(room)?.timeLeft || 180;
  }
}

module.exports = CountdownService;
