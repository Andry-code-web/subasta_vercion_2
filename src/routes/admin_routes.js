const express = require("express");
const bcrypt = require("bcrypt");
/* const crypto = require('crypto'); */
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const { conection } = require("../database/db");
const moment = require('moment');

const router = express.Router();

// Configuración de Multer para subida de archivos
const storage = multer.memoryStorage(); // Almacenamiento en memoria para leer los archivos
const upload = multer({ storage: storage });


/* ADMIN GENERAL */
router.get("/loginAdminG", (req, res) => {
  res.render("login_adminG");
});

router.post("/loginAdminG", (req, res) => {
  const { correo, contraseña } = req.body;

  const query = "SELECT * FROM admingeneral WHERE correo_electronico = ?";
  conection.query(query, [correo], (error, results) => {
    if (error) {
      console.error("Error al buscar el administrador general:", error);
      return res.status(500).send("Error al iniciar sesión");
    }

    if (results.length === 0) {
      return res.status(401).send("Correo electrónico no registrado");
    }

    const admingeneral = results[0];

    if (contraseña.trim() !== admingeneral.contraseña.trim()) {
      return res.status(401).send("Contraseña incorrecta");
    }

    req.session.admingeneralId = admingeneral.id;
    req.session.admingeneralNombreUsuario = admingeneral.nombre_usuario;

    // Redirige al usuario después de que la sesión se haya actualizado
    req.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesión:", err);
        return res.status(500).send("Error al iniciar sesión");
      }
      res.redirect("/admin/adminG");
    });
  });
});

router.get("/logout", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error al cerrar sesion ", err);
    }
    res.redirect("/admin/loginAdminG");
  });
});

router.get("/adminG", (req, res) => {
  // Middleware para asegurarse de que la sesión se haya actualizado
  if (!req.session.admingeneralNombreUsuario) {
    return res.redirect("/admin/loginAdminG");
  }

  const nombreUsuario = req.session.admingeneralNombreUsuario;

  const queryUsuarios = 'SELECT * FROM usuarios';
  const queryAdminVendedores = 'SELECT * FROM adminvendedor';
  const querySubastas = 'SELECT * FROM subastas';

  Promise.all([
    new Promise((resolve, reject) => {
      conection.query(queryUsuarios, (error, resultadosUsuarios) => {
        if (error) {
          console.error("Error al obtener los usuarios: ", error);
          reject(error);
        } else {
          resolve(resultadosUsuarios);
        }
      });
    }),
    new Promise((resolve, reject) => {
      conection.query(queryAdminVendedores, (error, resultadosAdminVendedores) => {
        if (error) {
          console.error("Error al obtener los admin vendedores: ", error);
          reject(error);
        } else {
          // Añadir estado "activo" basado en la sesión
          const adminVendedoresConEstado = resultadosAdminVendedores.map(adminVendedor => {
            return {
              ...adminVendedor,
              activo: adminVendedor.id === req.session.adminVendedorId && req.session.adminVendedorActivo
            };
          });
          resolve(adminVendedoresConEstado);
        }
      });
    }),
    new Promise((resolve, reject) => {
      conection.query(querySubastas, (error, resultadoSubastas) => {
        if (error) {
          console.error("Error al obtener los datos de subasta", error);
          reject(error);
        } else {
          resolve(resultadoSubastas);
        }
      });
    })
  ])
    .then(([usuarios, adminVendedores, subastas]) => {
      const numUsuarios = usuarios.length;
      const numAdminVendedores = adminVendedores.length;
      const numSubastas = subastas.length;

      res.render("adminGeneral", {
        nombreUsuario,
        usuarios,
        numUsuarios,
        adminVendedores,
        numAdminVendedores,
        subastas,
        numSubastas
      });
    })
    .catch((error) => {
      console.error("Error al obtener datos para la vista admingeneral: ", error);
      res.status(500).send("Error al obtener datos para la vista admingeneral");
    });
});

// Método POST para crear un nuevo admin vendedor
router.post("/crear-admin-vendedor", async (req, res) => {
  const { nombre_usuario, contraseña } = req.body;
  const id_admin_general = req.session.admingeneralId;

  if (!id_admin_general) {
    return res.status(401).send("Debe iniciar sesión como administrador general para crear un administrador vendedor.");
  }

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const query = "INSERT INTO adminvendedor (id_admin_general, nombre_usuario, contraseña) VALUES (?, ?, ?)";

    conection.query(query, [id_admin_general, nombre_usuario, hashedPassword], (error, results) => {
      if (error) {
        console.error("Error al crear el admin vendedor:", error);
        return res.status(500).send("Error al crear el admin vendedor");
      }
      res.redirect("/admin/loginAdminV");
    });
  } catch (error) {
    console.error("Error al encriptar la contraseña:", error);
    res.status(500).send("Error al crear el admin vendedor");
  }
});

//EDITAR EL USUARIO
router.get('/editarUsuario/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM usuarios WHERE id = ?';
  conection.query(query, [userId], (error, result) => {
    if (error) {
      console.error("Error al obtener el usuario para editar: ", error);
      return res.status(500).send("Error el usuario para editar");
    }

    if (result.length === 0) {
      return res.status(404).send("Usuario no encontrado");
    }

    const usuario = result[0];
    res.render('editarUsuario', { usuario });
  });
});

//prosesar la actualizacion de usuario
router.post('/editarUsuario/:id', (req, res) => {
  const userId = req.params.id;
  const { nombre, apellidos, dni, correo_electronico } = req.body;

  const query = 'UPDATE usuarios SET nombre = ?, apellidos = ?, dni = ?, correo_electronico = ? WHERE id = ?';
  conection.query(query, [nombre, apellidos, dni, correo_electronico, userId], (error, result) => {
    if (error) {
      console.error('Error al actualizar el usuario', error);
      return res.status(500).send('Error al actualizar el usuario');
    }
    res.redirect('/admin/adminG');
  })
});

// Ruta para eliminar usuario
router.delete('/eliminarUsuario/:id', (req, res) => {
  const userId = req.params.id;

  // Lógica para eliminar usuario en la base de datos
  const query = 'DELETE FROM usuarios WHERE id = ?';
  conection.query(query, [userId], (error, result) => {
    if (error) {
      console.error('Error al eliminar el usuario', error);
      return res.status(500).send('Error al eliminar el usuario');
    }
    res.sendStatus(200); // Enviar una respuesta de éxito
  });
});

//Eliminar EL ADMIN VENDEDOR
router.delete('/eliminarAdminVendedor/:id', (req, res) => {
  const adminVendedorId = req.params.id;

  const query = 'DELETE FROM adminvendedor WHERE id = ?';
  conection.query(query, [adminVendedorId], (error, result) => {
    if (error) {
      console.error('Error al eliminar el adminVendedor', error);
      return res.status(500).send('Error al eliminar el adminVendedor');
    }
    res.sendStatus(200);
  });
});

// Ruta para activar oportunidades
router.post('/activarOportunidades/:id', (req, res) => {
  const usuarioId = req.params.id;

  // Consulta para activar oportunidades
  conection.query(
      'UPDATE usuarios SET oportunidades = oportunidades + 3 WHERE id = ?',
      [usuarioId],
      (error, results) => {
          if (error) {
              console.error('Error al activar oportunidades:', error);
              return res.status(500).json({ success: false, message: 'Error al activar oportunidades' });
          }

          // Verifica si se afectaron filas (opcional)
          if (results.affectedRows > 0) {
              res.json({ success: true });
          } else {
              res.json({ success: false, message: 'Usuario no encontrado' });
          }
      }
  );
});



/* ADMIN VENDEDOR */
// Middleware para verificar si el admin vendedor ha iniciado sesión
function isAuthenticatedAdminV(req, res, next) {
  if (req.session.adminVendedorId) {
    return next();
  }
  res.redirect('/admin/loginAdminV');
}

router.get('/loginAdminV', (req, res) => {
  res.render('login_adminV');
});

router.post('/loginAdminV', (req, res) => {
  const { usuario, contraseña } = req.body;

  if (!contraseña) {
    return res.status(400).json({ success: false, message: "Contraseña no proporcionada" });
  }

  const query = "SELECT * FROM adminvendedor WHERE nombre_usuario = ?";
  conection.query(query, [usuario], async (error, results) => {
    if (error) {
      console.error("Error al buscar el admin vendedor:", error);
      return res.status(500).json({ success: false, message: "Error al iniciar sesión" });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Usuario no registrado" });
    }

    const adminVendedor = results[0];

    if (!adminVendedor.contraseña) {
      console.error("Contraseña no encontrada en la base de datos para el usuario:", usuario);
      return res.status(500).json({ success: false, message: "Error al iniciar sesión" });
    }

    try {
      const isPasswordValid = await bcrypt.compare(contraseña, adminVendedor.contraseña);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
      }

      req.session.adminVendedorId = adminVendedor.id;
      req.session.adminVendedorNombreUsuario = adminVendedor.nombre_usuario;
      req.session.adminVendedorActivo = true;

      req.session.save((err) => {
        if (err) {
          console.error("Error al guardar la sesión:", err);
          return res.status(500).json({ success: false, message: "Error al iniciar sesión" });
        }
        res.json({ success: true, message: "Inicio de sesión exitoso", redirectUrl: "/admin/adminV" });
      });
    } catch (compareError) {
      console.error("Error al comparar la contraseña:", compareError);
      return res.status(500).json({ success: false, message: "Error al iniciar sesión" });
    }
  });
});


router.get("/logoutAdminV", (req, res) => {
  req.session.adminVendedorActivo = false; // Establecer como inactivo
  // Elimina solo las propiedades relacionadas con adminVendedor
  delete req.session.adminVendedorId;
  delete req.session.adminVendedorNombreUsuario;

  // Si también tienes que eliminar otras propiedades relacionadas con adminVendedor, hazlo aquí
  req.session.save((err) => {
    if (err) {
      console.log("Error al guardar la sesión:", err);
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect("/admin/loginAdminV"); // Redirige al formulario de inicio de sesión del admin vendedor
  });
});


// Ruta protegida que requiere autenticación de admin vendedor
router.get("/adminV", isAuthenticatedAdminV, (req, res) => {
  if (!req.session.adminVendedorNombreUsuario) {
    return res.redirect("/admin/loginAdminV");
  }
  const nombreUsuario = req.session.adminVendedorNombreUsuario;
  const adminVendedorId = req.session.adminVendedorId; // ID del admin vendedor que inició sesión

  const query = 'SELECT * FROM subastas WHERE id_admin_vendedor = ?';
  conection.query(query, [adminVendedorId], (error, results) => {
    if (error) {
      console.error("Error al obtener los datos de subasta:", error);
      return res.status(500).send("Error al obtener los datos de subasta");
    }

    // Formatear la fecha de cada subasta
    results.forEach(subasta => {
      const fecha = new Date(subasta.fecha_subasta);
      // Formato día/mes/año
      subasta.fecha_formateada = fecha.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    });

    const numSubastas = results.length;
    res.render("adminVendedor", {
      nombreUsuario,
      numSubastas,
      subastas: results
    });
  });
});



// Función para calcular la fecha y hora `DATETIME` de prórroga
function calcularFechaProrroga(minutos) {
  return moment().add(minutos, 'minutes').format('YYYY-MM-DD HH:mm:ss');
}

router.post("/subir-vehiculo", upload.fields([{ name: 'images', maxCount: 10 }]), (req, res) => {
  const { marca, modelo, descripcion, categoria, anio, precio_base, placa, tarjeta_propiedad, llave, ubicacion, estado, importante, fecha_subasta, hora_subasta, anexos } = req.body;
  const imagenes = req.files['images'];

  const id_admin_vendedor = req.session.adminVendedorId;

  if (!id_admin_vendedor) {
    return res.status(401).json({ success: false, message: "Debe iniciar sesión como administrador vendedor para subir un vehículo." });
  }

  const insertQuery = `INSERT INTO subastas (marca, modelo, descripcion, categoria, anio, precio_base, placa, tarjeta_propiedad, llave, ubicacion, estado, importante, fecha_subasta, hora_subasta, id_admin_vendedor) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [marca, modelo, descripcion, categoria, anio, precio_base, placa, tarjeta_propiedad, llave, ubicacion, estado, importante, fecha_subasta, hora_subasta, id_admin_vendedor];

  conection.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error al insertar vehículo:", err);
      return res.status(500).json({ success: false, message: "Error al insertar vehículo" });
    }

    const id_subasta = result.insertId;

    if (imagenes && imagenes.length > 0) {
      const insertImagenesQuery = 'INSERT INTO imagenes_propiedad (id_subasta, imagen) VALUES ?';
      const imagenesData = imagenes.map(img => [id_subasta, img.buffer]);

      conection.query(insertImagenesQuery, [imagenesData], (err) => {
        if (err) {
          console.error("Error al insertar imágenes:", err);
          return res.status(500).json({ success: false, message: "Error al insertar imágenes" });
        }
      });
    }

    if (anexos) {
      const anexosArray = anexos.split(','); // Asume que los URLs de anexos están separados por comas
      const insertAnexosQuery = 'INSERT INTO anexos_propiedad (id_subasta, anexo) VALUES ?';
      const anexosData = anexosArray.map(anexoUrl => [id_subasta, anexoUrl.trim()]);

      conection.query(insertAnexosQuery, [anexosData], (err) => {
        if (err) {
          console.error("Error al insertar anexos:", err);
          return res.status(500).json({ success: false, message: "Error al insertar anexos" });
        }
      });
    }

    res.json({ success: true, message: "Vehículo, imágenes y anexos subidos correctamente" });
  });
});


// Activar subasta
router.post('/subasta/activar/:id', (req, res) => {
  const subastaId = req.params.id;
  conection.query(
    "UPDATE subastas SET act_fina = ?, fecha_activacion = CURDATE(), hora_activacion = DATE_ADD(CURTIME(), INTERVAL -5 HOUR) WHERE id = ?",
    ['activa', subastaId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al activar la subasta' });
      }
      res.json({ success: true });
    }
  );
});



// Finalizar subasta
router.post('/subasta/finalizar/:id', (req, res) => {
  const subastaId = req.params.id;
  conection.query('UPDATE subastas SET act_fina = ? WHERE id = ?', ['finalizada', subastaId], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al finalizar la subasta' });
    }
    res.json({ success: true });
  });
});



/* TEST-SESIONS */
router.get("/test-session", (req, res) => {
  const admingeneralId = req.session.admingeneralId || "no hay admin general";
  const adminVendedorId = req.session.adminVendedorId || "no hay admin vendedor";

  res.json({
    admingeneralId,
    adminVendedorId,
  });
  /* res.send(
    `ID del admin general: ${admingeneralId}, ID del admin vendedor: ${adminVendedorId}`
  ); */
});


/* VALIDAR CODIGO DE SEGURIDAD */
//funcion par generar codigo de verificacion
function generateVerificationCode() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Genera un número aleatorio de 10 dígitos
}

router.get("/recuperar", (req, res) => {
  res.render("recup_contra");
});

router.post('/recuperar', (req, res) => {
  const { email } = req.body;

  const query = "SELECT * FROM admingeneral WHERE correo_electronico = ?";
  conection.query(query, [email], (error, results) => {
    if (error) {
      console.error("Error al buscar el administrador general:", error);
      return res.status(500).send("Error al buscar el administrador general");
    }
    if (results.length === 0) {
      return res.status(404).send("Correo electrónico no encontrado");
    }

    const verificationCode = generateVerificationCode();
    const updateQuery = "UPDATE admingeneral SET verification_code = ? WHERE correo_electronico = ?";
    conection.query(updateQuery, [verificationCode, email], (error) => {
      if (error) {
        console.error("Error al actualizar el código de verificación:", error);
        return res.status(500).send("Error al actualizar el código de verificación");
      }

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'sebastianandryescalantemendoza@gmail.com',
          pass: 'aqoc cmjx cumo cclf'
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: '73274663@certus.edu.pe',
        to: email,
        subject: 'Código de verificación',
        text: `Tu código de verificación es: ${verificationCode}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error al enviar el correo:", error);
          return res.status(500).send("Error al enviar el correo");
        }
        res.status(200).send("Correo enviado");
        console.log("Correo enviado");
      });
    });
  });
});

router.post('/validarCodigo', (req, res) => {
  const { email, code } = req.body;

  const query = "SELECT * FROM admingeneral WHERE correo_electronico = ? AND verification_code = ?";
  conection.query(query, [email, code], (error, results) => {
    if (error) {
      console.error("Error al validar el código:", error);
      return res.status(500).send("Error al validar el código");
    }
    if (results.length === 0) {
      return res.status(404).send("Código de verificación incorrecto");
    }

    res.status(200).send("Código de verificación correcto");
  });
});

router.post('/cambiarContra', (req, res) => {
  const { email, newPassword } = req.body;

  const updateQuery = "UPDATE admingeneral SET contraseña = ? WHERE correo_electronico = ?";
  conection.query(updateQuery, [newPassword, email], (error) => {
    if (error) {
      console.error("Error al actualizar la contraseña:", error);
      return res.status(500).send("Error al actualizar la contraseña");
    }
    res.status(200).send("Contraseña actualizada");
  });
});

module.exports = router;



