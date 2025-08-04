import axios from 'axios';

export const bookbaseurl = axios.create({
    baseURL: "http://localhost:3000/book"
})