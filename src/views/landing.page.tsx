import React from 'react'
import AuthenticationService from '../services/authentication.service'
import Jumbotron from 'react-bootstrap/Jumbotron';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel'
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row'
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface State {
    username: string,
    password: string,
    error: string
}

interface LoginProps extends RouteComponentProps {
    updateUser: () => void
}

class LandingPage extends React.Component<LoginProps, State> {
    
    auth:AuthenticationService

    constructor(props:LoginProps) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: ''
        };
        this.auth = new AuthenticationService();
        this.validateLogin = this.validateLogin.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.props.updateUser();
    }
    
    validateLogin() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleSubmit(event:React.FormEvent) {
        event.preventDefault();
        if(!this.validateLogin()) {
            return this.setState({error: 'Username and password are required!'})
        }

        this.auth.login(this.state.username, this.state.password).then(() => {
            this.props.updateUser();
            if(this.auth.isValidAdmin()) {
                this.props.history.push("/admin");
            } else {
                this.props.history.push("/app");
            }
        }).catch(error => {
            this.setState({
                error: 'Invalid username or password!'
            });
        })

    }

    handleUserChange(event:React.FormEvent<HTMLInputElement>) {
        this.setState({
            username: event.currentTarget.value
        })
    }

    handlePasswordChange(event:React.FormEvent<HTMLInputElement>) {
        this.setState({
            password: event.currentTarget.value
        })
    }

    render () {
        const loginErrors = this.state.error !== '';
        if(this.auth.isValidAdmin()) {
            this.props.history.push('/app');
        }
        if(this.auth.isValid()) {
            this.props.history.push('/admin');
        }
        return (
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <Jumbotron>
                        <h1>Login</h1>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <FormLabel>Username</FormLabel>
                                    <FormControl type="text" name="name" value={this.state.username} onChange={this.handleUserChange} />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Password</FormLabel>
                                    <FormControl type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
                            </FormGroup>
                            <FormGroup>
                                <Button name="submit" type="submit">Submit</Button>
                            </FormGroup>
                            <FormGroup>
                                <Button variant="outline-primary" name="signup">Sign Up!</Button>
                            </FormGroup>
                        </Form>
                        {loginErrors && (
                            <Container><br />
                                <Alert 
                                    variant="danger" 
                                    onClose={()=>{ this.setState({error: ''})}} 
                                    dismissible
                                >
                                    {this.state.error}
                                </Alert>
                            </Container>
                        )}
                    </Jumbotron>
                </Col>
                <Col></Col>
            </Row>
        );
    }
}

export default withRouter(LandingPage);