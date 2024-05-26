import mongoose from "mongoose";

export interface IUser {
    email: string;
    password: string;
    fullName: string;
    username: string;
    recipes: string;
    profilePicture?: string;
    tokens: string[];
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    recipes: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    tokens: {
        type: [String],
    },
});

export default mongoose.model<IUser>("User", userSchema);
