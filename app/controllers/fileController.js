const db = require("../models");
const File = db.files;
const multer = require('multer');
const QRCode = require('qrcode');
// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');



// Handle file upload
exports.upload = (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).send('Multer error occurred when uploading.');
    } else if (err) {
      return res.status(500).send('Unknown error occurred when uploading.');
    }

    try {
      console.log("Handling file upload...");
      console.log(`File received: ${req.file.originalname}`);
      const file = new File({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
      });

      await file.save();
      console.log('File uploaded successfully');
      res.send('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
    }
  });
};

exports.showQrCode = (req, res) => {
  console.log("222")
 // const uploadUrl = `${req.protocol}://${req.get('host')}/showHtmlPage`;
 const uploadUrl = 'https://my-browni.onrender.com/showHtmlPage';
  QRCode.toDataURL(uploadUrl, (err, url) => {
      if (err) return res.status(500).send('Error generating QR code');
      res.send(`<img src="${url}" alt="QR Code" />`);
  });
};


