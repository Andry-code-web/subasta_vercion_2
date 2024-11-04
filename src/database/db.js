const mysql = require('mysql2');
require('dotenv').config();



// Configuración de la conexión a la base de datos
const conection = mysql.createPool({
    connectionLimit: 20,  // Número máximo de conexiones en el pool
    waitForConnections: true,  // Esperar si el pool está vacío
    queueLimit: 0,  // Sin límite en la cola de espera
    connectTimeout: 60000,  // Tiempo máximo para establecer la conexión
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});

// Función para ajustar el tamaño del pool de conexiones
const adjustConectionSize = (newLimit) => {
    conection.config.connectionLimit = newLimit;
}

// Manejo de eventos del pool de conexiones
conection.on('connection', (connection) => {
    console.log('Nueva conexión establecida a la base de datos');
});

conection.on('error', (err) => {
    console.error('Error en el pool de conexiones:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('La conexión a la base de datos se ha perdido. Intentando reconectar...');
        reconnect(); // Llamar a la función de reconexión
    } else {
        throw err; // Lanza el error si no es manejable
    }
});

// Función para reconectar a la base de datos en caso de desconexión
function reconnect() {
    conection.getConnection((err, connection) => {
        if (err) {
            console.error('Error al intentar reconectar a la base de datos:', err);
            setTimeout(reconnect, 2000); // Reintenta después de 2 segundos
        } else {
            console.log('Reconexión exitosa a la base de datos');
            connection.release(); // Libera la conexión
        }
    });
}


module.exports = { conection, adjustConectionSize };