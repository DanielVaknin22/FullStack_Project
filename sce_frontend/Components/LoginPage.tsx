import React, { useState, FC } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const LoginPage: FC<{ navigation: any }> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onLogin = async () => {
        if (email.trim() === '' || password.trim() === '') {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        try {
            const response = await axios.post('http://10.0.2.2:3000/auth/login', {
                email,
                password,
            });
            const userId = response.data.userId;
            const { accessToken } = response.data;
            await SecureStore.setItemAsync('authToken', accessToken);
            navigation.navigate('MainApp', { screen: 'UserDetails', params: { userId } });
        } catch (err) {
            Alert.alert('Error', 'Invalid email or password');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
            <TouchableOpacity style={styles.button} onPress={onLogin}>
                <Text style={styles.buttonText}>LOGIN</Text>
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
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    button: {
        height: 50,
        backgroundColor: '#007BFF',
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
        color: '#007BFF',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default LoginPage;
