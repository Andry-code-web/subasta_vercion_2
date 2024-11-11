class CountdownService {
  constructor(io) {
    this.io = io;
    this.countdowns = new Map();
    this.FULL_TIME = 180; // 3 minutos en segundos
  }

  startCountdown(room) {
    if (this.countdowns.has(room)) {
      clearInterval(this.countdowns.get(room).interval);
    }

    const countdown = {
      timeLeft: this.FULL_TIME,
      interval: setInterval(async () => {
        const current = this.countdowns.get(room);
        if (!current) return;

        current.timeLeft -= 1;

        if (current.timeLeft === 120) {
          this.io.to(room).emit("auctionAlert", { message: "¡A la una!", timeLeft: current.timeLeft });
        } else if (current.timeLeft === 60) {
          this.io.to(room).emit("auctionAlert", { message: "¡A las dos!", timeLeft: current.timeLeft });
        } else if (current.timeLeft === 0) {
          this.io.to(room).emit("auctionAlert", { message: "¡A las tres!", timeLeft: current.timeLeft });
          
          try {
            const AuctionService = require('./auctionService');
            const result = await AuctionService.endAuction(room);
            
            this.stopCountdown(room);
            
            // Emitir el evento de finalización con los datos del ganador
            this.io.to(room).emit("auctionEnded", {
              timeExpired: true,
              winner: result.winner,
              finalBid: result.finalBid
            });
          } catch (error) {
            console.error('Error al finalizar la subasta:', error);
          }
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
      
      countdown.interval = setInterval(async () => {
        countdown.timeLeft -= 1;
        
        if (countdown.timeLeft === 120) {
          this.io.to(room).emit("auctionAlert", { message: "¡A la una!", timeLeft: countdown.timeLeft });
        } else if (countdown.timeLeft === 60) {
          this.io.to(room).emit("auctionAlert", { message: "¡A las dos!", timeLeft: countdown.timeLeft });
        } else if (countdown.timeLeft === 0) {
          this.io.to(room).emit("auctionAlert", { message: "¡A las tres!", timeLeft: countdown.timeLeft });
          
          try {
            const AuctionService = require('./auctionService');
            const result = await AuctionService.endAuction(room);
            
            this.stopCountdown(room);
            
            // Emitir el evento de finalización con los datos del ganador
            this.io.to(room).emit("auctionEnded", {
              timeExpired: true,
              winner: result.winner,
              finalBid: result.finalBid
            });
          } catch (error) {
            console.error('Error al finalizar la subasta:', error);
          }
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
    const countdown = this.countdowns.get(room);
    return countdown ? countdown.timeLeft : null;
  }

  isRunning(room) {
    return this.countdowns.has(room);
  }
}

module.exports = CountdownService;