const Busboy = require("busboy");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'dhacdmuvs',
  api_key: '663158733127629',
  api_secret: 'hti7fDaOahpRicPJCsirupLIAMk',
});

formData = (req, res, next) => {
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
    const cloud = cloudinary.uploader.upload_stream(
        { upload_preset: "booking-image" },
        (err, res) => {
        if (err) throw new Error("Something went wrong!");
        //console.log(err)
        //console.log("response cloudinary", res);
        req.body[key] = res;
        //console.log(res.secure_url)
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

module.exports = formData;