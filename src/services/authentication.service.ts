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
        user.token = response.data.token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
        return jwt;
    };

    getUser() {
        return localStorage.getItem('user');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isValid() {
        let user = localStorage.getItem('user');
        if(user) {
            let u = JSON.parse(user);
            return u.exp > ((new Date).getTime()/1000);
        } else {
            return false;
        }
    }

    isValidAdmin() {
        let user = localStorage.getItem('user');
        if(user) {
            let u = JSON.parse(user);
            let isAdmin = u.user_claims.roles.includes('admin') || u.user_claims.roles.includes('developer');
            return u.exp > ((new Date).getTime()/1000) && isAdmin;
        }
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

}

export default AuthenticationService;