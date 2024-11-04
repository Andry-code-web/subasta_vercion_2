document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.keys');
    
    inputs.forEach((input, index) => {
      input.addEventListener('input', function () {
        let val = parseInt(this.value);
        if (isNaN(val) || val < 0 || val > 99) {
          this.value = '';
        }
  
        if (this.value.length === 2 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });
  
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && this.value === '') {
          if (index > 0) {
            inputs[index - 1].focus();
          }
        }
      });
    });
  
    document.getElementById('sendEmailBtn').addEventListener('click', () => {
      const email = document.getElementById('exampleInputEmail1').value;
  
      fetch('/admin/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      .then(response => response.text())
      .then(data => {
        if (data === 'Correo enviado') {
          document.getElementById('codeSection').style.display = 'block';
          document.getElementById('validateCodeBtn').style.display = 'block';
          document.getElementById('sendEmailBtn').style.display = 'none';
        } else {
          alert(data);
        }
      });
    });
  
    document.getElementById('validateCodeBtn').addEventListener('click', () => {
      const email = document.getElementById('exampleInputEmail1').value;
      const code = Array.from(document.querySelectorAll('.keys')).map(input => input.value).join('');
  
      fetch('/admin/validarCodigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      .then(response => response.text())
      .then(data => {
        if (data === 'Código de verificación correcto') {
          document.getElementById('passwordSection').style.display = 'block';
          document.getElementById('validateCodeBtn').style.display = 'none';
          document.getElementById('changePasswordBtn').style.display = 'block';
        } else {
          alert(data);
        }
      });
    });
  
    document.getElementById('changePasswordBtn').addEventListener('click', () => {
      const email = document.getElementById('exampleInputEmail1').value;
      const newPassword = document.getElementById('exampleInputContraseña').value;
      const confirmPassword = document.getElementById('exampleInputConfirmContraseña').value;
  
      if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
  
      fetch('/admin/cambiarContra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      })
      .then(response => response.text())
      .then(data => {
        if (data === 'Contraseña actualizada') {
          window.location.href = '/admin/loginAdminG';
        } else {
          alert(data);
        }
      });
    });
  });
  