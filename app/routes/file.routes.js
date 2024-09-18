module.exports = app => {
    const files = require("../controllers/fileController");
  
    var router = require("express").Router();
  
  
    // Create a new Tutorial
    router.get("/", files.showQrCode);
    
    router.post("/upload", files.upload);
  
    app.use("/api/files", router);
  };
  