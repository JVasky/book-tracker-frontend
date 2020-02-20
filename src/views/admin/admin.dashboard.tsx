import React from 'react';
import AuthenticationService from '../../services/authentication.service'
import UserService from '../../services/user.service'
import BookService from '../../services/book.service'
import AuthorService from '../../services/author.service'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader'

interface State {
    loading:boolean,
    currentUser:any,
    users:any,
    authors:any,
    pendingBooks:any
}

const userService = new UserService();
const bookService = new BookService();
const authorService = new AuthorService();
const auth = new AuthenticationService();

export class AdminPage extends React.Component<RouteComponentProps, State> {

    constructor(props:any) {
        super(props);
        this.state = {
            loading: true,
            currentUser: {},
            users: [],
            authors: [],
            pendingBooks: []
        };
    }

    componentDidMount() {
        let user = auth.getUser();
        Promise.all([
            userService.getAll(),
            bookService.getPending(),
            authorService.getAll()
        ]).then(([users, books, authors]) => {
            console.log(user);
            this.setState({
                currentUser: user,
                users: users,
                pendingBooks: books,
                authors: authors,
                loading: false
            });
        })
    }

    render() {
        if(this.state.loading) {
            return (
                <ClipLoader css={'display:block;margin:0 auto;'} size={200} color={"#123abc"} loading={this.state.loading} />
            );
        }
        return (
            <div>
                <Row>
                    <Col>
                        <h1 className="text-center p-3">Welcome, {this.state.currentUser.firstName}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <div className="card-div">
                            <Card className="text-white bg-primary">
                                <Card.Header className='text-center font-weight-bold'>Books Awaiting Approval</Card.Header>
                                <Card.Body className='text-center bold'>{this.state.pendingBooks.length}</Card.Body>
                            </Card> 
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="card-div">
                            <Card className="text-white bg-info">
                                <Card.Header className='text-center font-weight-bold'>Number of Authors</Card.Header>
                                <Card.Body className='text-center bold'>{this.state.authors.length}</Card.Body>
                            </Card> 
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="card-div">
                            <Card className="card text-white bg-dark">
                                <Card.Header className='text-center font-weight-bold'>Total Users</Card.Header>
                                <Card.Body className='text-center bold'>{this.state.users.length}</Card.Body>
                            </Card> 
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(AdminPage);