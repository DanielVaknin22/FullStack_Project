import UserApi from "../api/UserApi";
import FormData from "form-data";


export type User = {
    fullname: string,
    id: string,
    imgUrl: string,
    email: string,
    password: string,
}

const data: User[] = [
];

const getAllStudents = (): User[] => {
    return data;
}

const getStudent = (id: string): User | undefined => {
    return data.find((student) => student.id == id);
}

const addStudent = (student: User) => {
    data.push(student);
}

const deleteStudent = (id: string) => {
    const index = data.findIndex((student) => student.id === id);
    if (index !== -1) {
        data.splice(index, 1);
    }
}
const uploadProfilePicture = async (imageURI: string) => {
    var body = new FormData();
    body.append('file', { name: "name", type: 'image/jpeg', uri: imageURI });
    try {
        const res = await UserApi.uploadProfilePicture(body)
        if (!res.ok) {
            console.log("save failed " + res.problem)
        } else {
            if (res.data) {
                const d: any = res.data
                console.log("save passed" + d.url)
                return d.url
            }
        }
    } catch (err) {
        console.log("save failed " + err)
    }
}

export default { getAllStudents, getStudent, addStudent, deleteStudent, uploadProfilePicture };