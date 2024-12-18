const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
   host: 'mail.subastasur.sbs',
   port: 465,
   secure: true,
   auth: {
    user:'soporte@subastasur.sbs',
    pass:'Subastasur2025*?'
   }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("error al configurar el transporte de correo:", error);
    } else {
        console.log("Transporte de correo listo");
    }
});

const enviarCorreoBienvenida = async (destinatario, nombre) => {

    // Definimos el mensaje de correo
    const mensaje = {
        from: '"Subastasur Soporte" <soporte@subastasur.sbs>',
        to: destinatario,
        subject: "Bienvenido a Subastasur",
        html: `<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
  <title></title>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />

  <link rel="stylesheet" href="/css/partials/correo_bienvenida.css">

  <!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
</head>

<body class="body" style="background-color:rgb(255, 255, 255); margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color:rgb(255, 255, 255);" width="100%">
    <tbody>
      <tr>
        <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tbody>
              <tr>
                <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff4f4; border-radius: 0; color: #000000; width: 650px; margin: 0 auto;" width="480">
                    <tbody>
                      <tr>
                        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                          <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="width:100%;">
                                <div align="center" class="alignment" style="line-height:10px">
                                  <div style="max-width: 650px;"><img alt="" height="auto" src="cid:logo" style="display: block; height: auto; border: 0; width: 100%;" title="" width="480" /></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tbody>
              <tr>
                <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff4f4; border-radius: 0; color: #000000; width: 650px; margin: 0 auto;" width="480">
                    <tbody>
                      <tr>
                        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                          <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="padding-left:20px;padding-right:20px;text-align:center;width:100%;">
                                <h1 style="margin: 0; color: #000; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 42px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 63px;"><span class="tinyMce-placeholder" style="word-break: break-word;">Bienvenido ${nombre}</span></h1>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                            <tr>
                              <td class="pad" style="padding-left:20px;padding-right:60px;">
                                <div style="color:#101112;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:24px;">
                                  <p style="margin: 0; margin-bottom: 16px;">¡Nos alegra tenerte en <strong>Subasta Sur Perú</strong>! Ahora formas parte de la comunidad donde las mejores oportunidades están a solo un clic de distancia.</p>
                                  <p style="margin: 0;">Descubre vehículos únicos, puja en tiempo real y conviértete en el ganador de las mejores ofertas.</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="button_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="padding-left:20px;padding-right:20px;padding-top:20px;text-align:left;">
                                <div align="left" class="alignment">
                                  <!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.subastasur.com/login" style="height:38px;width:124px;v-text-anchor:middle;" arcsize="79%" stroke="false" fillcolor="#f20000">
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#ffffff;font-family:Arial, sans-serif;font-size:14px">
<![endif]--><a class="button" href="https://www.subastasur.com/login" style="background-color:#f20000;border-bottom:0px solid transparent;border-left:0px solid transparent;border-radius:30px;border-right:0px solid transparent;border-top:0px solid transparent;color:#ffffff;display:inline-block;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;" target="_blank"><span style="word-break: break-word; padding-left: 20px; padding-right: 20px; font-size: 14px; display: inline-block; letter-spacing: normal;"><span style="word-break: break-word; line-height: 28px;">Iniciar Sesión</span></span></a>
                                  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="image_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="width:100%;">
                                <div align="center" class="alignment" style="line-height:10px">
                                  <div style="max-width: 650px;"><a href="https://www.subastasur.com/" style="outline:none" tabindex="-1" target="_blank"><img alt="MainBanner Image - Blue Car" height="auto" src="cid:banner" style="display: block; height: auto; border: 0; width: 100%;" title="MainBanner Image - Blue Car" width="480" /></a></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tbody>
              <tr>
                <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-radius: 0; color: #000000; width: 650px; margin: 0 auto;" width="480">
                    <tbody>
                      <tr>
                        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 25px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                          <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="padding-left:20px;padding-right:20px;text-align:center;width:100%;">
                                <h1 style="margin: 0; color: #000; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 27px;"><span class="tinyMce-placeholder" style="word-break: break-word;">Ventajas de Comprar en SubastaSur</span></h1>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tbody>
              <tr>
                <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-radius: 0; color: #000000; width: 650px; margin: 0 auto;" width="480">
                    <tbody>
                      <tr>
                        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 50px; padding-top: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                          <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="width:100%;">
                                <div align="center" class="alignment" style="line-height:10px">
                                  <div style="max-width: 36px;"><a href="https://www.subastasur.com/" style="outline:none" tabindex="-1" target="_blank"><img alt="Fast Booking icon Image" height="auto" src="cid:icon_check" style="display: block; height: auto; border: 0; width: 100%;" title="Fast Booking icon Image" width="36" /></a></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;text-align:center;width:100%;">
                                <h1 style="margin: 0; color: #000; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 24px;"><span class="tinyMce-placeholder" style="word-break: break-word;">Sin Intermediarios</span></h1>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                            <tr>
                              <td class="pad" style="padding-left:20px;padding-right:20px;">
                                <div style="color:#101112;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                                  <p style="margin: 0;">Compra directo y sin complicaciones, ahorra tiempo y dinero.</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 50px; padding-top: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                          <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="width:100%;">
                                <div align="center" class="alignment" style="line-height:10px">
                                  <div style="max-width: 36px;"><a href="https://www.subastasur.com/" style="outline:none" tabindex="-1" target="_blank"><img alt="Pick Up Location Icon Image" height="auto" src="cid:icon_rayo" style="display: block; height: auto; border: 0; width: 100%;" title="Pick Up Location Icon Image" width="36" /></a></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;text-align:center;width:100%;">
                                <h1 style="margin: 0; color: #000; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 24px;"><span class="tinyMce-placeholder" style="word-break: break-word;">Pujas en Tiempo Real</span></h1>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                            <tr>
                              <td class="pad" style="padding-left:20px;padding-right:20px;">
                                <div style="color:#101112;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                                  <p style="margin: 0;">Vive la emoción de competir por los mejores bienes al instante.</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td class="column column-3" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 50px; padding-top: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                          <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="width:100%;">
                                <div align="center" class="alignment" style="line-height:10px">
                                  <div style="max-width: 36px;"><a href="https://www.subastasur.com/" style="outline:none" tabindex="-1" target="_blank"><img alt="For Customers Icon Image" height="auto" src="cid:icon_fire" style="display: block; height: auto; border: 0; width: 100%;" title="For Customers Icon Image" width="36" /></a></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;text-align:center;width:100%;">
                                <h1 style="margin: 0; color: #000; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 24px;"><span class="tinyMce-placeholder" style="word-break: break-word;">Precios Competitivos</span></h1>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                            <tr>
                              <td class="pad" style="padding-left:20px;padding-right:20px;">
                                <div style="color:#101112;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                                  <p style="margin: 0;">Encuentra oportunidades únicas por debajo del valor de mercado.</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tbody>
              <tr>
                <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #c50000; border-radius: 0; color: #000000; width: 650px; margin: 0 auto;" width="480">
                    <tbody>
                      <tr>
                        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="58.333333333333336%">
                          <div class="spacer_block block-1" style="height:50px;line-height:50px;font-size:1px;"> </div>
                          <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="padding-left:20px;padding-right:20px;width:100%;">
                                <div align="left" class="alignment" style="line-height:10px">
                                  <div style="max-width: 154px;"><a href="https://www.subastasur.com/" style="outline:none" tabindex="-1" target="_blank"><img alt="Logo CarRental Image" height="auto" src="cid:logo_negativo" style="display: block; height: auto; border: 0; width: 100%;" title="Logo CarRental Image" width="154" /></a></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="padding-bottom:5px;padding-left:20px;padding-right:20px;padding-top:5px;text-align:center;width:100%;">
                                <h2 style="margin: 0; color: #ffffff; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;">Subasta Tu Vehículo con Nosotros</h2>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                            <tr>
                              <td class="pad" style="padding-left:20px;padding-right:20px;">
                                <div style="color:#fff;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:justify;mso-line-height-alt:21px;">
                                  <p style="margin: 0;">Convierte tu vehículo en una oportunidad de negocio. En Subastasur, te ofrecemos una plataforma segura y confiable para que puedas subastar tu VEHICULO y alcanzar el mejor precio posible. ¡Empieza a ganar hoy mismo!</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <div class="spacer_block block-5 mobile_hide" style="height:50px;line-height:50px;font-size:1px;"> </div>
                        </td>
                        <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="41.666666666666664%">
                          <div class="spacer_block block-1 mobile_hide" style="height:75px;line-height:75px;font-size:1px;"> </div>
                          <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                <div align="center" class="alignment" style="line-height:10px">
                                  <div style="max-width: 50px;"><a href="https://www.subastasur.com/" style="outline:none" tabindex="-1" target="_blank"><img alt="Call Us Icon Image" height="auto" src="cid:icon_cell" style="display: block; height: auto; border: 0; width: 100%;" title="Call Us Icon Image" width="50" /></a></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="padding-bottom:30px;padding-left:20px;padding-right:20px;padding-top:5px;text-align:center;width:100%;">
                                <h1 style="margin: 0; color: #fff; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 700; letter-spacing: normal; line-height: 180%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;"><span class="tinyMce-placeholder" style="word-break: break-word;">+51 992 386 251</span></h1>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tbody>
              <tr>
                <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-radius: 0; color: #000000; width: 650px; margin: 0 auto;" width="480">
                    <tbody>
                      <tr>
                        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 60px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                          <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                <div align="center" class="alignment" style="line-height:10px">
                                  <div style="max-width: 240px;"><a href="https://www.subastasur.com/" style="outline:none" tabindex="-1" target="_blank"><img alt="Logo CarRental Image" height="auto" src="cid:logo" style="display: block; height: auto; border: 0; width: 100%;" title="Logo CarRental Image" width="240" /></a></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="20" cellspacing="0" class="button_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad">
                                <div align="center" class="alignment">
                                  <!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.subastasur.com/" style="height:38px;width:116px;v-text-anchor:middle;" arcsize="79%" stroke="false" fillcolor="#f20000">
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#ffffff;font-family:Arial, sans-serif;font-size:14px">
<![endif]--><a class="button" href="https://www.subastasur.com/" style="background-color:#f20000;border-bottom:0px solid transparent;border-left:0px solid transparent;border-radius:30px;border-right:0px solid transparent;border-top:0px solid transparent;color:#ffffff;display:inline-block;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;" target="_blank"><span style="word-break: break-word; padding-left: 20px; padding-right: 20px; font-size: 14px; display: inline-block; letter-spacing: normal;"><span style="word-break: break-word; line-height: 28px;"><strong>Subastasur</strong></span></span></a>
                                  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="image_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                <div align="center" class="alignment" style="line-height:10px">
                                  <div class="fullWidth" style="max-width: 650px;"><a href="https://www.subastasur.com/" style="outline:none" tabindex="-1" target="_blank"><img alt="Footer Image" height="auto" src="cid:footer_banner" style="display: block; height: auto; border: 0; width: 100%;" title="Footer Image" width="480" /></a></div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tbody>
              <tr>
                <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #dc0000; color: #000000; width: 650px; margin: 0 auto;" width="480">
                    <tbody>
                      <tr>
                        <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-left: 5px; padding-top: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
                          <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                            <tr>
                              <td class="pad">
                                <div style="color:#ffffff;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:18px;line-height:120%;text-align:left;mso-line-height-alt:21.599999999999998px;">
                                  <p style="margin: 0; word-break: break-word;"><strong><span style="word-break: break-word; color: #ffffff;">Redes Sociales</span></strong></p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                            <tr>
                              <td class="pad">
                                <div style="color:#C0C0C0;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:12px;line-height:120%;text-align:left;mso-line-height-alt:14.399999999999999px;">
                                  <p style="margin: 0; word-break: break-word;">Manténgase actualizado con las actividades actuales y eventos futuros siguiéndonos en sus canales de redes sociales.</p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" class="social_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                            <tr>
                              <td class="pad" style="text-align:left;padding-right:0px;padding-left:0px;">
                                <div align="left" class="alignment">
                                  <table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="126px">
                                    <tr>
                                      <td style="padding:0 10px 0 0;">
                                        <a href="https://www.facebook.com/subastasur" target="_blank">
                                          <img alt="Facebook" height="auto" src="cid:icon_face" style="display: block; height: auto; border: 0;" title="Facebook" width="32" />
                                        </a>
                                      </td>
                                      
                                      <td style="padding:0 10px 0 0;"><a href="https://www.tiktok.com/@subasta_sur" target="_blank"><img alt="TikTok" height="auto" src="cid:icon_tik" style="display: block; height: auto; border: 0;" title="TikTok" width="32" /></a></td>
                                      <td style="padding:0 10px 0 0;"><a href="https://www.youtube.com/@subastasur" target="_blank"><img alt="YouTube" height="auto" src="cid:icon_you" style="display: block; height: auto; border: 0;" title="YouTube" width="32" /></a></td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-left: 5px; padding-top: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
                          <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                            <tr>
                              <td class="pad">
                                <div style="color:#ffffff;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:18px;line-height:120%;text-align:left;mso-line-height-alt:21.599999999999998px;">
                                  <p id="tw-target-text-container" role="text" style="margin: 0;" tabindex="0"></p>
                                  <p style="margin: 0; word-break: break-word;">¿Donde Encontrarnos?</p>
                                  <p id="tw-target-rmn-container" role="text" style="margin: 0;" tabindex="0"></p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                            <tr>
                              <td class="pad">
                                <div style="color:#C0C0C0;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:12px;line-height:120%;text-align:left;mso-line-height-alt:14.399999999999999px;">
                                  <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #c0c0c0;">ubastasur<br />av Ejercito 906 Piso Cayma Arequipa<br /></span></p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table><!-- End -->
</body>

</html>
`,
        attachments: [
            {
                filename: 'logo.png',
                path: './public/img/SUBASTA-SUR-ROJO_1.png',
                cid: 'logo',
            },
            {
                filename: 'logo_negativo.png',
                path: './public/img/SUBASTA_SUR_BLANCO.png',
                cid: 'logo_negativo',
            },
            {
                filename: 'banner.png',
                path: './public/img/Banner_correo.png',
                cid: 'banner'
            },
            {
                filename: 'icon_cell.png',
                path: './public/img/CallUsIcon.png',
                cid: 'icon_cell'
            },
            {
                filename: 'icon_check.png',
                path: './public/img/FastBookingIcom.png',
                cid: 'icon_check',
            },
            {
                filename: 'icon_fire.png',
                path: './public/img/FCustomersIcon.png',
                cid: 'icon_fire'
            },
            {
                filename: 'icon_rayo.png',
                path: './public/img/PULocationIcon.png',
                cid: 'icon_rayo'
            },
            {
                filename: 'footer_banner.png',
                path: './public/img/FooterImage.png',
                cid: 'footer_banner',
            },
            {
                filename: 'icon_face.png',
                path: './public/img/facebook2x.png',
                cid: 'icon_face'
            },
            {
                filename: 'icon_tik.png',
                path: './public/img/tiktok2x.png',
                cid: 'icon_tik'
            },
            {
                filename: 'icon_you.png',
                path: './public/img/youtube2x.png',
                cid: 'icon_you'
            },
        ],
    };

    try {
        // Enviamos el correo
        await transporter.sendMail(mensaje);
        console.log('Correo enviado a:', destinatario);
    } catch (error) {
        // Manejo de errores
        console.error('Error al enviar el correo', error);
        throw error;
    }
}



module.exports = { enviarCorreoBienvenida };