import React, { useState, useEffect, FC } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { User } from '../Model/UserModel';

const EditUserPage: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { userId } = route.params;
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:3000/auth/user/${userId}`);
                const userData = response.data;
                setUser(userData);
                setEmail(userData.email);
                setFullName(userData.fullName);
                setUsername(userData.username);
                setProfilePicture(userData.profilePicture ? `http://192.168.1.135:3000/${userData.profilePicture.replace(/\\/g, '/')}` : null);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('fullName', fullName);
        formData.append('username', username);
        if (password) {
            formData.append('password', password);
        }
        if (profilePicture) {
            const filename = profilePicture.split('/').pop();
            const fileExtension = filename.split('.').pop();
            formData.append('profilePicture', {
                uri: profilePicture,
                name: filename,
                type: `image/${fileExtension}`,
            } as any);
        }

        try {
            await axios.put(`http://10.0.2.2:3000/auth/user/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error updating user details:', error);
        }
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

        if (!result.canceled) {
            setProfilePicture(result.uri);
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                {profilePicture ? (
                    <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                ) : (
                    <Image source={require('../assets/avatar.jpeg')} style={styles.profilePicture} />
                )}
            </TouchableOpacity>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Full Name" />
            <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" />
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
            <Button title="Save" onPress={handleUpdate} />
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
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
});

export default EditUserPage;
