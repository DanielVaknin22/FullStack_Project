import { Request, Response } from 'express';
import Recipe from '../models/recipe_model';

export const uploadRecipe = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const image = req.file?.path;

    const recipe = new Recipe({
      name,
      description,
      image,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload recipe', error });
  }
};

export const getRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get recipe', error });
  }
};


export default {
    uploadRecipe,
    getRecipe,
};
