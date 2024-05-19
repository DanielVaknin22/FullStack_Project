import { StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, StatusBar } from 'react-native';
import React, { useState, FC } from 'react';
import UserModel, { User } from '../Model/UserModel';


const StudentAddPage: FC<{ navigation: any }> = ({ navigation }) => {
    const [name, onChangeName] = React.useState('');
    const [id, onChangeId] = React.useState('');
    const [address, onChangeAddress] = React.useState('');

    const onCancel = () => {
        console.log('Cancel');
        navigation.navigate('StudentListPage');
    }
    const onSave = () => {
        console.log('Save');
        const student: User = {
            name: name,
            id: id,
            imgUrl: address
        }
        UserModel.addStudent(student);
        navigation.navigate('StudentListPage');
    }
    return (
        <View style={styles.container}>
            <Image style={styles.avatar} source={require('../assets/avatar.jpeg')} />
            <TextInput
                style={styles.input}
                onChangeText={onChangeName}
                value={name}
                placeholder="Enter your name"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeId}
                value={id}
                placeholder="Enter your id"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeAddress}
                value={address}
                placeholder="Enter your address"
            />
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={onCancel}>
                    <Text style={styles.buttonText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onSave}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1,
        flexDirection: 'column',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        backgroundColor: 'blue',
    },
    avatar: {
        alignSelf: 'center',
        height: 200,
        width: 200,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    buttons: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        margin: 10,
        alignItems: 'center',
    },
    buttonText: {
        padding: 10
    }

});


export default StudentAddPage;