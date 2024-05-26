import React, { useState, useEffect, FC } from 'react';
import { View, TextInput, Button, Image, StyleSheet } from 'react-native';
import axios from 'axios';

const EditRecipePage: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { recipeId } = route.params;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await axios.get(`http://192.168.1.135:3000/recipe/${recipeId}`);
                const { name, description } = response.data;
                setName(name);
                setDescription(description);
            } catch (error) {
                console.error('Error fetching recipe details:', error);
            }
        };
        fetchRecipeDetails();
    }, []);

    const handleUpdateRecipe = async () => {
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
        }
    };

    const onCancel = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
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
            <Button title="Update Recipe" onPress={handleUpdateRecipe} />
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
});

export default EditRecipePage;
