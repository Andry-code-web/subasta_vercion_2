class CountdownService {
  constructor(io) {
    this.io = io;
    this.countdowns = new Map();
    this.FULL_TIME = 30; // Tiempo inicial en segundos
  }

  startCountdown(room) {
    if (this.countdowns.has(room)) {
      clearInterval(this.countdowns.get(room).interval);
    }

    const countdown = {
      timeLeft: this.FULL_TIME,
      lastMessage: null, // Almacena el último mensaje mostrado
      interval: this.createInterval(room),
    };

    this.countdowns.set(room, countdown);
    this.io.to(room).emit("syncProgress", 100); // Sincronización inicial
    return countdown.timeLeft;
  }

  resetCountdown(room) {
    const countdown = this.countdowns.get(room);
    if (countdown) {
      clearInterval(countdown.interval);
      countdown.timeLeft = this.FULL_TIME;
      countdown.interval = this.createInterval(room);

      // Resincroniza el progreso y último mensaje
      this.io.to(room).emit("syncProgress", 100);
      if (countdown.lastMessage) {
        this.io.to(room).emit("newMessage", { user: 'Sistema', mensaje: countdown.lastMessage });
      }
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

  createInterval(room) {
    return setInterval(async () => {
      const countdown = this.countdowns.get(room);
      if (!countdown) return;

      countdown.timeLeft -= 1;

      const progressPercentage = (countdown.timeLeft / this.FULL_TIME) * 100;

      // Emitir mensajes en los hitos del progreso
      if (progressPercentage <= 50 && progressPercentage > 49 && countdown.lastMessage !== "¡A la una!") {
        countdown.lastMessage = "¡A la una!";
        this.io.to(room).emit("newMessage", { user: 'Sistema', mensaje: "¡A la una!" });
      } else if (progressPercentage <= 25 && progressPercentage > 24 && countdown.lastMessage !== "¡A las dos!") {
        countdown.lastMessage = "¡A las dos!";
        this.io.to(room).emit("newMessage", { user: 'Sistema', mensaje: "¡A las dos!" });
      } else if (countdown.timeLeft === 0) {
        this.io.to(room).emit("newMessage", { user: 'Sistema', mensaje: "¡A las tres!" });

        try {
          const AuctionService = require('./auctionService');
          const result = await AuctionService.endAuction(room);

          this.stopCountdown(room);

          this.io.to(room).emit("auctionEnded", {
            timeExpired: true,
            winner: result.winner,
            finalBid: result.finalBid,
          });
        } catch (error) {
          console.error('Error al finalizar la subasta:', error);
        }
        return;
      }

      this.io.to(room).emit("updateProgress", progressPercentage);
    }, 1000);
  }
}

module.exports = CountdownService;
