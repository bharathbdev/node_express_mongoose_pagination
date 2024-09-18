const db = require("../models");
const Tutorial = db.tutorials;
const File = db.files;
const multer = require('multer');
const QRCode = require('qrcode');
// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  });

  // Save Tutorial in the database
  tutorial
    .save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  // const { page, size, title } = req.query;
  // var condition = title
  //   ? { title: { $regex: new RegExp(title), $options: "i" } }
  //   : {};

  // const { limit, offset } = getPagination(page, size);

  // Tutorial.paginate(condition, { offset, limit })
  //   .then((data) => {
  //     res.send({
  //       totalItems: data.totalDocs,
  //       tutorials: data.docs,
  //       totalPages: data.totalPages,
  //       currentPage: data.page - 1,
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving tutorials.",
  //     });
  //   });
  console.log("222")
 // const uploadUrl = `${req.protocol}://${req.get('host')}/showHtmlPage`;
 const uploadUrl = 'https://my-browni.onrender.com/showHtmlPage';
  QRCode.toDataURL(uploadUrl, (err, url) => {
      if (err) return res.status(500).send('Error generating QR code');
      res.send(`<img src="${url}" alt="QR Code" />`);
  });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
let god = { published: true }
  Tutorial.paginate(god, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        tutorials: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

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
  const uploadUrl = `${req.protocol}://${req.get('host')}/showHtmlPage`;
  QRCode.toDataURL(uploadUrl, (err, url) => {
      if (err) return res.status(500).send('Error generating QR code');
      res.send(`<img src="${url}" alt="QR Code" />`);
  });
};

