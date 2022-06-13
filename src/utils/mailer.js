const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: 465,
  secure: true,
  auth: {
    user: "clonairbnb@aol.com",
    pass: "bsrxiqyaulnfqfsgikipfaziiivwapru",
  },
  
});

exports.verify = async (transporter) => {
  const connection = await transporter.verify();
  if (connection) {
    console.log("Server is ready to take our message");
  }
};

exports.welcome = (user) => { 
  const styles = {
    h2: "color: grey",
  };

  return {
    from: `"${process.env.MAIL_USERNAME}" <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Bienvenido a nuestra APP",
    html: `
    <div>
    <p>Bienvenido a Airbnb </p>
    <h2 style="${styles.h2}">${user.name}</h2>
    <p> Descubre nuevos lugares</p>
    </div>
    `,
    text: `Bienvenido ${user.name}  a Airbnb`,
  };
};