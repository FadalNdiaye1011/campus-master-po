import {User} from "./type";

export const MOCK_USERS: User[] = [
    {
        id: '1',
        email: 'admin@school.com',
        name: 'Admin Principal',
        role: 'admin'
    },
    {
        id: '2',
        email: 'admin2@school.com',
        name: 'Admin Secondaire',
        role: 'admin'
    },
    {
        id: '3',
        email: 'student@school.com',
        name: 'Jean Dupont',
        role: 'student'
    },
    {
        id: '4',
        email: 'student2@school.com',
        name: 'Marie Martin',
        role: 'student'
    },
    {
        id: '4',
        email: 'teacher@school.com',
        name: 'teacher Principal',
        role: 'professor'
    },
];


export const MOCK_PASSWORD = 'password123';