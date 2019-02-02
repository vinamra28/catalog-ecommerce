/**
 * Cart Controller
 * 
 * @Definitions :: Cart Controller specifies operations to perform with the help of Cart model
 */

const fs = require('fs');
const Error = require('../errors');
const ProductModel = require('../models/product');
const CartModel = require('../models/cart');

class Cart {
    /**
	* @description :: getting all the items present in the cart
	* @param :: void
	* @return type :: cart items
    */
    async getCartByUser(userId) {
        try {
            let result = await CartModel.CartModel.findOne({ userId: userId });
            console.log(result);
            //console.log(result.products[0].productId);
            if (result === null || Object.keys(result).length === 0) {
                console.log("No Cart Found")
                return Promise.reject(Error.badRequest('No Cart found'));
            }
            return result;
        }
        catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    }

    /**
     * @description :: if the item not present in cart
     * @param :: userId
     * @param :: new product to be added in the cart
     * @param :: quantity of the product to be added
     */
    async addToCart(userId, product) {
        try {
            let cart = await CartModel.CartModel.findOne({ userId: userId });
            if (cart === null || Object.keys(cart).length === 0) {
                // console.log("No cart for this user please create one");
                // return Promise.reject(Error.badRequest('No Cart found'));
                let productsArray = [];
                let finalCart = await this.productAddSchema(productsArray, product);
                console.log(finalCart);
                var totalqty = this.sumQty(finalCart);
                console.log("Total final qty : " + totalqty);
                var cartValue = this.sumPriceTotal(finalCart);
                console.log("Total final value : " + cartValue);
                let cartSchema = new CartModel.CartModel(
                    {
                        userId: userId,
                        products: finalCart,
                        totalItems: totalqty,
                        subTotal: cartValue
                    }
                );
                let result = await cartSchema.save();
                return result;
            }
            else {
                console.log("Previous cart : \n" + cart);
                let productsArray = cart.products;
                let finalCart = await this.productAddSchema(productsArray, product);
                var totalqty = this.sumQty(finalCart);
                var cartValue = this.sumPriceTotal(finalCart);
                console.log("Total final qty : " + totalqty);
                console.log("Total final qty : " + cartValue);
                if (finalCart) {
                    cart.products = finalCart;
                    cart.totalItems = totalqty;
                    cart.subTotal = cartValue;
                }
                let result = await cart.save();
                // console.log(cart);
                console.log(result);
                return result;
            }
        }
        catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async productAddSchema(cartArray, product) {
        let price = await ProductModel.ProductModel.findOne({ "_id": product.productId });
        if (price === null) {
            return cartArray;
        }
        var productPrice = JSON.parse(JSON.stringify(price.sellingDetails)).price;
        var x = this.inCart(product.productId, cartArray);
        if (x !== 0) {
            for (var i = 0; i < cartArray.length; i++) {
                if ((cartArray[i].productId).equals(product.productId)) {
                    cartArray[i].quantity = product.quantity + x;
                    cartArray[i].total = cartArray[i].quantity * productPrice;
                }
            }
            return cartArray;
        }
        else {
            let productDetails =
                {
                    productId: product.productId,
                    quantity: product.quantity,
                    total: product.quantity * productPrice
                };
            cartArray.push(productDetails);
            console.log(cartArray);
            return cartArray;
        }
    }

    //to check whether the product is present in cart or not
    inCart(productId, cartArray) {
        for (var i = 0; i < cartArray.length; i++) {
            if ((cartArray[i].productId).equals(productId)) {
                return cartArray[i].quantity;
            }
        }
        return 0;
    }
    sumQty(cartArray) {
        var totalqty = 0;
        for (var i = 0; i < cartArray.length; i++) {
            totalqty += cartArray[i].quantity;
        }
        return totalqty;
    }

    sumPriceTotal(cartArray) {
        var totalqty = 0;
        for (var i = 0; i < cartArray.length; i++) {
            totalqty += cartArray[i].total;
        }
        return totalqty;
    }
    /**
     * @description :: remove a particular product from the cart
     * @returns :: final cart after removing the product
     * @param {*} product the product to be deleted
     * @param {*} userId 
     */

    async removeFromCart(userId, product) {
        try {
            let cart = await CartModel.CartModel.findOne({ userId: userId });
            let productsArray = cart.products;
            let newCart = [];
            for (var i = 0; i < productsArray.length; i++) {
                console.log(productsArray[i].productId + "   " + product.productId);
                if ((productsArray[i].productId).equals(product.productId)) {
                    console.log("found");
                }
                else {
                    newCart.push(productsArray[i]);
                }
            }
            var totalqty = this.sumQty(newCart);
            var cartValue = this.sumPriceTotal(newCart);
            if (newCart) {
                cart.products = newCart;
                cart.totalItems = totalqty;
                cart.subTotal = cartValue;
            }
            console.log("new array " + newCart);
            let result = await cart.save();
            return result;
        }
        catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    /**
     * @description :: increase or decrease the value of a product
     * @param {*} userId 
     * @param {*} product 
     */
    async updateQty(userId, product) {
        console.log('entered');
        try {
            let cart = await CartModel.CartModel.findOne({ userId: userId });
            let productsArray = cart.products;
            let newCart = [];
            for (var i = 0; i < productsArray.length; i++) {
                console.log(productsArray[i].productId + "   " + product.productId);
                if ((productsArray[i].productId).equals(product.productId)) {
                    let price = await ProductModel.ProductModel.findOne({ "_id": product.productId });
                    if (price === null) {
                        console.log(price);
                        return cartArray;
                    }
                    // console.log("selling details : "+price.sellingDetails);
                    console.log(JSON.parse(JSON.stringify(price.sellingDetails)).price);
                    var productPrice = JSON.parse(JSON.stringify(price.sellingDetails)).price;
                    console.log("found");
                    productsArray[i].quantity = product.quantity;
                    productsArray[i].total = product.quantity * productPrice;
                    newCart.push(productsArray[i]);
                }
                else {
                    newCart.push(productsArray[i]);
                }
            }
            var totalqty = this.sumQty(newCart);
            var cartValue = this.sumPriceTotal(newCart);
            if (newCart) {
                cart.products = newCart;
                cart.totalItems = totalqty;
                cart.subTotal = cartValue;
            }
            console.log("new array " + newCart);
            let result = await cart.save();
            return result;
        }
        catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    /**
     * @description :: delete all the products present in the cart
     * @param {*} userId 
     */
    async emptyCart(userId) {
        try {
            let cart = await CartModel.CartModel.findOne({ userId: userId });
            cart.products = [];
            cart.totalItems = 0;
            cart.subTotal = 0;
            let result = await cart.save();
            return result;
        }
        catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
}

module.exports = Cart;