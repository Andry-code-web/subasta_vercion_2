document.addEventListener('DOMContentLoaded', () => {
    const activarMenu = document.getElementById('menu_activar');
    const cerrarMenu = document.getElementById('menu_cerrar');
    const conterMenu = document.getElementById('menu_navegador');

    activarMenu.addEventListener('click', () => {
        console.log("serealizo click");
        
        conterMenu.classList.add('active');
    });

    cerrarMenu.addEventListener('click', () => {
        conterMenu.classList.remove('active');
    });
})