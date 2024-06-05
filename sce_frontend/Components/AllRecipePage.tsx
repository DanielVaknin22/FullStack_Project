import React, { FC, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { User } from '../Model/UserModel';
import { useFocusEffect } from '@react-navigation/native';

interface Recipe {
    _id: string;
    name: string;
    description: string;
    image: string;
    userId: string; 
    user?: User;
}

const AllRecipesPage: FC<{ navigation: any }> = ({ navigation }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:3000/recipe/recipes');
            const fetchedRecipes: Recipe[] = response.data;

            // Fetch user details for each recipe
            const recipesWithUserDetails = await Promise.all(fetchedRecipes.map(async (recipe) => {
                try {
                    const userResponse = await axios.get(`http://10.0.2.2:3000/auth/user/${recipe.userId}`);
                    return { ...recipe, user: userResponse.data };
                } catch (error) {
                    console.error(`Error fetching user details for user ID ${recipe.userId}:`, error);
                    return recipe; // Return the recipe without user details if fetching fails
                }
            }));

            setRecipes(recipesWithUserDetails);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchRecipes();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#666" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.recipeContainer}>
                        <View style={styles.recipeDetails}>
                            <View style={styles.userContainer}>
                                <Image 
                                    style={styles.profilePicture} 
                                    source={item.user && item.user.profilePicture 
                                        ? { uri: `http://10.0.2.2:3000/${item.user.profilePicture.replace(/\\/g, '/')}` }
                                        : require('../assets/avatar.jpeg')} 
                                />
                                <Text style={styles.fullName}>{item.user?.fullName}</Text>
                            </View>
                            <Text style={styles.recipeName}>{item.name}</Text>
                            <Text style={styles.recipeDescription}>{item.description}</Text>
                            {item.image && (
                                <Image 
                                    source={{ uri: `http://10.0.2.2:3000/${item.image.replace(/\\/g, '/')}` }} 
                                    style={styles.recipeImage} 
                                />
                            )}
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    recipeImage: {
        width: 350,
        height: 350,
        borderRadius: 10,
        margin: 10,
    },
    recipeDetails: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 10,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#6666662f',
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10,
        margin: 5,
    },
    fullName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
    },
    recipeName: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 5,
        margin: 5,
    },
    recipeDescription: {
        fontSize: 18,
        margin: 5,
    },
});

export default AllRecipesPage;
