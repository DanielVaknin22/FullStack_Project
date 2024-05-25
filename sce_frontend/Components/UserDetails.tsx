import React, { useEffect, useState, FC } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import axios from 'axios';
import { User } from '../Model/UserModel';

const UserDetailPage: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { userId } = route.params;
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            console.log('userId:', userId);
            try {
                const response = await axios.get(`http://10.0.2.2:3000/auth/user/${userId}`);
                setUser(response.data);
                console.log('profile picture:', response.data.profilePicture);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const profilePictureUrl = user.profilePicture 
        ? `http://192.168.1.135:3000/${user.profilePicture.replace(/\\/g, '/')}` 
        : require('../assets/avatar.jpeg');
        console.log(profilePictureUrl);
        

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
