import axios from 'axios'
import AuthenticationService from './authentication.service'

class AuthorService {
    
    auth:AuthenticationService;

    constructor() {
        this.auth = new AuthenticationService();
    }

    async get(authorid:Number) {
        const response = await axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT}/authors/${authorid}`, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        return JSON.parse(response.data.data);
    };

    async getAll() {
        const response = await axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT}/authors`, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        return JSON.parse(response.data.data);
    }

    async getPending() {
        const response = await axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT}/authors/pending`, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        return JSON.parse(response.data.data);
    }
}

export default AuthorService;