import type {HydratedDocument, Types} from 'mongoose';
import type {ItemForSale} from './model';
import ItemForSaleModel from './model';
import UserCollection from '../user/collection';

/**
 * ItemForSaleClass Collection
 */
class ItemForSaleCollection {
 
  /**
   * Add an itemForSale to the collection
   * @param sellerId Id of the seller of this itemForSale (the author)
   * @param description description of this item
   * @param price price of the item
   * @param link link to the item 
   * @returns 
   */
  static async addItem(sellerId: Types.ObjectId | string, description: string, price:string, link:string): Promise<HydratedDocument<ItemForSale>> {
    const date = new Date();
    const itemForSale = new ItemForSaleModel({
      sellerId,
      dateCreated: date,
      description,
      dateModified: date,
      price,
      link
    });
    await itemForSale.save(); // Saves freet to MongoDB
    return itemForSale.populate('sellerId');
  }

  /**
   * Find a itemForSale by its object ID.
   *
   * @param {string} itemForSaleId - The id of the freet to find
   * @return {Promise<HydratedDocument<ItemForSale>> | Promise<null> } - The itemForSale, if any
   */
  static async findOne(itemForSaleId: Types.ObjectId | string): Promise<HydratedDocument<ItemForSale>> {
    return ItemForSaleModel.findOne({_id: itemForSaleId}).populate('sellerId');
  }

  /**
   * Get all the itemsForSale in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the itemsForSale
   */
  static async findAllItems(): Promise<Array<HydratedDocument<ItemForSale>>> {
    // Retrieves itemsForSale and sorts them from most to least recent
    return ItemForSaleModel.find({}).sort({dateModified: -1}).populate('sellerId');
  }

  /**
   * Get all items for sale given by seller
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllItemsByUsername(username: string): Promise<Array<HydratedDocument<ItemForSale>>> {
    const seller = await UserCollection.findOneByUsername(username);
    return ItemForSaleModel.find({sellerId: seller._id}).populate('sellerId');
  }



  /**
   * 
   * @param itemForSaleId: the id of the itemForSale to edit
   * @param description the price to update the itemForSale
   * @returns an updated itemForSale
   */
  static async updateDescription(itemForSaleId: Types.ObjectId | string, description: string): Promise<HydratedDocument<ItemForSale>> {
    const item = await ItemForSaleModel.findOne({_id: itemForSaleId});
    item.description = description;
    item.dateModified = new Date();
    await item.save();
    return item.populate('sellerId');
  }

/**
 * 
 * @param itemId the id of the itemForSale
 * @returns {Promise<string>} - price of item in string format
 */
  static async getPrice(itemId: Types.ObjectId | string): Promise<string> {
    const item = await ItemForSaleModel.findOne({_id: itemId});
    return item.price;
  }

  /**
   * 
   * @param itemForSaleId: the id of the itemForSale to edit
   * @param price the price to update the itemForSale
   * @returns an updated itemForSale
   */
  static async updatePrice(itemForSaleId: Types.ObjectId | string, price: string): Promise<HydratedDocument<ItemForSale>> {
    const item = await ItemForSaleModel.findOne({_id: itemForSaleId});
    item.price = price;
    item.dateModified = new Date();
    await item.save();
    return item.populate('sellerId');
  }

  /**
   * 
   * @param itemForSaleId: the id of the itemForSale to edit
   * @param link the link to update the itemForSale
   * @returns an updated itemForSale
   */
  static async updateLink(itemForSaleId: Types.ObjectId | string, link: string): Promise<HydratedDocument<ItemForSale>> {
    const item = await ItemForSaleModel.findOne({_id: itemForSaleId});
    item.link = link;
    item.dateModified = new Date();
    await item.save();
    return item.populate('sellerId');
  }


  /**
   * delete an itemForSale by its id
   *
   * @param {string} itemForSaleId - The itemForSaleId of the ItemForSale to delete
   * @return {Promise<Boolean>} - true if the item has been deleted, false otherwise
   */
  static async deleteItem(itemForSaleId: Types.ObjectId | string): Promise<boolean> {
    const itemForSale= await ItemForSaleModel.deleteOne({_id: itemForSaleId});
    return itemForSale !== null;
  }

  /**
   * Delete all of the items a seller sells.
   *
   * @param {string} sellerId - The id of of an itemForSale's seller
   */
  static async deleteManyItems(sellerId: Types.ObjectId | string): Promise<void> {
    await ItemForSaleModel.deleteMany({sellerId});
  }
}

export default ItemForSaleCollection;
