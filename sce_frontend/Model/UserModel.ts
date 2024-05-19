export type User = {
    name: string,
    id: string,
    imgUrl: string
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

export default { getAllStudents, getStudent, addStudent, deleteStudent };