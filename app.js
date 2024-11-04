const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

// Conección a la base de datos
const { conection } = require("./src/database/db");
const sessionStore = require("./src/database/sessionStore");
const AuctionService = require("./src/services/AuctionService");
const MessageService = require("./src/services/MessageService");
const CountdownService = require('./src/services/countdownService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

// Instanciar CountdownService
const countdownService = new CountdownService(io);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "120mb",
    parameterLimit: 5000000,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Configuración de la sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || "SUBASTASONLINE",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
    },
  })
);

// Routers
const usersRouter = require("./src/routes/user_routes");
const adminRouter = require("./src/routes/admin_routes");

app.use("/", usersRouter);
app.use("/admin", adminRouter);

// Configuración de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "public")));

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('joinRoom', async (room, userName) => {
    try {
      socket.join(room);
      const auctionState = await AuctionService.getAuctionState(room);

      if (auctionState) {
        socket.emit('auctionState', {
          ...auctionState,
          timeLeft: countdownService.getTimeLeft(room) // Aquí accedemos a getTimeLeft
        });

        if (!auctionState.auctionEnded) {
          countdownService.startCountdown(room);
        }
      }
    } catch (error) {
      console.error('Error al unirse a la sala:', error);
    }
  });

  // Manejo de pujas
  socket.on('bid', async (data) => {
    try {
      const userId = await AuctionService.getUserId(data.user);
      if (!userId) {
        console.error('Usuario no encontrado:', data.user);
        return;
      }

      const success = await AuctionService.saveBid(data.room, userId, data.bid, data.user);
      if (success) {
        countdownService.resetCountdown(data.room);
        const updatedState = await AuctionService.getAuctionState(data.room);
        io.to(data.room).emit('auctionState', {
          ...updatedState,
          timeLeft: countdownService.getTimeLeft(data.room)
        });
      }
    } catch (error) {
      console.error('Error al procesar puja:', error);
    }
  });

  // Manejo de mensajes
  socket.on('sendMessage', (data) => {
    const { subastaId, userId, mensaje, monto } = data;

    MessageService.saveMessage(subastaId, userId, mensaje, monto, (error, messageId) => {
      if (error) {
        console.error('Error al guardar el mensaje:', error);
        return;
      }
      // Emitir el mensaje guardado a todos los clientes en la sala
      io.to(subastaId).emit('newMessage', { messageId, userId, mensaje, monto });
    });
  });

  // Finalizar subasta
  socket.on('endAuction', async (room) => {
    try {
      await AuctionService.endAuction(room);
      countdownService.stopCountdown(room);
      const finalState = await AuctionService.getAuctionState(room);
      io.to(room).emit('auctionState', finalState);
    } catch (error) {
      console.error('Error al finalizar subasta:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.timeout = 0;

// Iniciar el servidor
server.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});