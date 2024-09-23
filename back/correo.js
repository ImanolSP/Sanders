import nodemailer from 'nodemailer';

// Create the transporter with the required configuration for Gmail
const enviarCorreo = async (destinatario, nombre) => {  
  console.log('Iniciando el envío de correo...');
  
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'pruebasfundacionsanders@gmail.com', // Email del remitente
      pass: 'qgja vgvi xhnf ubwb' // Contraseña de la cuenta: Pru3basSanders
    },
  });

  console.log('Transporter creado.');

  // Setup email data
  let mailOptions = {
      from: 'pruebasfundacionsanders@gmail.com', // dirección del remitente
      to: destinatario, // lista de destinatarios
      subject: 'Muchas Gracias', // línea de asunto
      text: `Muchas gracias ${nombre} por tu donación`, // cuerpo en texto plano
      html: `<p>Muchas gracias <strong>${nombre}</strong> por tu donación</p>` // cuerpo en HTML
  };

  console.log('Opciones del correo configuradas:', mailOptions);

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
          console.error('Error al enviar el correo:', error);
          return;
      }
      console.log('Mensaje enviado:', info.response);
  });
};

export default enviarCorreo;
