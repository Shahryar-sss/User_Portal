const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const {User} = require('../models/user');

const router = express.Router();
const mongoURI = 'mongodb://localhost/User_Portal';

const conn = mongoose.createConnection(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
});

const upload = multer({ storage });

// Upload a file
router.post('/', upload.single('profileImage'), async (req, res) => {
    let user = await User.findOneAndUpdate({'email': req.body.email}, {
        $set:{
            profileImage: req.file.filename
        }
    }, {new:true});;
    res.send("File uploaded successfully");
});

router.get('/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).send("No file exists")
    }
    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

module.exports = router;