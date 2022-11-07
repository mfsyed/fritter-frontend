import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from './middleware';
import * as util from './util';

const router = express.Router();

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    console.log("in the first get");
    //console.log(req);
    console.log(req.query)
    if (req.query.originalFreetId !== undefined) {
      console.log("here");
      next();
      return;
    }

    const allComments = await CommentCollection.findAll();
    const response = allComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  },
  // [
  //   userValidator.isAuthorExists
  // ],
  async (req: Request, res: Response) => {
    console.log("in router");
    const freetComments = await CommentCollection.findAllByFreet(req.query.originalFreetId as string);
    const response = freetComments.map(util.constructCommentResponse);
    console.log(response);
    console.log("response in router");
    res.status(200).json(response);
  }
);

/**
 * Create a new comment.
 *
 * @name POST /api/comment
 *
 * @param {string} content - The content of the comment
 * @return {CommentResponse} - The created comment
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 * @throws {413} - If the comment content is more than 140 characters long
 */
router.post(
  '/:originalFreetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    console.log(req.params);
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const comment = await CommentCollection.addOne(userId, req.params.originalFreetId, req.body.content);

    res.status(201).json({
      message: 'Your comment was created successfully.',
      freet: util.constructCommentResponse(comment)
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the commentor of
 *                 the commentor
 * @throws {404} - If the commenttId is not valid
 */
router.delete(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    //commentValidator.isOriginalFreetExists
  ],
  async (req: Request, res: Response) => {
    await CommentCollection.deleteOne(req.params.commentId);
    res.status(200).json({
      message: 'Your comment was deleted successfully.'
    });
  }
);

/**
 * Modify a freet
 *
 * @name PUT /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {CommentResponse} - the updated comment
 * @throws {403} - if the user is not logged in or not the comment of
 *                 of the comment
 * @throws {404} - If the commenttId is not valid
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 * @throws {413} - If the comment content is more than 140 characters long
 */
router.put(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isValidCommentModifier,
    commentValidator.isCommentExists,
    commentValidator.isValidCommentContent
  ],
  async (req: Request, res: Response) => {
    const comment = await CommentCollection.updateOne(req.params.commentId, req.body.content);
    res.status(200).json({
      message: 'Your comment was updated successfully.',
      freet: util.constructCommentResponse(comment)
    });
  }
);

export {router as commentRouter};
