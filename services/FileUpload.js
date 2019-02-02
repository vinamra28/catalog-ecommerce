/**
 * FileUpoadService
 * This service is responsible for handling file uploading procedure.
 */

const Error = require('../errors');
const fs = require('fs');
const path = require('path');
const imageDirectory = './public/images/';

class FileUpload {

  /**
   * @description :: Upload file.
   * @param {JSON} file details of uploaded file
   * @returns {String} filePath
   */
  async upload(file) {
    try {
      if(!file) {
        console.log(file);
        return Promise.reject(Error.badRequest('File not found.'));
      }
      let time = new Date().getTime();
      let name = file.name;
      let ext = path.extname(name);
      if (!fs.existsSync(imageDirectory)){
        fs.mkdirSync(imageDirectory);
      }
      await file.mv(imageDirectory + time + ext);
      let dir = '/images/';
      return dir + time + ext;
    } catch(err) {
      console.log(err);
      return Promise.reject(new Error().internal());
    }
  }

  /**
   * @description :: Remove images from server.
   * @param {String} imagePath path of the image
   * @returns void
   */
  async removeImages(imagePath) {
    try {
      if (fs.existsSync(imagePath)) {
        let filename = path.basename(imagePath);
        fs.unlinkSync(imageDirectory + filename);
      }
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
}

module.exports = new FileUpload();
