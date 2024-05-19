import { StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, StatusBar, TouchableHighlight } from 'react-native';
import React, { useState, FC } from 'react';



const StudentListRow: FC<{
    name: string,
    id: string,
    imgUrl: string,
    onItemSelected: (id: string) => void
}> = ({ name, id, imgUrl, onItemSelected }) => {
    const onPress = () => {
        onItemSelected(id);
    }
    return (
        <TouchableHighlight
            onPress={onPress}
            underlayColor={'grey'}>
            <View style={styles.listrow}>
                <Image style={styles.avatar} source={require('../assets/avatar.jpeg')} />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.id}>{id}</Text>
                </View>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    listrow: {
        marginHorizontal: 5,
        marginVertical: 1,
        flexDirection: 'row',
        elevation: 1,
        borderRadius: 2
    },
    avatar: {
        margin: 10,
        height: 100,
        width: 100
    },
    info: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    name: {
        marginBottom: 5,
        fontSize: 25,
        fontWeight: 'bold'
    },
    id: {
        marginBottom: 5,
        fontSize: 20
    }
});

export default StudentListRow;