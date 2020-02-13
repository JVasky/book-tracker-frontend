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
        console.log(response);
    };

    async getAll() {
        const response = await axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT}/users`, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        console.log(response);
    }

}

export default UserService;