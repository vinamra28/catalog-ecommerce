const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const apiHandler = require('../../apiHandler');
const Banner = require('../../controllers/banner');


//@Akshay Gaba
// router.post('/create', async (req, res) => {
//   try {
//     let banner = new Banner();
//     if (!req.files.images) {
//       return apiHandler(req, res, Promise.reject(Error.badRequest('File not found.')));
//     }
//     let imagePath = req.files.images;
//     let response = await banner.create(req.body, imagePath);
//     return apiHandler(req, res, Promise.resolve(response));
//   } catch (err) {
//     console.log(err);
//     return apiHandler(req, res, Promise.reject(err));
//   }
// });



//@Kushagra

router.post('/', async (req,res)=>{
  try{
      let banner= new Banner();
      if (!req.files.images) {
        return apiHandler(req, res, Promise.reject(Error.badRequest('File not found.')));
    }
    let imagePath=[];
    if(req.files.images.length === 0)
      imagePath.push(req.files.images)
    else 
      imagePath= imagePath.concat(req.files.images);
      const response= await banner.createBanner(req.body, imagePath);
      return apiHandler(req, res, Promise.resolve(response));
  } catch(e){
      console.log(e);
      return apiHandler(req, res, Promise.reject(e));
  }
})

router.get('/:bannerId', async (req,res)=>{
  try{
      let banner= new Banner();
      let response= await banner.getBannerById(req.params.bannerId);
      return apiHandler(req, res, Promise.resolve(response));
  } catch(e){
      console.log(e);
      return apiHandler(req, res, Promise.reject(e));
  }
})

router.get('/', async (req,res)=>{
  try{
      let banner= new Banner();
      let response= await banner.getAllBanners();
      return apiHandler(req, res, Promise.resolve(response));
  } catch(e){
      console.log(e);
      return apiHandler(req, res, Promise.reject(e));
  }
})

router.put('/:bannerId', async (req,res)=>{
  try{
      let banner= new Banner();
      const response= await banner.updateBannerById(req.params.bannerId, req.body);
      return apiHandler(req, res, Promise.resolve(response));
  } catch(e){
      console.log(e);
      return apiHandler(req, res, Promise.reject(e));
  }
})

router.delete('/:bannerId', async (req,res)=>{
  try{
      let banner= new Banner();
      let response= await banner.deleteBannerById(req.params.bannerId);
      return apiHandler(req, res, Promise.resolve(response));
  } catch(e){
      console.log(e);
      return apiHandler(req, res, Promise.reject(e));
  }
})

module.exports = router;