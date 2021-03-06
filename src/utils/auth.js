const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    // En el back minuscula, en el front mayuscula
    const { authorization } = req.headers;

    //Para verificar que trae el encabezado
    if (!authorization) {
      throw new Error("expired session auth");
    }

    //Para separar el Bearer del token
    const [_, token] = authorization.split(" ");

    //Para verificar que trae el token
    if (!token) {
      throw new Error("expired session token");
    }

    //Reversión de la codificación del token
    const { id, email} = jwt.verify(token, process.env.SECRET_KEY);

    //Mutar el objeto req en el user (req.user) para poder acceder a el en cualquier parte
    req.user = id;
    req.email=email;
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
