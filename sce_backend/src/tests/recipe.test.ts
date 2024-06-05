import request from "supertest";
import appInit from "../App";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";
import Recipe from "../models/recipe_model"; // Adjust the import based on your actual model path

const user = {
    email: "teszt@gmail.com",
    password: "123456"
};

const recipe = {
    title: "Test Recipe",
    ingredients: ["Ingredient 1", "Ingredient 2"],
    instructions: "Test instructions"
};

let app: Express;
let accessToken = "";
let recipeId = "";

// Setup and Teardown
beforeAll(async () => {
    app = await appInit();
    console.log("beforeAll");
    await User.deleteMany({ email: user.email });
    await Recipe.deleteMany({});
    // Register and login to get an access token
    await request(app).post("/auth/register").send(user);
    const res = await request(app).post("/auth/login").send(user);
    accessToken = res.body.accessToken;
});

afterAll(async () => {
    console.log("afterAll");
    await mongoose.connection.close();
});

// Test Suite for Recipes
describe("Recipes test", () => {
    test("Post /recipes", async () => {
        const res = await request(app)
            .post("/recipes")
            .set('Authorization', 'Bearer ' + accessToken)
            .send(recipe);
        expect(res.statusCode).toBe(201); // Assuming successful creation returns 201
        expect(res.body.title).toBe(recipe.title);
        expect(res.body.ingredients).toEqual(recipe.ingredients);
        expect(res.body.instructions).toBe(recipe.instructions);
        recipeId = res.body._id; // Store the created recipe ID for later tests
    });

    test("Get /recipes/:id", async () => {
        const res = await request(app)
            .get(`/recipes/${recipeId}`)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(recipeId);
        expect(res.body.title).toBe(recipe.title);
        expect(res.body.ingredients).toEqual(recipe.ingredients);
        expect(res.body.instructions).toBe(recipe.instructions);
    });

    test("Put /recipes/:id", async () => {
        const updatedRecipe = { ...recipe, title: "Updated Test Recipe" };
        const res = await request(app)
            .put(`/recipes/${recipeId}`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send(updatedRecipe);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(recipeId);
        expect(res.body.title).toBe(updatedRecipe.title);
        expect(res.body.ingredients).toEqual(updatedRecipe.ingredients);
        expect(res.body.instructions).toBe(updatedRecipe.instructions);
    });

    test("Delete /recipes/:id", async () => {
        const res = await request(app)
            .delete(`/recipes/${recipeId}`)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(204); // Assuming successful deletion returns 204
    });

    test("Get /recipes", async () => {
        const res = await request(app)
            .get("/recipes")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        // Optionally, check if the list includes specific recipes
    });
});
