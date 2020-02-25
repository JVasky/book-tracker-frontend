import axios from 'axios'
import AuthenticationService from '../services/authentication.service'
import User from '../models/user'

class UserService {
    
    auth:AuthenticationService;

    constructor() {
        this.auth = new AuthenticationService();
    }

    async get(userid:Number) {
        const response = await axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT}/users/${userid}`, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        return JSON.parse(response.data.data);
    };

    async getAll() {
        const response = await axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT}/users`, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        return JSON.parse(response.data.data);
    }

    async activate(userid:Number) {
        const response = await axios.put(`${process.env.REACT_APP_REST_API_ENDPOINT}/users/activate/${userid}`, {}, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        return true;
    }

    async deactivate(userid:Number) {
        const response = await axios.put(`${process.env.REACT_APP_REST_API_ENDPOINT}/users/deactivate/${userid}`, {}, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        return true;
    }
}

export default UserService;