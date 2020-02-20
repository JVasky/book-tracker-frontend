import axios from 'axios'
import AuthenticationService from '../services/authentication.service'

class BookService {
    
    auth:AuthenticationService;

    constructor() {
        this.auth = new AuthenticationService();
    }

    async get(bookid:Number) {
        const response = await axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT}/books/${bookid}`, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        return JSON.parse(response.data.data);
    };

    async getAll() {
        const response = await axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT}/books`, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        return JSON.parse(response.data.data);
    }

    async getPending() {
        const response = await axios.get(`${process.env.REACT_APP_REST_API_ENDPOINT}/books/pending`, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        return JSON.parse(response.data.data);
    }

    async approve(id:Number) {
        await axios.put(`${process.env.REACT_APP_REST_API_ENDPOINT}/books/approve/${id}`, null, {
            headers: {
                Authorization: this.auth.getToken()
            }
        });
        return true;
    }
}

export default BookService;