class CountdownService {
  constructor(io) {
    this.io = io;
    this.countdowns = new Map();
    this.FULL_TIME = 20; // 
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
        
        // Calculate progress percentage
        const progressPercentage = (current.timeLeft / this.FULL_TIME) * 100;

        if (progressPercentage <= 50 && progressPercentage > 49) {
          this.io.to(room).emit("auctionAlert", { message: "¡A la una!", timeLeft: current.timeLeft });
        } else if (progressPercentage <= 25 && progressPercentage > 24) {
          this.io.to(room).emit("auctionAlert", { message: "¡A las dos!", timeLeft: current.timeLeft });
        } else if (current.timeLeft === 0) {
          this.io.to(room).emit("auctionAlert", { message: "¡A las tres!", timeLeft: current.timeLeft });
          
          try {
            const AuctionService = require('./auctionService');
            const result = await AuctionService.endAuction(room);
            
            this.stopCountdown(room);
            
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

        this.io.to(room).emit("updateProgress", progressPercentage);
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
        
        const progressPercentage = (countdown.timeLeft / this.FULL_TIME) * 100;

        if (progressPercentage <= 50 && progressPercentage > 49) {
          this.io.to(room).emit("auctionAlert", { message: "¡A la una!", timeLeft: countdown.timeLeft });
        } else if (progressPercentage <= 25 && progressPercentage > 24) {
          this.io.to(room).emit("auctionAlert", { message: "¡A las dos!", timeLeft: countdown.timeLeft });
        } else if (countdown.timeLeft === 0) {
          this.io.to(room).emit("auctionAlert", { message: "¡A las tres!", timeLeft: countdown.timeLeft });
          
          try {
            const AuctionService = require('./auctionService');
            const result = await AuctionService.endAuction(room);
            
            this.stopCountdown(room);
            
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

        this.io.to(room).emit("updateProgress", progressPercentage);
      }, 1000);

      this.io.to(room).emit("syncProgress", 100);
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