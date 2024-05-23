import clientApi from './ClientApi';


const register = async (user: any) => {
    return clientApi.post('/auth/register', {user});
};

const login = async (user: any) => {
    return clientApi.post('/auth/login', user);
};
const uploadProfilePicture = async (image: any) => {
    return clientApi.post('/fileManager/file', image);
};

const getAllStudents = async () => {
    return clientApi.get('/student');
};

const addStudent = async (student: any) => {
    return clientApi.post('/student', student);
};



export default {
    getAllStudents,
    addStudent,
    uploadProfilePicture,
    register,
    login
};