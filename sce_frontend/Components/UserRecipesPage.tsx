import React, { useEffect, useState, FC } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Button } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface Recipe {
    _id: string;
    name: string;
    description: string;
    image: string;
}

const UserRecipesPage: FC<{ navigation: any }> = ({ navigation }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUserRecipes = async () => {
        try {
            const userId = await SecureStore.getItemAsync('userId');
            if (!userId) {
                console.error('User ID not found');
                return;
            }
            const response = await axios.get(`http://10.0.2.2:3000/recipe/${userId}`);
            setRecipes(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserRecipes();
    }, [navigation]);

    navigation.setOptions({
        headerRight: () => (
            <Button
                onPress={() => navigation.navigate('RecipeUpload')}
                title="Add"
            />
        ),
    })

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const handleEditRecipe = (recipeId: string) => {
        navigation.navigate('EditRecipePage', { recipeId });
    };

    const handleDeleteRecipe = async (recipeId: string) => {
        try {
            await axios.delete(`http://10.0.2.2:3000/recipe/${recipeId}`);
            setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
            alert('Recipe deleted successfully');
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Failed to delete recipe');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.recipeItem}>
                        <Image 
                            source={{ uri: `http://192.168.1.135:3000/${item.image.replace(/\\/g, '/')}` }} 
                            style={styles.image} 
                        />
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <Button title="Edit" onPress={() => handleEditRecipe(item._id)} />
                        <Button title="Delete" onPress={() => handleDeleteRecipe(item._id)} />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    recipeItem: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
    },
});

export default UserRecipesPage;
