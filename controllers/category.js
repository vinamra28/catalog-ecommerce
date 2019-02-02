/**
* Category Controller
*
* @Definations :: Category Controller defines to perform various operations with help of Category Model
**/
const fs = require('fs');
const Error = require('../errors');
const CategoryModel = require('../models/category');
const ProductModel = require('../models/product');
const UploadService = require('../services/FileUpload');
const ObjectId = require('mongoose').Types.ObjectId;

class Category {

  /**
  * @description :: Get all category
  *
  * @param void
  * @returns category
  */
  async getCategory() {
    try {
      let rootCategoriesFromDb = await CategoryModel.find({parentCategoryId : null});
      let rootCategories = JSON.parse(JSON.stringify(rootCategoriesFromDb));

      for (let i = 0; i < rootCategories.length; i++) {
        let category = rootCategories[i];
        let curCategoryChildren = await this.fetchAllChildren(category);
        category.children = curCategoryChildren;
        rootCategories[i] = category;
      }
      // let result = await CategoryModel.aggregate([
      //   {
      //     $graphLookup: {
      //       from: "categories",
      //       startWith: "$_id",
      //       connectFromField: "_id",
      //       connectToField: "parentCategoryId",
      //       as: "children"
      //     }
      //   }
      // ]);
      return rootCategories;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async fetchAllChildren(parentCategory) {
    try {
      let result = [];
      if (parentCategory.hasChild) {
       let resultFromDb = await CategoryModel.find({parentCategoryId : ObjectId(parentCategory._id)});
       result = JSON.parse(JSON.stringify(resultFromDb));
       for(let i = 0; i < result.length; i++) {
         let childCategory = result[i];
         let furtherChildrenFromDb = await this.fetchAllChildren(childCategory);
         let furtherChildren = JSON.parse(JSON.stringify(furtherChildrenFromDb));
         childCategory.children = furtherChildren;
         result[i] = childCategory;
       }
      }
      return result;

    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  //GET ALL CATEGORIES : POOJA
  // async getCategories(req) {
  //   try {
  //     let { parentCategoryId } = req.body
  //     let root = await CategoryModel.find();
  //     // return root
  //     let categories=[];
  //     for (let cate of root) {
  //       let sub = await CategoryModel.find({ parentCategoryId: cate._id });
  //       console.log('cate = ', cate)
  //       cate.subCategory=sub
  //       // let obj = {
  //       //   root: cate,
  //       //   subCategory: sub
  //       // }
  //       categories.push(cate);
  //     }
  //     return categories
  //   } catch (err) {
  //     console.log(err);
  //     return Promise.reject(err);
  //   }
  // }

  /**
  * @description :: Get details of a category
  *
  * @param {Number} id id of the category
  * @returns category
  */
  async getDetails(id) {
    try {
      let category = await CategoryModel.findOne({ _id: id });
      if (!category) {
        return Promise.reject(Error.badRequest('Category is not found.'));
      }
      return category;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Save  category  details.
  * @param {String} id _id of the Category
  * @param {String} name name of the Category
  * @param {String} shortDescription shortDescription of the Category
  * @param {String} longDescription longDescription of the Category
  * @param {String} icon icon of the Category
  * @param {String} imagePath imagePath of the Category
  * @param {String} pageTitle  pageTitle of the Category
  * @param {Number} parentId parentId of the Category
  * @param {String} metaKeyword  metaKeyword of the Category
  * @param {String} metaDescription metaDescription  the Category
  * @param {String} url  url of the Category
  * @param {Boolean} active active  the Category
  * @returns {JSON} category
  */

  //CREATE CATEGORY : POOJA
  async create(req) {
    try {
      let file = req.files;
      let { title, isActive, isFeatured, description, metaTitle, metaKeyword,
        metaDescription, parentCategoryId } = req.body;

      if (title && file.icon && file.categorySectionImage && file.megaMenuImage
        && file.categoryDetailImage && (!(isFeatured === 'true') || file.featuredImage)) {

        let category = await CategoryModel.findOne({ title: title });
        let parentId;
        if (category)
          return Promise.reject(Error.notFound('choose another category name!'));

        if (parentCategoryId) {
          category = await CategoryModel.findOneAndUpdate({ _id: parentCategoryId }, { hasChild: true });
          if (!category)
            return Promise.reject(Error.badRequest('category not found!'));
          else
            parentId = parentCategoryId;
        }

        let featuredImage;
        let icon = await UploadService.upload(file.icon);
        let categorySectionImage = await UploadService.upload(file.categorySectionImage);
        let megaMenuImage = await UploadService.upload(file.megaMenuImage);
        let categoryDetailImage = await UploadService.upload(file.categoryDetailImage);
        if (isFeatured === 'true')
          featuredImage = await UploadService.upload(file.featuredImage);

        let newObj = {
          parentCategoryId: parentId ? parentId : null,
          title: title,
          isActive: isActive === 'true' ? true : false,
          icon: icon,
          featuredImage: featuredImage ? featuredImage : '',
          categorySectionImage: categorySectionImage,
          megaMenuImage: megaMenuImage,
          categoryDetailImage: categoryDetailImage,
          description: description ? description : '',
          metaTitle: metaTitle ? metaTitle : '',
          metaKeyword: metaKeyword ? metaKeyword : '',
          metaDescription: metaDescription ? metaDescription : ''
        }
        // let category;

        let newCate = new CategoryModel(newObj);
        newCate = await CategoryModel.create(newCate);
        console.log('newCate = ', newCate);
        return {
          message: "Created successfuly!"
        }
      } else {
        return Promise.reject(Error.badRequest('incomplete parameters!'));
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  // async create(data, images) {
  //   try {
  //     let featuredImage = await UploadService.upload(images.featuredImage);
  //     let icon = await UploadService.upload(images.icon);
  //     let categorySectionImage = await UploadService.upload(images.categorySectionImage);
  //     let megaMenuImage = await UploadService.upload(images.megaMenuImage);
  //     let categoryDetailImage = await UploadService.upload(images.categoryDetailImage);
  //     let categoryData = new CategoryModel({
  //       parentCategoryId: ObjectId(data.parentCategoryId),
  //       name: data.name,
  //       isActive: data.isActive,
  //       icon: icon,
  //       featuredImage: featuredImage,
  //       categorySectionImage: categorySectionImage,
  //       megaMenuImage: megaMenuImage,
  //       categoryDetailImage: categoryDetailImage,
  //       description: data.description,
  //       metaTitle: data.metaTitle,
  //       metaKeyword: data.metaKeyword,
  //       metaDescription: data.metaDescription
  //     });
  //     let result = await categoryData.save();
  //     return result;
  //   } catch (err) {
  //     console.log(err);
  //     return Promise.reject(err);
  //   }
  // }


  /**
  * @description :: Update category details.
  *
  * @param {JSON} body
  * @param {JSON} imagePath details of the uploaded image
  * @param {JSON} iconPath details of the uploaded icon
  * @returns {JSON} category
  */
  // async updateCategory(categoryId, body, imagePath, iconPath) {
  //   try {
  //     let category = await CategoryModel.findOne({ _id: categoryId });
  //     if (!category) {
  //       return Promise.reject(new Error.badRequest('Category not found.'));
  //     }
  //     let patches = body.patches || [];

  //     if (imagePath) {
  //       await UploadService.removeImages(category.imagePath);
  //       let image = await UploadService.upload(imagePath);
  //       patches.push({
  //         "op": "replace",
  //         "path": "/thumbnailImage",
  //         "value": image
  //       });
  //     }
  //     if (iconPath) {
  //       await uploadService.removeImages(category.icon);
  //       let icon = await UploadService.upload(iconPath);
  //       patches.push({
  //         "op": "replace",
  //         "path": "/icon",
  //         "value": icon
  //       });
  //     }
  //     let data = category.patch(patches, function callback(err) {
  //       if (err) return next(err);
  //       return category;
  //     });
  //     return data;
  //   } catch (err) {
  //     console.log(err);
  //     return Promise.reject(err);
  //   }
  // }

  async updateCategory(req) {
    try {
      let file = req.files;
      let { categoryId, isActive, isFeatured, description, metaTitle, metaKeyword,
        metaDescription } = req.body;

      if (categoryId) {

        let category = await CategoryModel.findOne({ _id: categoryId });
        let newObj = {
          isActive: isActive === 'true' ? true : false,
          description: description ? description : '',
          metaTitle: metaTitle ? metaTitle : '',
          metaKeyword: metaKeyword ? metaKeyword : '',
          metaDescription: metaDescription ? metaDescription : ''
        }

        if (isFeatured === 'true' && file && file.featuredImage) {
          await UploadService.removeImages(category.featuredImage);
          let featuredImage = await UploadService.upload(file.featuredImage);
          newObj.featuredImage = featuredImage;
        }

        if (file && file.icon) {
          await UploadService.removeImages(category.icon);
          let icon = await UploadService.upload(file.icon);
          newObj.icon = icon;
        }
        if (file && file.categorySectionImage) {
          await UploadService.removeImages(category.categorySectionImage);
          let categorySectionImage = await UploadService.upload(file.categorySectionImage);
          newObj.categorySectionImage = categorySectionImage;
        }
        if (file && file.megaMenuImage) {
          await UploadService.removeImages(category.megaMenuImage);
          let megaMenuImage = await UploadService.upload(file.megaMenuImage);
          newObj.megaMenuImage = megaMenuImage;
        }
        if (file && file.categoryDetailImage) {
          await UploadService.removeImages(category.categoryDetailImage);
          let categoryDetailImage = await UploadService.upload(file.categoryDetailImage);
          newObj.categoryDetailImage = categoryDetailImage;
        }

        // let category;
        let updateCat = await CategoryModel.findOneAndUpdate({ _id: categoryId }, { $set: newObj }, { new: true });
        console.log('update = ', updateCat)
        return {
          message: "Created successfuly!"
        }
      } else {
        return Promise.reject(Error.badRequest('incomplete parameters!'));
      }












      // let file = req.files;
      // let categoryId = req.params.categoryId;
      // let { categoryId, name, isActive, }
      // let category = await CategoryModel.findOne({ _id: categoryId });
      // if (!category) {
      //   return Promise.reject(new Error.badRequest('Category not found.'));
      // }
      // let patches = body.patches || [];

      // // icon: icon,
      // // featuredImage: featuredImage ? featuredImage : '',
      // // categorySectionImage: categorySectionImage,
      // // megaMenuImage: megaMenuImage,
      // // categoryDetailImage: categoryDetailImage,

      // if (file.icon) {
      //   await UploadService.removeImages(category.icon);
      //   let image = await UploadService.upload(file.icon);
      //   patches.push({
      //     "op": "replace",
      //     "path": "/icon",
      //     "value": image
      //   });
      // }
      // if (file.categorySectionImage) {
      //   await UploadService.removeImages(category.categorySectionImage);
      //   let categorySectionImage = await UploadService.upload(file.categorySectionImage);
      //   patches.push({
      //     "op": "replace",
      //     "path": "/categorySectionImage",
      //     "value": categorySectionImage
      //   });
      // }
      // if (file.megaMenuImage) {
      //   await uploadService.removeImages(category.megaMenuImage);
      //   let megaMenuImage = await UploadService.upload(file.megaMenuImage);
      //   patches.push({
      //     "op": "replace",
      //     "path": "/megaMenuImage",
      //     "value": megaMenuImage
      //   });
      // }
      // if (file.categoryDetailImage) {
      //   await uploadService.removeImages(category.categoryDetailImage);
      //   let categoryDetailImage = await UploadService.upload(file.categoryDetailImage);
      //   patches.push({
      //     "op": "replace",
      //     "path": "/categoryDetailImage",
      //     "value": categoryDetailImage
      //   });
      // }
      // let data = category.patch(patches, function callback(err) {
      //   if (err) return next(err);
      //   return category;
      // });
      // return data;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
   * @description Search using a Parameter
   * @param {name} name 
   */
  async findByCategoryId(queryString, pagination) {
    try {
      let product = await ProductModel.find({}, queryString)
        .skip(pagination.skip)
        .limit(pagination.limit);
      if (!product) {
        return Promise.reject(new Error.badRequest('Category not found.'));
      }
      return product;
    } catch (err) {
      consol.log(err);
      return Promise.reject(err);
    }
  }


}

module.exports = Category;
