import mongoose from 'mongoose';

interface IRecipe {
    name: string;
    description: string;
    image: string;
}

const RecipeSchema = new mongoose.Schema<IRecipe>({
    name: { 
        type: String,
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
    },
});

const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;