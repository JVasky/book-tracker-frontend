import axios from 'axios'
import User from '../models/user'
let jwt = require('jwt-decode')

class AuthenticationService {
    
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
        let user = localStorage.getItem('user');
        if (user) {
            const userJson = JSON.parse(user);
            return new User(
                userJson.identity,
                userJson.user_claims.email,
                userJson.user_claims.firstName,
                userJson.user_claims.lastName,
                userJson.user_claims.roles,
            );

        } else {
            return {};
        }
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isValid() {
        let user = localStorage.getItem('user');
        if(user) {
            let u = JSON.parse(user);
            return u.exp > ((new Date()).getTime()/1000);
        } else {
            return false;
        }
    }

    isValidAdmin() {
        let user = localStorage.getItem('user');
        if(user) {
            let u = JSON.parse(user);
            let isAdmin = u.user_claims.roles.includes('admin') || u.user_claims.roles.includes('developer');
            return u.exp > ((new Date()).getTime()/1000) && isAdmin;
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