import React, { useState, useEffect, FC } from 'react';
import { View, TextInput, Button, Image, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';

const EditRecipePage: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { recipeId } = route.params;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); 
    const [updating, setUpdating] = useState<boolean>(false); 

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await axios.get(`http://192.168.1.135:3000/recipe/${recipeId}`);
                const recipes = response.data;
                const recipe = recipes.find((r: any) => r._id === recipeId);

                if (recipe) {
                    const { name, description, image } = recipe;
                    console.log('Fetched recipe details:', recipe);

                    setName(name);
                    setDescription(description);
                    setImage(image ? `http://192.168.1.135:3000/${image.replace(/\\/g, '/')}` : null);
                } else {
                    console.error('Recipe not found');
                }
            } catch (error) {
                console.error('Error fetching recipe details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipeDetails();
    }, [recipeId]);

    const handleUpdateRecipe = async () => {
        setUpdating(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        try {
            await axios.put(`http://192.168.1.135:3000/recipe/${recipeId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Recipe updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating recipe:', error);
            alert('Failed to update recipe');
        } finally {
            setUpdating(false);
        }
    };

    const onCancel = () => {
        navigation.goBack();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {image && (
                <Image source={{ uri: image }} style={styles.image} />
            )}
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Recipe Name"
            />
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Recipe Description"
                multiline
            />
            <Button title="Cancel" onPress={onCancel} />
            <TouchableOpacity style={styles.button} onPress={handleUpdateRecipe} disabled={updating}>
                {updating ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text style={styles.buttonText}>Update Recipe</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    button: {
        height: 50,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditRecipePage;
