import { FC, useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, Button } from "react-native";
import StudentListRow from "./StudentListRow";
import StudentModel, { User } from "../Model/UserModel";
import React from "react";

const StudentListPage: FC<{ navigation: any }> = ({ navigation }) => {
    const [data, setData] = useState<User[]>([])
    const onItemSelected = (id: string) => {
        console.log('Item selected: ' + id);
        navigation.navigate('StudentDetailsPage', { id: id });
    }

    useEffect(() => {
        const unsubsribe = navigation.addListener('focus', () => {
            setData([...StudentModel.getAllStudents()])
            console.log("screen in focus")
        })
        return unsubsribe
    }, [navigation])


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => navigation.navigate('StudentAddPage')}
                    title="Add"
                />
            ),
        })
    }, [])

    return (
        <FlatList
            style={styles.flatList}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <StudentListRow
                    name={item.name}
                    id={item.id}
                    imgUrl={item.imgUrl}
                    onItemSelected={onItemSelected}
                />
            )}
        />
    )
}

const styles = StyleSheet.create({
    flatList: {
        flex: 1,
    },
});

export default StudentListPage;