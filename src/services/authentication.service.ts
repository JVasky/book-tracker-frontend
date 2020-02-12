import axios from 'axios'
let jwt = require('jwt-decode')

class AuthenticationService {
    
    constructor() {}

    async login(username :string, password :string) {
        const body = {
            username: username,
            password: password
        }
        const response = await axios.post(`${process.env.REACT_APP_REST_API_ENDPOINT}/login`, body);
        const user = jwt(response.data.token);
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user', JSON.stringify(user));
        console.log(localStorage.getItem('auth_token'))
        return jwt;
    };

    getUser() {
        return localStorage.getItem('user');
    }

    getToken() {
        return localStorage.getItem('auth_token');
    }

    isValid() {
        let user = localStorage.getItem('user');
        if(user) {
            let u = JSON.parse(user);
            console.log(u.exp)
            console.log((new Date).getTime()/1000)
            return u.exp > ((new Date).getTime()/1000);
        } else {
            return false;
        }
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

}

export default AuthenticationService;