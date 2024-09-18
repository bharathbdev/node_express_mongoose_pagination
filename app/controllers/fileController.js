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
  console.log("222");
  const uploadUrl = 'https://my-browni.onrender.com/showHtmlPage';
  QRCode.toDataURL(uploadUrl, (err, url) => {
    if (err) return res.status(500).send('Error generating QR code');
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QR Code</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }
          .container {
            text-align: center;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          img {
            max-width: 100%;
            height: auto;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Scan the QR Code</h1>
          <img src="${url}" alt="QR Code" />
        </div>
      </body>
      </html>
    `);
  });
};


