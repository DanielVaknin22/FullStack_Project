import React, { useState, FC } from 'react';
import {Image, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const LoginPage: FC<{ navigation: any }> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const onLogin = async () => {
        if (email.trim() === '' || password.trim() === '') {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://192.168.1.135:3000/auth/login', {
                email,
                password,
            });
            const { userId, accessToken } = response.data;
            await SecureStore.setItemAsync('authToken', accessToken);
            await SecureStore.setItemAsync('userId', userId);
            navigation.navigate('MainApp', { screen: 'UserDetails', params: { userId } });
        } catch (err) {
            Alert.alert('Error', 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
        <Image source={require('../assets/IconFood.png')} style={styles.icon} />            
        <Text style={styles.title}>Login To The Recipes App!</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={onLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#666" />
                ) : (
                    <Text style={styles.buttonText}>LOGIN</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Don't have an account? Register</Text>
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
    icon: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginVertical: 20,
    },
});

export default LoginPage;
