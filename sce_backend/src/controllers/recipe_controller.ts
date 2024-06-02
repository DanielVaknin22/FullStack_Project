import { Request, Response } from 'express';
import Recipe from '../models/recipe_model';
import User from '../models/user_model'; 
// import mongoose from 'mongoose';

export const uploadRecipe = async (req: Request, res: Response) => {
  try {
    const { name, description, userId } = req.body;
    const image = req.file?.path;

    const recipe = new Recipe({
      name,
      description,
      image,
      userId
    });

    const savedRecipe = await recipe.save();

    await User.findByIdAndUpdate(userId, {
      $push: { recipes: savedRecipe._id }
    });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload recipe', error });
  }
};


export const getRecipe = async (req: Request, res: Response) => {
  try {
    let recipes;
    if(req.query.name) {
      recipes = await Recipe.find({ userId: req.query.userId });
    }
    else {
      recipes = await Recipe.find();
    }

    const recipesWithName = await Promise.all(recipes.map(async (recipe) => {
      const user = await User.findById(recipe.userId);
      const fullname = user ? user.fullName : 'Unknown';
      return {
        ...recipe.toObject(),
        fullname
      };
    }));
    res.status(200).json(recipesWithName);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  const { recipeId } = req.params;
  const { name, description } = req.body;
  try {
      const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, { name, description }, { new: true });
      res.status(200).json(updatedRecipe);
  } catch (error) {
      console.error('Error updating recipe:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  const { recipeId } = req.params;
  try {
      await Recipe.findByIdAndDelete(recipeId);
      res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
      console.error('Error deleting recipe:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find().populate('userId', 'fullName photo');
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



export default {
    uploadRecipe,
    getRecipe,
    updateRecipe,
    deleteRecipe,
    getAllRecipes,
};
