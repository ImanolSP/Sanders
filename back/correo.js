import nodemailer from 'nodemailer';
import path from 'path';

// Create the transporter with the required configuration for Gmail
const enviarCorreo = async (destinatario, nombre) => {  
  
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'pruebasfundacionsanders@gmail.com', // Email del remitente
      pass: 'qgja vgvi xhnf ubwb' // Contraseña de la cuenta: Pru3basSanders
    },
  });

  // Setup email data
  let mailOptions = {
      from: 'pruebasfundacionsanders@gmail.com', // dirección del remitente
      to: destinatario, // lista de destinatarios
      subject: 'Muchas Gracias', // línea de asunto
      text: `Muchas gracias ${nombre} por tu donación`, // cuerpo en texto plano
      html: `
      <div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #192559;">La Fundación Sanders te agradece</h1>
        <p>Muchas gracias <strong>${nombre}</strong> por tu donación</p>
        <img src="cid:sanders" alt="Gracias" style="width: 100%; max-width: 400px; height: auto;" />
      </div>
    `,
      attachments: [
        {
          filename: 'sanders.jpg',
          path: 'https://imagizer.imageshack.com/img924/5995/EXOaFi.jpg',
          cid: 'sanders' // same cid as in the html img src
        }
      ]
  };

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
