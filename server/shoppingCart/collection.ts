import {HydratedDocument, Types} from 'mongoose';
import type {ShoppingCart} from './model';
import ShoppingCartModel from './model';
import UserCollection from '../user/collection';
import ItemForSaleCollection from '../ItemForSale/collection';
import { ItemForSale } from '../ItemForSale/model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class ShoppingCartCollection {


  static async findAll(): Promise<Array<HydratedDocument<ShoppingCart>>> {
    // Retrieves freets and sorts them from most to least recent
    return ShoppingCartModel.find({}).populate('cartOwner');
  }


  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(cartOwner: Types.ObjectId | string): Promise<HydratedDocument<ShoppingCart>> {

    const shoppingCart = new ShoppingCartModel({
      cartOwner,
      numberOfItems: 0,
      items: new Map<string, number>(),
      total: 0.0

    });
    await shoppingCart.save(); // Saves freet to MongoDB
    return shoppingCart.populate('cartOwner');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(shoppingCartId: Types.ObjectId | string): Promise<HydratedDocument<ShoppingCart>> {
    return ShoppingCartModel.findOne({_id: shoppingCartId}).populate('cartOwner');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
   static async findOneByUsername(cartOwner: Types.ObjectId | string): Promise<HydratedDocument<ShoppingCart>> {
    return ShoppingCartModel.findOne({cartOwner}).populate('cartOwner');
  }

//   /**
//    * Get all the freets in the database
//    *
//    * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
//    */
//   static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
//     // Retrieves freets and sorts them from most to least recent
//     return FreetModel.find({}).sort({dateModified: -1}).populate('authorId');
//   }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findCartByUsername(username: string): Promise<Array<HydratedDocument<ShoppingCart>>> {
    const user = await UserCollection.findOneByUsername(username);
    return ShoppingCartModel.find({cartOwner: user._id}).populate('cartOwner');
  }

  static async findCartByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<ShoppingCart>>> {
    const user = await UserCollection.findOneByUserId(userId);
    return ShoppingCartModel.find({cartOwner: user._id}).populate('cartOwner');
  }

  static async getAllItemsInCart(shoppingCartId: Types.ObjectId | string): Promise<Array<HydratedDocument<ItemForSale>>> {
    const cart = await ShoppingCartModel.findOne({_id: shoppingCartId});
    const items = Array<HydratedDocument<ItemForSale>>();
    for(let [itemName, quantity] of cart.items.entries()){
      const cartItem = await ItemForSaleCollection.findOne(itemName);
      items.push(cartItem);
    }
    return items;
  }

  static async getAllItemsInCartByUsername(cartOwner: Types.ObjectId | string): Promise<Array<HydratedDocument<ItemForSale>>> {
    const cart = await ShoppingCartModel.findOne({cartOwner});
    const items = Array<HydratedDocument<ItemForSale>>();
    for(let [itemName, quantity] of cart.items.entries()){
      const cartItem = await ItemForSaleCollection.findOne(itemName);
      items.push(cartItem);
    }
    console.log("items");
    console.log(items);
    return items;
  }


  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async addToCart(shoppingCartId: Types.ObjectId | string, itemForSaleId: string): Promise<HydratedDocument<ShoppingCart>> {
    const shoppingCart = await ShoppingCartModel.findOne({_id: shoppingCartId});
    if (!shoppingCart.items.has(itemForSaleId)){
        shoppingCart.items.set(itemForSaleId, 0);
    }
    shoppingCart.items.set(itemForSaleId, shoppingCart.items.get(itemForSaleId) + 1);
    shoppingCart.numberOfItems += 1;
    const itemPrice = await ItemForSaleCollection.getPrice(itemForSaleId);
    console.log(itemPrice)
    console.log(parseFloat(itemPrice));
    shoppingCart.total += parseFloat(itemPrice);

    await shoppingCart.save();
    return shoppingCart.populate('cartOwner');
  }


  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
   static async removeFromCart(shoppingCartId: Types.ObjectId | string, itemForSaleId: string): Promise<HydratedDocument<ShoppingCart>> {
    const shoppingCart = await ShoppingCartModel.findOne({_id: shoppingCartId});

    if (!shoppingCart.items.has(itemForSaleId)){
        shoppingCart.items.set(itemForSaleId, 0);
    }
    shoppingCart.items.set(itemForSaleId, shoppingCart.items.get(itemForSaleId) - 1);

    if (shoppingCart.items.get(itemForSaleId) <= 0){
        shoppingCart.items.delete(itemForSaleId);
    }

    shoppingCart.numberOfItems -= 1;
    const itemPrice = await ItemForSaleCollection.getPrice(itemForSaleId);
    shoppingCart.total -= parseFloat(itemPrice);
    //shoppingCart.total -= await ItemForSaleCollection.getPrice({_id: itemForSaleId});

    await shoppingCart.save();
    return shoppingCart.populate('cartOwner');
  }


  /**
   * 
   * @param shoppingCartId 
   * @param itemForSaleId 
   * @returns 
   */
  static async clearCart(shoppingCartId: Types.ObjectId | string): Promise<HydratedDocument<ShoppingCart>> {
    const shoppingCart = await ShoppingCartModel.findOne({_id: shoppingCartId});

    shoppingCart.items.clear();

    shoppingCart.numberOfItems = 0;
    shoppingCart.total = 0;

    await shoppingCart.save();
    return shoppingCart.populate('cartOwner');
  }



  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteShoppingCart(shoppingCartId: Types.ObjectId | string): Promise<boolean> {
    const freet = await ShoppingCartModel.deleteOne({_id: shoppingCartId});
    return freet !== null;
  }


  static async deleteShoppingCartByCartOwner(cartOwner: Types.ObjectId | string): Promise<boolean> {
    const freet = await ShoppingCartModel.deleteMany({cartOwner});
    return freet !== null;
  }

//   /**
//    * Delete all the freets by the given author
//    *
//    * @param {string} authorId - The id of author of freets
//    */
//   static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
//     await FreetModel.deleteMany({authorId});
//   }
}

export default ShoppingCartCollection;
