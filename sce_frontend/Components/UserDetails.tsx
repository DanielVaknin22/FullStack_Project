import React, { useEffect, useState, FC } from 'react';
import { StyleSheet, Text, View, Image, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { User } from '../Model/UserModel';
import * as SecureStore from 'expo-secure-store';

const UserDetailPage: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { userId } = route.params;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUserDetails = async () => {
        const userId = await SecureStore.getItemAsync('userId');
        if (!userId) {
            console.error('User ID not found');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`http://10.0.2.2:3000/auth/user/${userId}`);
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

    const handleEdit = () => {
        navigation.navigate('EditUserPage', { userId });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
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
            {profilePictureUrl ? (
                <Image style={styles.profilePicture} source={{ uri: profilePictureUrl }} />
            ) : (
                <Image style={styles.profilePicture} source={require('../assets/avatar.jpeg')} />
            )}
            <Text style={styles.text}>Email: {user.email}</Text>
            <Text style={styles.text}>Full Name: {user.fullName}</Text>
            <Text style={styles.text}>Username: {user.username}</Text>
            <Button title="Edit" onPress={handleEdit} />
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
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default UserDetailPage;