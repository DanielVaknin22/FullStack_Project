import React, { FC, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { User } from '../Model/UserModel';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

interface Recipe {
    _id: string;
    name: string;
    description: string;
    image: string;
    userId: User;
}

const AllRecipesPage: FC<{ navigation: any }> = ({ navigation }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get('http://192.168.1.135:3000/recipe/recipes');
            // console.log('Fetched recipes:', response.data);
            setRecipes(response.data);
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

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        const userId = await SecureStore.getItemAsync('userId');
        if (!userId) {
            console.error('User ID not found');
            return;
        }
        try {
            const response = await axios.get(`http://192.168.1.135:3000/auth/user/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const profilePictureUrl = user?.profilePicture 
        ? { uri: `http://192.168.1.135:3000/${user.profilePicture.replace(/\\/g, '/')}` }
        : require('../assets/avatar.jpeg');

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
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
                                <Image style={styles.profilePicture} source={profilePictureUrl} />
                                <Text style={styles.fullName}>{user?.fullName}</Text>
                            </View>
                            <Text style={styles.recipeName}>{item.name}</Text>
                            <Text style={styles.recipeDescription}>{item.description}</Text>
                            {item.image && (
                                <Image 
                                    source={{ uri: `http://192.168.1.135:3000/${item.image.replace(/\\/g, '/')}` }} 
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
        marginRight: 10,
    },
    recipeDetails: {
        flex: 1,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginBottom: 20,
    },
    fullName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    recipeName: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    recipeDescription: {
        fontSize: 20,
    },
});

export default AllRecipesPage;
