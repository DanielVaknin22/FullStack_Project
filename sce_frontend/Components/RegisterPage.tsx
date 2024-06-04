import React, { useState, FC } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const RegisterPage: FC<{ navigation: any }> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profilePictureURI, setProfilePictureURI] = useState('');
    const [loading, setLoading] = useState(false);

    const selectProfilePicture = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setProfilePictureURI(result.assets[0].uri);
            }
        } catch (error) {
            console.log('Error selecting an image:', error);
        }
    };

    const onRegister = async () => {
        if (!email.trim() || !fullName.trim() || !username.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('fullName', fullName);
        formData.append('username', username);
        formData.append('password', password);

        if (profilePictureURI) {
            const fileName = profilePictureURI.split('/').pop();
            const match = /\.(\w+)$/.exec(fileName || '');
            const type = match ? `image/${match[1]}` : 'image';
            formData.append('profilePicture', {
                uri: profilePictureURI,
                name: fileName,
                type: type,
            } as any);
        }

        setLoading(true);

        try {
            const response = await axios.post('http://10.0.2.2:3000/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            Alert.alert('Success', 'User registered successfully');
            navigation.navigate('Login');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                console.error('Error:', err.response.data);
                Alert.alert('Error', `Failed to register user: ${err.response.data}`);
            } else {
                console.error('Error:', err);
                Alert.alert('Error', 'Failed to register user');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                onChangeText={setFullName}
                value={fullName}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />
            <TouchableOpacity style={styles.imagePicker} onPress={selectProfilePicture}>
                <Text style={styles.imagePickerText}>Select Profile Picture</Text>
            </TouchableOpacity>
            {profilePictureURI ? (
                <Image source={{ uri: profilePictureURI }} style={styles.profilePicture} />
            ) : (
                <Image source={require('../assets/avatar.jpeg')} style={styles.profilePicture} />
            )}
            <TouchableOpacity style={styles.button} onPress={onRegister}>
                {loading ? (
                    <ActivityIndicator size="small" color="#666" />
                ) : (
                    <Text style={styles.buttonText}>REGISTER</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#666',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    imagePicker: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#666666b4',
        borderRadius: 5,
        marginVertical: 10,
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignSelf: 'center',
        marginVertical: 10,
    },
    button: {
        height: 50,
        backgroundColor: '#666666b4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default RegisterPage;
