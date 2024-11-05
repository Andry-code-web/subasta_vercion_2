class CountdownService {
  constructor(io) {
    this.io = io;
    this.countdowns = new Map();
    this.hasStarted = new Map();
    this.FULL_TIME = 180; // 3 minutos en segundos
  }

  startCountdown(room) {
    if (this.countdowns.has(room)) {
      clearInterval(this.countdowns.get(room).interval);
    }

    const countdown = {
      timeLeft: this.FULL_TIME,
      interval: setInterval(() => {
        const current = this.countdowns.get(room);
        if (!current) return;

        current.timeLeft -= 1;
        
        if (current.timeLeft === 120) {
          this.io.to(room).emit("auctionAlert", { 
            message: "¡A la una!", 
            timeLeft: current.timeLeft 
          });
        } else if (current.timeLeft === 60) {
          this.io.to(room).emit("auctionAlert", { 
            message: "¡A las dos!", 
            timeLeft: current.timeLeft 
          });
        } else if (current.timeLeft === 0) {
          this.io.to(room).emit("auctionAlert", { 
            message: "¡A las tres!", 
            timeLeft: current.timeLeft 
          });
          this.stopCountdown(room);
          this.io.to(room).emit("auctionEnded", { timeExpired: true });
          return;
        }

        this.io.to(room).emit("updateCountdown", current.timeLeft);
      }, 1000),
    };

    this.countdowns.set(room, countdown);
    return countdown.timeLeft;
  }

  resetCountdown(room) {
    const countdown = this.countdowns.get(room);
    if (countdown) {
      clearInterval(countdown.interval);
      countdown.timeLeft = this.FULL_TIME;
      
      countdown.interval = setInterval(() => {
        countdown.timeLeft -= 1;
        
        if (countdown.timeLeft === 120) {
          this.io.to(room).emit("auctionAlert", { 
            message: "¡A la una!", 
            timeLeft: countdown.timeLeft 
          });
        } else if (countdown.timeLeft === 60) {
          this.io.to(room).emit("auctionAlert", { 
            message: "¡A las dos!", 
            timeLeft: countdown.timeLeft 
          });
        } else if (countdown.timeLeft === 0) {
          this.io.to(room).emit("auctionAlert", { 
            message: "¡A las tres!", 
            timeLeft: countdown.timeLeft 
          });
          this.stopCountdown(room);
          this.io.to(room).emit("auctionEnded", { timeExpired: true });
          return;
        }

        this.io.to(room).emit("updateCountdown", countdown.timeLeft);
      }, 1000);

      this.io.to(room).emit("syncCountdown", this.FULL_TIME);
    } else {
      this.startCountdown(room);
    }
  }

  stopCountdown(room) {
    const countdown = this.countdowns.get(room);
    if (countdown) {
      clearInterval(countdown.interval);
      this.countdowns.delete(room);
    }
  }

  getTimeLeft(room) {
    return this.countdowns.get(room)?.timeLeft || this.FULL_TIME;
  }

  isRunning(room) {
    return this.countdowns.has(room);
  }
}

module.exports = CountdownService;