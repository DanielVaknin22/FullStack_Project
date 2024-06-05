import React, { useEffect, useState, FC } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

interface Recipe {
    _id: string;
    name: string;
    description: string;
    image: string;
    fullname: string;
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
            const response = await axios.get(`http://10.0.2.2:3000/recipe/user/${userId}`);
            setRecipes(response.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            Alert.alert('Error', 'Failed to fetch recipes');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchUserRecipes();
        }, [])
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('RecipeUpload')}
                    style={styles.addButton}
                >
                    <Text style={styles.addButtonText}>Add Recipe 📝</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleEditRecipe = (recipeId: string) => {
        navigation.navigate('EditRecipePage', { recipeId });
    };

    const handleDeleteRecipe = async (recipeId: string) => {
        try {
            await axios.delete(`http://10.0.2.2:3000/recipe/${recipeId}`);
            setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
            Alert.alert('Success', 'Recipe deleted successfully');
        } catch (error) {
            console.error('Error deleting recipe:', error);
            Alert.alert('Error', 'Failed to delete recipe');
        }
    };

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
                    <View style={styles.recipeItem}>
                        {item.image && (
                            <Image 
                                source={{ uri: `http://10.0.2.2:3000/${item.image.replace(/\\/g, '/')}` }} 
                                style={styles.image} 
                            />
                        )}
                        <Text style={styles.fullname}>{item.fullname}</Text>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button]} onPress={() => handleEditRecipe(item._id)}>
                                <Text style={styles.buttonText}>✏️ Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button]} onPress={() => handleDeleteRecipe(item._id)}>
                                <Text style={styles.buttonText}>🗑️ Delete</Text>
                            </TouchableOpacity>
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
        padding: 20,
        backgroundColor: '#dddcdc',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    fullname: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        width: '40%',
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        // backgroundColor: '#666666b4',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#666',
    },
    buttonText: {
        color: '#666',
        fontSize: 16,
    },
    addButton: {
        marginRight: 10,
        padding: 10,
        backgroundColor: '#666666b4',
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
    },

});

export default UserRecipesPage;
