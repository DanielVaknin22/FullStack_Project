import { StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, StatusBar } from 'react-native';
import React, { useState, FC, useEffect } from 'react';
import UserModel from '../Model/UserModel';


const StudentDetailsPage: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const student = UserModel.getStudent(route.params.id);
    useEffect(() => {
        navigation.setOptions({
            title: student?.fullname,
            headerRight: () => (
                <Button
                    onPress={() => navigation.navigate('StudentAddPage')}
                    title="Edit"
                />
            ),
        })
    }, [])



    return (
        <View style={styles.container}>
            <Image style={styles.avatar} source={require('../assets/avatar.jpeg')} />
            <Text style={styles.input}>{student?.fullname}</Text>
            <Text style={styles.input}>{student?.id}</Text>
            <Text style={styles.input}>{student?.imgUrl}</Text>
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

export default StudentDetailsPage;