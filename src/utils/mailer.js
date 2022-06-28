const nodemailer = require("nodemailer");
require("dotenv").config();

exports.transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_SERVER,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APPPASS,
  },
  tls: { rejectUnauthorized: false },
});

exports.verify = async (transporter) => {
  const connection = await transporter.verify();
  if (connection) {
    console.log("Server is ready to take our message");
  }
};

exports.recoverypassword = (email, token, name) => {
  const styles = {
    h1: "color: #FF5A5F",
    h2: "color: grey",
  };

  return {
    from: `"Airbnb" <clon.airbnb@gmail.com>`,
    to: email,
    subject: "Recuperar contraseña",
    html: `
    <div style="width:600px; margin:80px">
    <div>
    <img style="width:200px; margin-botton:15px" src="https://res.cloudinary.com/dhacdmuvs/image/upload/v1655352296/Airbnb_Logo_B%C3%A9lo.svg_lhryd6.png" alt="logo"/>
    </div>
    <div style="margin-bottom:25px">
    <h2>Recupera tu contraseña</h2>
    <p>Hola ${name},</p>
    <p>Para reestablecer tu contraseña por favor dale click al siguiente enlace</p>
    <a href="http://localhost:3000/password-recovery/${token}">Recuperar constraseña</a>
    </div>
    <div style="width:600px; border-top:1px solid grey" >
    <p>Enviado por Airbnb ♥</p>
    </div
    </div>
    `,
    text: `Dale click al enlace para recuperar contraseña`,
  };
};

exports.resetpassword = (email, name) => {
  const styles = {
    h1: "color: #FF5A5F",
    h2: "color: grey",
  };

  return {
    from: `"Airbnb" <clon.airbnb@gmail.com>`,
    to: email,
    subject: "Contraseña reestablecida",
    html: `
    <div style="width:600px; margin:80px">
    <div>
    <img style="width:200px; margin-botton:15px" src="https://res.cloudinary.com/dhacdmuvs/image/upload/v1655352296/Airbnb_Logo_B%C3%A9lo.svg_lhryd6.png" alt="logo"/>
    </div>
    <div style="margin-bottom:25px">
    <h2>Recupera tu contraseña</h2>
    <p>Hola ${name},</p>
    <p>Tu contraseña se ha reestablecido exitosamente</p>
    <p>Atentamente,</p>
    <p>El equipo de Airbnb</p>
    </div>
    <div style="width:600px; border-top:1px solid grey" >
    <p>Enviado por Airbnb ♥</p>
    </div
    </div>
    `,
    text: `Dale click al enlace para recuperar contraseña`,
  };
};
