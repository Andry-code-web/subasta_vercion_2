function iniciarConteoRegresivo(fechaObjetivo, elementoId) {
    const elemento = document.getElementById(elementoId);

    if (!elemento) return;

    const intervalo = setInterval(() => {
        const ahora = new Date().getTime();
        const tiempoRestante = fechaObjetivo - ahora;

        // Verifica si la subasta está finalizada o en curso
        const tiempoTranscurrido = ahora - fechaObjetivo;

        if (tiempoTranscurrido > 6 * 60 * 60 * 1000) {
            // Si han pasado más de 6 horas, la subasta está finalizada
            clearInterval(intervalo);
            elemento.textContent = "¡Subasta finalizada!";
            return;
        } else if (tiempoTranscurrido > 0 && tiempoTranscurrido <= 1 * 60 * 60 * 1000) {
            // Si han pasado entre 0 y 2 horas desde el inicio, la subasta está en curso
            elemento.textContent = "¡Subasta en curso!";
            return;
        }

        // Si la subasta aún no ha comenzado, muestra el tiempo restante
        if (tiempoRestante > 0) {
            const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
            const horas = Math.floor(
                (tiempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);

            elemento.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
        } else {
            // Si ha llegado la hora exacta, indica que está en curso
            elemento.textContent = "¡Subasta en curso!";
        }
    }, 1000);
}
