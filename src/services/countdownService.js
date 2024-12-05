class CountdownService {
  constructor(io) {
    this.io = io;
    this.timers = new Map();
    this.intervals = new Map();
  }

  startCountdown(room) {
    this.stopCountdown(room);
    
    let timeLeft = 30; // 30 segundos
    
    // Crear el intervalo para actualizar la barra de progreso
    const interval = setInterval(() => {
      const percentage = (timeLeft / 30) * 100;
      this.io.to(room).emit('updateProgress', percentage);
      timeLeft--;
    }, 1000);
    
    // Crear el timeout para finalizar la subasta
    const timer = setTimeout(async () => {
      try {
        const AuctionService = require('./auctionService');
        await AuctionService.endAuction(room);
        
        this.io.to(room).emit('auctionEnded');
        this.stopCountdown(room);
      } catch (error) {
        console.error('Error al finalizar la subasta:', error);
        // Notificar el error pero mantener la subasta activa
        this.io.to(room).emit('auctionAlert', {
          message: 'Error al finalizar la subasta. Por favor, inténtelo de nuevo.',
          type: 'error'
        });
      }
    }, 30000);
    
    this.timers.set(room, timer);
    this.intervals.set(room, interval);
  }

  stopCountdown(room) {
    const timer = this.timers.get(room);
    const interval = this.intervals.get(room);
    
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(room);
    }
    
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(room);
    }
  }

  resetCountdown(room) {
    this.startCountdown(room);
  }

  isRunning(room) {
    return this.timers.has(room);
  }

  getTimeLeft(room) {
    // Implementar si es necesario
    return this.isRunning(room) ? 30 : 0;
  }
}

module.exports = CountdownService;