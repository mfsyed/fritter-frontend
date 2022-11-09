//does shopping cart exists
import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ShoppingCartCollection from '../shoppingCart/collection';
import UserCollection from '../user/collection';





// /**
//  * Checks if a shopping cart exits
//  */
//  const doesUserAlreadyHaveShoppingCart = async (req: Request, res: Response, next: NextFunction) => {
//   const {username} = await UserCollection.findOneByUserId(req.session.userId);
//   const cart = await ShoppingCartCollection.findCartByUsername(username);
//   //console.log(cart.);
//   if (cart) {
//     res.status(404).json({
//       error: {
//         cartNotFound: `Cart for user already exists.`
//       }
//     });
//     return;
//   }

//   next();
// };



/**
 * Checks if a shopping cart exits
 */
const doesShoppingCartExist = async (req: Request, res: Response, next: NextFunction) => {
  const {username} = await UserCollection.findOneByUserId(req.session.userId);
  const cart = await ShoppingCartCollection.findCartByUsername(username);
  //const freet = validFormat ? await ShoppingCartCollection.findOne(req.params.shoppingCartId) : '';
  if (!cart) {
    res.status(404).json({
      error: {
        cartNotFound: `Cart does not exist.`
      }
    });
    return;
  }

  next();
};

const createCartIfNotExist = async (req: Request, res: Response, next: NextFunction) => {
  const {username} = await UserCollection.findOneByUserId(req.session.userId);
  const cart = await ShoppingCartCollection.findCartByUsername(username);
  //const freet = validFormat ? await ShoppingCartCollection.findOne(req.params.shoppingCartId) : '';
  if (!cart) {
    const newCart = await ShoppingCartCollection.addOne(req.session.userId);
    return;
  }

  next();
};


const isItemInCart = async (req: Request, res: Response, next: NextFunction) => {
  const shoppingCart = await ShoppingCartCollection.findOne(req.params.shoppingCartId);
  const userId = shoppingCart.cartOwner._id;
  const itemId =  req.params.itemId.toString();
  if (shoppingCart.items.has(itemId)) {
    res.status(403).json({
      error: 'item is not in cart!!!!!!!'
    });
    return;
  }

  next();
};

// /**
//  * Checks if the current user is the author of the freet whose freetId is in req.params
//  */
// const isValidCartModifier = async (req: Request, res: Response, next: NextFunction) => {
//   const {username} = await UserCollection.findOneByUserId(req.session.userId);
//   const cart = await ShoppingCartCollection.findCartByUsername(username);

//   const shoppingCart = await ShoppingCartCollection.findOne(req.params.shoppingCartId);
//   const userId = shoppingCart.cartOwner;
//   if (req.session.userId !== userId.toString()) {
//     res.status(403).json({
//       error: 'Cannot modify other users\' carts.'
//     });
//     return;
//   }

//   next();
//};

export {
  doesShoppingCartExist,
  createCartIfNotExist,
  //doesUserAlreadyHaveShoppingCart,
  isItemInCart,
  //isValidCartModifier
};
