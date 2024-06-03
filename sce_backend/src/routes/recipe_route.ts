import express from 'express';
import multer from 'multer';
import path from 'path';
import recipeController from '../controllers/recipe_controller';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

/**
* @swagger
* tags:
*   name: Recipes
*   description: The Recipes API
*/

/**
* @swagger
* components:
*   schemas:
*     Recipe:
*       type: object
*       required:
*         - title
*         - ingredients
*         - instructions
*       properties:
*         title:
*           type: string
*           description: The recipe title
*         ingredients:
*           type: array
*           items:
*             type: string
*           description: The recipe ingredients
*         instructions:
*           type: string
*           description: The recipe instructions
*         image:
*           type: string
*           description: The recipe image URL
*       example:
*         title: 'Chocolate Cake'
*         ingredients: ['flour', 'sugar', 'cocoa powder']
*         instructions: 'Mix ingredients and bake at 350 degrees for 30 minutes'
*         image: 'http://example.com/image.jpg'
*/

/**
* @swagger
* /recipe/upload-recipe:
*   post:
*     summary: Upload a new recipe
*     tags: [Recipes]
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               title:
*                 type: string
*               ingredients:
*                 type: string
*               instructions:
*                 type: string
*               image:
*                 type: string
*                 format: binary
*     responses:
*       201:
*         description: Recipe uploaded successfully
*/
router.post('/upload-recipe', upload.single('image'), recipeController.uploadRecipe);

/**
* @swagger
* /recipe/{userId}:
*   get:
*     summary: Get recipes by user ID
*     tags: [Recipes]
*     parameters:
*       - in: path
*         name: userId
*         required: true
*         schema:
*           type: string
*         description: The ID of the user
*     responses:
*       200:
*         description: Recipes retrieved successfully
*/
router.get('/:userId', recipeController.getRecipe);

/**
* @swagger
* /recipe/{recipeId}:
*   put:
*     summary: Update a recipe by ID
*     tags: [Recipes]
*     parameters:
*       - in: path
*         name: recipeId
*         required: true
*         schema:
*           type: string
*         description: The ID of the recipe to update
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Recipe'
*     responses:
*       200:
*         description: Recipe updated successfully
*/
router.put('/:recipeId', recipeController.updateRecipe);

/**
* @swagger
* /recipe/{recipeId}:
*   delete:
*     summary: Delete a recipe by ID
*     tags: [Recipes]
*     parameters:
*       - in: path
*         name: recipeId
*         required: true
*         schema:
*           type: string
*         description: The ID of the recipe to delete
*     responses:
*       200:
*         description: Recipe deleted successfully
*/
router.delete('/:recipeId', recipeController.deleteRecipe);

/**
* @swagger
* /recipe/recipes:
*   get:
*     summary: Get all recipes
*     tags: [Recipes]
*     responses:
*       200:
*         description: Recipes retrieved successfully
*/
router.get('/recipes', recipeController.getAllRecipes);

/**
* @swagger
* /recipe/user/{userId}:
*   get:
*     summary: Get a recipe by user ID
*     tags: [Recipes]
*     parameters:
*       - in: path
*         name: userId
*         required: true
*         schema:
*           type: string
*         description: The ID of the user
*     responses:
*       200:
*         description: Recipe retrieved successfully
*/
router.get('/user/:userId', recipeController.getRecipeById);

export default router;
