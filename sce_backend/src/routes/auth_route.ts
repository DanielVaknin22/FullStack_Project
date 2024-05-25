import express from "express";
import authController from "../controllers/auth_controller";
const router = express.Router();
import multer from "multer";
// const upload = multer({ dest: 'uploads/' });
import path from 'path';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });



/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*     Tokens:
*       type: object
*       required:
*         - accessToken
*         - refreshToken
*       properties:
*         accessToken:
*           type: string
*           description: The JWT access token
*         refreshToken:
*           type: string
*           description: The JWT refresh token
*       example:
*         accessToken: '123cd123x1xx1'
*         refreshToken: '134r2134cr1x3c'
*/


/**
* @swagger
* /auth/register:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.post("/register", upload.single('profilePicture'), authController.register);

/**
* @swagger
* /auth/login:
*   post:
*     summary: login existing user by email and password
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The acess & refresh tokens
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*/
router.post("/login", authController.login);

/**
* @swagger
* /auth/logout:
*   get:
*     summary: logout a user
*     tags: [Auth]
*     description: need to provide the refresh token in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: logout completed successfully
*/
router.post("/logout", authController.logout);

/**
* @swagger
* /auth/refresh:
*   get:
*     summary: get a new access and refresh tokens using the refresh token
*     tags: [Auth]
*     description: need to provide the refresh token in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The acess & refresh tokens
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*/
router.get("/refresh", authController.refresh);

/**
 * @swagger
 * /auth/user/{userId}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User details retrieved successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get("/user/:id", authController.getUserDetails);

/**
 * @swagger
 * /auth/user/{userId}:
 *   put:
 *     summary: Update user details by ID
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User details updated successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.put("/user/:id", upload.single('profilePicture'), authController.updateUserDetails);

export default router;