
const socket = io();

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const btnMas = document.getElementById('mas');
const btnMenos = document.getElementById('menos');
const progressBar = document.getElementById('progressBar');

const auctionRoom = '<%= subasta.id %>';
socket.emit('joinRoom', auctionRoom);

const precioBase = '<%= subasta.precio_base %>';
const precioNum = parseInt(precioBase);
const precioBaseConIncremento = precioNum + 100;

messageInput.value = formatNumber(precioBaseConIncremento);

let progressInterval;
let progressValue = 100;
let auctionCount = 0;
let auctionInProgress = false; // Variable para controlar si la subasta está en progreso
let auctionEnded = false; // Variable para controlar si la subasta ha terminado

function startProgressBar() {
    if (auctionEnded) return; // No iniciar la barra de progreso si la subasta ha terminado

    progressValue = 100;
    auctionCount = 0;
    progressBar.style.width = `${progressValue}%`;

    if (progressInterval) {
        clearInterval(progressInterval);
    }

    auctionInProgress = true; // Indicar que la subasta está en progreso

    progressInterval = setInterval(() => {
        progressValue -= 1;
        progressBar.style.width = `${progressValue}%`;

        if (progressValue <= 50 && auctionCount === 0) {
            auctionCount = 1;
            addAuctionMessage("a la 1");
        } else if (progressValue <= 25 && auctionCount === 1) {
            auctionCount = 2;
            addAuctionMessage("a las 2");
        } else if (progressValue <= 0 && auctionCount === 2) {
            auctionCount = 3;
            addAuctionMessage("a las 3");
            clearInterval(progressInterval);
            if (auctionInProgress) {
                auctionInProgress = false; // Finalizar la subasta
                auctionEnded = true; // Marcar la subasta como terminada
                const winner = '<%= usuario ? usuario.nombre : "Invitado" %>'; // Obtener el nombre del usuario ganador
                const messageElement = document.createElement('div');
                messageElement.textContent = `¡Subasta ganada por ${winner}!`;
                messages.appendChild(messageElement);
                messages.scrollTop = messages.scrollHeight;
                disableButtons(); // Desactivar los botones
            }
        }
    }, 100); // Ajusta la velocidad de la barra de progreso según sea necesario
}

function addAuctionMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.textContent = text;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}

btnMas.addEventListener('click', function () {
    if (auctionEnded) return; // No permitir cambios si la subasta ha terminado

    let currentBid = parseInt(messageInput.value.replace(/,/g, ''));
    currentBid += 100;
    messageInput.value = formatNumber(currentBid);
});

btnMenos.addEventListener('click', function () {
    if (auctionEnded) return; // No permitir cambios si la subasta ha terminado

    let currentBid = parseInt(messageInput.value.replace(/,/g, ''));
    if (currentBid > precioNum) {
        currentBid -= 100;
        if (currentBid < precioNum) {
            currentBid = precioNum;
        }
        messageInput.value = formatNumber(currentBid);
    }
});

sendButton.addEventListener('click', function () {
    if (auctionEnded) return; // No permitir envíos si la subasta ha terminado

    const bid = messageInput.value.replace(/,/g, '');
    socket.emit('bid', {
        user: '<%= usuario ? usuario.nombre : "Invitado" %>',
        bid: bid,
        room: auctionRoom
    });
    startProgressBar();
});

socket.on('newBid', function (data) {
    if (auctionEnded) return; // No aceptar nuevas pujas si la subasta ha terminado

    const messageElement = document.createElement('div');
    messageElement.textContent = `Puja de $${formatNumber(data.bid)} por ${data.user}`;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
    clearInterval(progressInterval);
    startProgressBar();
});

messageInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

function disableButtons() {
    btnMas.disabled = true;
    btnMenos.disabled = true;
    sendButton.disabled = true;
    messageInput.disabled = true;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
