import React, { useEffect, useState, FC, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { User } from '../Model/UserModel';
import * as SecureStore from 'expo-secure-store';

const UserDetailPage: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { userId } = route.params;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUserDetails = async () => {
        const storedUserId = await SecureStore.getItemAsync('userId');
        if (!storedUserId) {
            console.error('User ID not found');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`http://10.0.2.2:3000/auth/user/${storedUserId}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchUserDetails();
        });

        return unsubscribe;
    }, [navigation]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleEdit = () => {
        navigation.navigate('EditUserPage', { userId });
    };

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('userId');
        navigation.replace('Login');
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#666" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>No user data found.</Text>
            </View>
        );
    }

    const profilePictureUrl = user.profilePicture 
        ? `http://10.0.2.2:3000/${user.profilePicture.replace(/\\/g, '/')}` 
        : require('../assets/avatar.jpeg');        

    return (
        <View style={styles.container}>
            <Image style={styles.profilePicture} source={profilePictureUrl ? { uri: profilePictureUrl } : require('../assets/avatar.jpeg')} />
            <Text style={styles.text}>Email: <Text style={styles.textUser}>{user.email}</Text></Text>
            <Text style={styles.text}>Full Name: <Text style={styles.textUser}>{user.fullName}</Text></Text>
            <Text style={styles.text}>Username: <Text style={styles.textUser}>{user.username}</Text></Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleEdit}>
                    <Text style={styles.buttonText}>✏️ Edit</Text>
                </TouchableOpacity>
            </View>        
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
    profilePicture: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
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
        backgroundColor: '#666666b4',
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    logoutButton: {
        width: '25%',
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#00a2ff',
        marginHorizontal: 5,
    },
    textUser: {
        fontWeight: 'normal',
    }
});

export default UserDetailPage;
