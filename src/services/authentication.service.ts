import axios from 'axios'

export async function login(username :string, password :string) {
    const body = {
        username: username,
        password: password
    }
    const response = await axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT}/login`, body);
    console.log(response);
};