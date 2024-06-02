import mongoose from 'mongoose';

interface IRecipe {
    name: string;
    description: string;
    image: string;
    userId: mongoose.Types.ObjectId;
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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;
