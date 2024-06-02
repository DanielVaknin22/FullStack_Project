import React, { FC, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { User } from '../Model/UserModel';
import * as SecureStore from 'expo-secure-store';

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

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://192.168.1.135:3000/recipe/recipes');
                console.log('Fetched recipes:', response.data);
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, [navigation]);

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
            const response = await axios.get(`http://192.168.1.135/auth/user/${userId}`);
            setUser(response.data);
        } catch (error) {
            // console.error('Error fetching user details:', error);
        }
    };

    const profilePictureUrl = user?.profilePicture 
    ? `http://10.0.2.2:3000/${user.profilePicture.replace(/\\/g, '/')}` 
    : require('../assets/avatar.jpeg');

    return (
        <View style={styles.container}>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.recipeContainer}>
                        <View style={styles.recipeDetails}>
                            <View style={styles.userContainer}>
                            {profilePictureUrl ? (
                                <Image style={styles.profilePicture} source={{ uri: profilePictureUrl }} />
                            ) : (
                                <Image style={styles.profilePicture} source={require('../assets/avatar.jpeg')} />
                            )}
                                <Text style={styles.fullName}> {user?.fullName}</Text>
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
    userPhoto: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
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
        // color: '',
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginBottom: 20,
    },
});

export default AllRecipesPage;
