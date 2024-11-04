const whatsappFlotante = document.querySelector('.whatsapp_flotante');

// Función para manejar el scroll
window.addEventListener('scroll', () => {
    // Calcular la altura total del documento
    const documentHeight = document.documentElement.scrollHeight; // Altura total del documento
    const windowHeight = window.innerHeight; // Altura de la ventana visible
    const scrollPosition = window.scrollY; // Posición actual del scroll

    // Calcular el límite para que el ícono se fije a 12rem
    const limit = documentHeight - windowHeight - 12 * parseFloat(getComputedStyle(document.documentElement).fontSize);

    if (scrollPosition > limit) {
        whatsappFlotante.style.bottom = '12rem'; // Fija a 12rem de la parte inferior
    } else {
        whatsappFlotante.style.bottom = '2rem'; // Vuelve a 2rem cuando no se está cerca del final
    }
});
