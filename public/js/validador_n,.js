document.addEventListener('DOMContentLoaded', function () {
    function validateForm() {
        let valid = true;

        // Limpiar mensajes de error
        clearErrorMessages();

        // Validación del DNI
        const dni = document.querySelector('#input_dni').value;
        const dniError = document.querySelector('#dniError');
        const dniStatus = document.querySelector('#dniStatus');
        if (!dni) {
            if (dniError) dniError.textContent = '(x) El campo DNI es obligatorio.';
            valid = false;
        } else {
            if (!validateDNI(dni)) {
                if (dniError) dniError.textContent = 'DNI inválido.';
                if (dniStatus) dniStatus.textContent = 'DNI incorrecto';
                valid = false;
            } else {
                if (dniError) dniError.textContent = ''; // Asegúrate de que el error de DNI esté vacío
                if (dniStatus) dniStatus.textContent = 'DNI válido'; // Mostrar solo un mensaje de estado
            }
        }

        // Validación del email
        const email = document.querySelector('#email').value;
        const confirmacion_email = document.querySelector('#confirmacion_email').value;
        const emailError = document.querySelector('#emailError');
        const confirmacion_emailError = document.querySelector('#confirmacion_emailError');
        
        if (!email) {
            if (emailError) emailError.textContent = '(x) El campo email es obligatorio.';
            valid = false;
        } else if (!isValidEmail(email)) {
            if (emailError) emailError.textContent = 'Email inválido.';
            valid = false;
        }
        
        if (!confirmacion_email) {
            if (confirmacion_emailError) confirmacion_emailError.textContent = 'Confirma tu email.';
            valid = false;
        } else if (email !== confirmacion_email) {
            if (confirmacion_emailError) confirmacion_emailError.textContent = 'Los emails no coinciden.';
            valid = false;
        }

        // Validación del nombre y apellidos
        const nombre = document.querySelector('#input_nombre').value;
        const nombreError = document.querySelector('#nombreError');
        
        if (!nombre) {
            if (nombreError) nombreError.textContent = '(x) El campo nombre es obligatorio.';
            valid = false;
        } else if (/\d/.test(nombre)) {
            if (nombreError) nombreError.textContent = 'El nombre no debe contener números.';
            valid = false;
        } else {
            if (nombreError) nombreError.textContent = ''; // Asegúrate de que el error de nombre esté vacío
        }

        // Validación de la fecha de nacimiento
        const fechaNacimiento = document.querySelector('#fecha_nacimiento').value;
        const fechaNacimientoError = document.querySelector('#fechaNacimientoError');
        const fechaNacimientoStatus = document.querySelector('#fechaNacimientoStatus');

        if (!fechaNacimiento) {
            if (fechaNacimientoError) fechaNacimientoError.textContent = '(x) Fecha es obligatoria.';
            valid = false;
        } else if (!isMayorDeEdad(fechaNacimiento)) {
            if (fechaNacimientoError) fechaNacimientoError.textContent = 'Debes ser mayor de edad.';
            if (fechaNacimientoStatus) fechaNacimientoStatus.textContent = 'No es mayor de edad';
            valid = false;
        } else {
            if (fechaNacimientoStatus) fechaNacimientoStatus.textContent = 'Es mayor de edad';
        }

        if (valid) {
            nextStep(1); // Llama a la función que avanza al siguiente paso
        }
    }

    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.textContent = '');

        const statusMessages = document.querySelectorAll('.status-message');
        statusMessages.forEach(el => el.textContent = '');
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function isMayorDeEdad(fecha) {
        const hoy = new Date();
        const fechaNacimiento = new Date(fecha);
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }
        return edad >= 18;
    }

    /* function validateDNI(dni) {
        const formattedDni = dni.replace('-', '').trim().toUpperCase();
        if (!formattedDni || formattedDni.length < 9) return false;
        const multiples = [3, 2, 7, 6, 5, 4, 3, 2];
        const dcontrols = {
            numbers: [6, 7, 8, 9, 0, 1, 1, 2, 3, 4, 5],
            letters: ['K', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        };
        const numdni = formattedDni.substring(0, formattedDni.length - 1).split('');
        const dcontrol = formattedDni.substring(formattedDni.length - 1);
        const dsum = numdni.reduce((acc, digit, index) => {
            acc += digit * multiples[index];
            return acc;
        }, 0);
        const key = 11 - (dsum % 11);
        const index = (key === 11) ? 0 : key;
        if (/^\d+$/.test(formattedDni)) {
            return dcontrols.numbers[index] === parseInt(dcontrol, 10);
        }
        return dcontrols.letters[index] === dcontrol;
    } */

        function validateDNI(dni) {
            const formattedDni = dni.trim(); // Quitar espacios en blanco
            return /^\d{8}$/.test(formattedDni); // Verifica si tiene exactamente 8 dígitos
        }
        

    function nextStep(step) {
        const steps = document.querySelectorAll('.step');
        const currentStep = document.querySelector('.step.active');

        if (currentStep) {
            currentStep.classList.remove('active');
        }

        if (steps[step]) {
            steps[step].classList.add('active');
        }

        // Actualizar los botones de navegación (opcional)
        updateNavigationButtons(step);

        console.log('Avanzando al siguiente paso:', step);
    }

    function previousStep(step) {
        const steps = document.querySelectorAll('.step');
        const currentStep = document.querySelector('.step.active');

        if (currentStep) {
            currentStep.classList.remove('active');
        }

        if (steps[step]) {
            steps[step].classList.add('active');
        }

        // Actualizar los botones de navegación (opcional)
        updateNavigationButtons(step);

        console.log('Retrocediendo al paso:', step);
    }

    function updateNavigationButtons(step) {
        const nextButton = document.querySelector('button.next-step');
        const previousButton = document.querySelector('button.previous-step');

        // Deshabilitar el botón de siguiente si es el último paso
        if (step === document.querySelectorAll('.step').length - 1) {
            if (nextButton) nextButton.disabled = true;
        } else {
            if (nextButton) nextButton.disabled = false;
        }

        // Hacer visible el botón de anterior si no es el primer paso
        if (step === 0) {
            if (previousButton) previousButton.style.display = 'none';
        } else {
            if (previousButton) previousButton.style.display = 'inline-block';
        }
    }

    document.querySelector('#registroForm').addEventListener('submit', finalizarForm);

    function finalizarForm(event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        const terminosChecked = document.querySelector('#terminos_y_condiciones').checked;
        const usuario = document.querySelector('#usuario').value;
        const contraseña = document.querySelector('#contraseña').value;

        if (!terminosChecked) {
            alert('Debes aceptar los términos y condiciones.');
            return;
        }

        // Aquí puedes agregar más validaciones si es necesario

        const formData = new FormData(document.querySelector('#registroForm'));

        fetch('/registro', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/login'; // Redirige al usuario a la página de login
                } else {
                    return response.text().then(text => {
                        alert('Error: ' + text);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Inicializa el primer paso como activo
    nextStep(0);

    // Exponer las funciones globalmente
    window.validateForm = validateForm;
    window.nextStep = nextStep;
    window.previousStep = previousStep;
    window.finalizeForm = finalizarForm;
});
