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

router.post('/upload-recipe', upload.single('image'), recipeController.uploadRecipe);
router.get('/:id', recipeController.getRecipe);

export default router;
