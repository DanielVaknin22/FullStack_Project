import React, { useState, FC } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from '@react-navigation/native';

const RecipeUploadPage: FC<{ navigation: any }> = ({ navigation }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        const userId = await SecureStore.getItemAsync('userId');
        if (!userId) {
            console.error('User ID not found');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('userId', userId);

        if (image) {
            const fileName = image.split('/').pop();
            const match = /\.(\w+)$/.exec(fileName || '');
            const type = match ? `image/${match[1]}` : 'image';
            formData.append('image', {
                uri: image,
                name: fileName,
                type: type,
            } as any);
        }

        setLoading(true);

        try {
            const response = await axios.post('http://10.0.2.2:3000/recipe/upload-recipe', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Recipe uploaded:', response.data);
            navigation.dispatch(
                CommonActions.navigate({
                    name: 'MainApp',
                    params: {
                        screen: 'UserRecipesPage'
                    },
                })
            );        
        } catch (error) {
            console.error('Error uploading recipe:', error);
        } finally {
            setLoading(false);
        }
    };

    const onCancel = () => {
        navigation.goBack();
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <Text style={styles.imagePlaceholder}>Pick an image</Text>
                )}
            </TouchableOpacity>
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
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />
            ) : (
                <Button title="Upload Recipe" onPress={handleUpload} />
            )}
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
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    imagePlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        textAlign: 'center',
        lineHeight: 200,
        color: '#888',
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
    activityIndicator: {
        marginVertical: 20,
    },
});

export default RecipeUploadPage;
