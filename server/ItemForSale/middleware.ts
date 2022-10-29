import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ItemForSaleCollection from '../ItemForSale/collection';

/**
 * Checks if a itemForSale exists where its respective id is req.params exists 
 */
const isItemForSaleExists = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.body);

  // console.log("hi");
  // console.log(req.params);
  // console.log(req.body);
  const validFormat = Types.ObjectId.isValid(req.params.itemForSaleId);
  const validFormatBody = Types.ObjectId.isValid(req.params.itemForSaleId);
  const itemForSale = validFormat ? await ItemForSaleCollection.findOne(req.params.itemForSaleId) : '';
  const itemForSaleBody = validFormatBody ? await ItemForSaleCollection.findOne(req.body.itemForSaleId) : '';
  if (!itemForSale && !itemForSaleBody) {
    res.status(404).json({
      error: {
        itemNotFound: `itemForSale does not exist`
      }
    });
    return;
  }

  next();
};

// const isSellerExists = async (req: Request, res: Response, next: NextFunction) => {
//     const validFormat = Types.ObjectId.isValid(req.params.itemForSaleId);
//     const itemForSale =  await ItemForSaleCollection.findOne(req.params.itemForSaleId);
//     const.
//     if (!itemForSale) {
//       res.status(404).json({
//         error: {
//           freetNotFound: `itemForSale does not exist`
//         }
//       });
//       return;
//     }
//     next();
//   };


/**
 * Checks if the content of the description in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetDescription = (req: Request, res: Response, next: NextFunction) => {
  //if(req.body.price !== null) next('route');
  console.log(req.params);
  console.log("params");
  console.log("isValid");
  const {description} = req.body as {description: string};
  console.log(description);
  console.log("description")
  if (!description.trim()) {
    res.status(400).json({
      error: 'description must be at least one character long.'
    });
    return;
  }

  if (description.length > 140) {
    res.status(413).json({
      error: 'description must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the price in req.body is valid
 */
 const isValidPrice = (req: Request, res: Response, next: NextFunction) => {
    const {price} = req.body as {price: string};
    console.log(price);
    console.log("Price");
    // if (!price.trim()) {
    //   res.status(400).json({
    //     error: 'Freet content must be at least one character long.'
    //   });
    //   return;
    //}

    const regEx = RegExp("[0-9]+\.[0-9][0-9]");
    if (!regEx.test(price)){
      res.status(400).json({
          error: 'invalid price. please enter in the form $$.$$, i.e. <dollars>.<cents>.'
        });
        return;
    }
    // const priceNumber = parseFloat(price);
    // if (priceNumber === NaN || priceNumber < 0){
    //     res.status(400).json({
    //         error: 'Pls enter a valid price.'
    //       });
    //       return;
    // }

    next();
};




/**
 * Checks if the current user is the seller of the itemForSale whose respective id is in req.params
 */
const isValidItemForSaleModifier = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params);
  const itemForSale = await ItemForSaleCollection.findOne(req.params.itemForSaleId);
  const userId = itemForSale.sellerId._id;
  console.log(userId);
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' itemsForSale.'
    });
    return;
  }

  next();
};

export {
  isItemForSaleExists,
  isValidFreetDescription,
  isValidPrice,
  isValidItemForSaleModifier
};





