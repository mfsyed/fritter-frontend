import {Request, Response, NextFunction, json} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import ItemForSaleCollection from '../ItemForSale/collection';
import ShoppingCartCollection from './collection';
import ShoppingCartModel from '../shoppingCart/model';
import * as userValidator from '../user/middleware';
import * as shoppingCartValidator from '../shoppingCart/middleware';
import * as itemForSaleValidator from '../ItemForSale/middleware';
import * as itemForSaleUtil from '../ItemForSale/util';
import * as util from './util';

const router = express.Router();

// /**
//  * Get all the freets
//  *
//  * @name GET /api/freets
//  *
//  * @return {FreetResponse[]} - A list of all the freets sorted in descending
//  *                      order by date modified
//  */
// /**
//  * Get freets by author.
//  *
//  * @name GET /api/freets?authorId=id
//  *
//  * @return {FreetResponse[]} - An array of freets created by user with id, authorId
//  * @throws {400} - If authorId is not given
//  * @throws {404} - If no user has given authorId
//  *
//  */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
  
    // Check if authorId query parameter was supplied
    if (req.query.cartOwner !== undefined) {
      next();
      return;
    }

    const allCarts = await ShoppingCartCollection.findAll();
    const response = allCarts.map(util.constructShoppingCartResponse);
    res.status(200).json(response);

  },
  async (req: Request, res: Response) => {
    //const cart = await ShoppingCartCollection.findCartByUserId(req.session.userId as string);
    //const items = await ShoppingCartCollection.getAllItemsInCart(cart._id.ShoppingCartModel as string);
    const items = await ShoppingCartCollection.getAllItemsInCartByUsername(req.query.cartOwner as string);
    const formattedItems = items.map(itemForSaleUtil.constructItemForSaleResponse);
    res.status(200).json(formattedItems);
  }
//   [
//     userValidator.isAuthorExists
//   ],
//   async (req: Request, res: Response) => {
//     const userId = (req.session.userId as string) ?? '';
//     const userCart = await ShoppingCartCollection.findCartByUsername(userId);
//     const response = util.constructShoppingCartResponse(userCart);
//     res.status(200).json(response);
//   }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
    '/',
  [
    userValidator.isUserLoggedIn,
    //shoppingCartValidator.doesUserAlreadyHaveShoppingCart
    //freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const cart = await ShoppingCartCollection.addOne(userId);

    res.status(201).json({
      message: 'Your cart was created successfully.',
      freet: util.constructShoppingCartResponse(cart)
    });
  }
);

/**
 * Delete cart
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:shoppingCartId?',
  [
    userValidator.isUserLoggedIn,
    shoppingCartValidator.doesShoppingCartExist
    //freetValidator.isFreetExists,
    //freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await ShoppingCartCollection.deleteShoppingCart(req.params.shoppingCartId);
    res.status(200).json({
      message: 'Your cart was deleted successfully.'
    });
  }
);

/**
 * add to cart
 *
 * @name PUT /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.put(
  '/:itemForSaleId',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.cartIdRemoveFrom) next('route');
    else next();
  },
  [
    userValidator.isUserLoggedIn,
    //shoppingCartValidator.isValidCartModifier,
    shoppingCartValidator.doesShoppingCartExist,
    itemForSaleValidator.isItemForSaleExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    //const {username} = await UserCollection.findOneByUserId(userId);
    //const cart = await ShoppingCartCollection.findCartByUsername(username);
    //const shoppingCart = await ShoppingCartCollection.findCartByUserId(userId);
    console.log("will add");
    //const freet = await ShoppingCartCollection.addToCart(ShoppingCartModel., req.params.itemForSaleId);
    const freet = await ShoppingCartCollection.addToCart(req.body.cartId, req.params.itemForSaleId);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      cart: util.constructShoppingCartResponse(freet)
    });
  },

  [
    userValidator.isUserLoggedIn,
    //shoppingCartValidator.isValidCartModifier,
    shoppingCartValidator.doesShoppingCartExist,
    itemForSaleValidator.isItemForSaleExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    //const {username} = await UserCollection.findOneByUserId(userId);
    //const cart = await ShoppingCartCollection.findCartByUsername(username);
    //const cart = await ShoppingCartCollection.findCartByUserId(userId);
    console.log("will add");
    const freet = await ShoppingCartCollection.removeFromCart(req.body.cartIdRemoveFrom, req.params.itemForSaleId);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      cart: util.constructShoppingCartResponse(freet)
    });
  }

);

export {router as shoppingCartRouter};
