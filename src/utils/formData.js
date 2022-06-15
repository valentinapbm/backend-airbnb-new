require("dotenv").config();
const Busboy = require("busboy");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dhacdmuvs",
  api_key: "663158733127629",
  api_secret: "hti7fDaOahpRicPJCsirupLIAMk",
});

// const data = new FormData();
// data.append("username", username);
// data.append("file", file);

function formData(preset) {
  return function (req, res, next) {
    let uploadingFile = false;
    let uploadingCount = 0;

    const done = () => {
      if (uploadingFile) return;
      if (uploadingCount > 0) return;
      next();
    };

    const bb = Busboy({ headers: req.headers });
    req.body = {};

    //Captura partes que no son un archivo
    bb.on("field", (key, val) => {
      req.body[key] = val;
    });

    //Captura partes que si son un archivo
    bb.on("file", (key, stream) => {
      uploadingFile = true;
      uploadingCount++;
      const memoImages = [];
      const cloud = cloudinary.uploader.upload_stream(
        { upload_preset: "booking-image" },
        (err, res) => {
          if (err) throw new Error("Something went wrong!");

          //console.log("response cloudinary", res);
          req.body[key] = res.secure_url;
          uploadingFile = false;
          uploadingCount--;
          done();
        }
      );

      stream.on("data", (data) => {
        //console.log(data);
        cloud.write(data);
      });

      stream.on("end", () => {
        //console.log("finish");
        cloud.end();
      });
    });

    //Finalizar el recepcion de datos
    bb.on("finish", () => {
      //next();
      done();
    });

    req.pipe(bb);
  };
}

module.exports = formData;
