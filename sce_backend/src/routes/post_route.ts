import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";

/**
* @swagger
* tags:
*   name: Post
*   description: The Post API
*/

/**
* @swagger
* components:
*   schemas:
*     Post:
*       type: object
*       required:
*         - _id
*         - title
*         - content
*       properties:
*         _id:
*           type: string
*           description: The post id
*         title:
*           type: string
*           description: The post title
*         content:
*           type: string
*           description: The post content
*       example:
*         _id: '12345'
*         title: 'My First Post'
*         content: 'This is the content of my first post.'
*/

/**
* @swagger
* /post:
*   get:
*     summary: Get all posts
*     tags: [Post]
*     responses:
*       200:
*         description: List of all posts
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                  $ref: '#/components/schemas/Post'
*/
router.get("/", postController.get.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: '12345'
 *         description: Unique ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.get("/:id", postController.getById.bind(postController));

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.post("/", authMiddleware, postController.post.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: '12345'
 *         description: Unique ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.put("/:id", postController.put.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: '12345'
 *         description: Unique ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete("/:id", postController.remove.bind(postController));

export default router;
