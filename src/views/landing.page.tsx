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
import Modal from 'react-bootstrap/Modal'
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface newUser {
    username:string,
    first_name:string,
    last_name:string,
    email:string,
    password: string,
    passwordConfirmation: string
}

interface signUpErrors {
    username:string,
    first_name:string,
    last_name:string,
    email:string,
    password: string,
    passwordConfirmation: string
}


interface State {
    username: string,
    password: string,
    error: string,
    signupModal: boolean,
    newUser: newUser,
    signUpErrors: signUpErrors,
    signUpFailure: string,
    signUpSuccess: boolean
}

interface LoginProps extends RouteComponentProps {
    updateUser: () => void
}

const getBlankUser = () => {
    return {
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    };
}

const getBlankSignupErrors = () => {
    return getBlankUser();
}

class LandingPage extends React.Component<LoginProps, State> {
    
    auth:AuthenticationService

    constructor(props:LoginProps) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: '',
            signupModal: false,
            newUser: getBlankUser(),
            signUpErrors: getBlankSignupErrors(),
            signUpFailure: '',
            signUpSuccess: false
        };
        this.auth = new AuthenticationService();
        this.validateLogin = this.validateLogin.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSignupChange = this.handleSignupChange.bind(this);
        this.handleSignupClose = this.handleSignupClose.bind(this);
        this.handleSignupOpen = this.handleSignupOpen.bind(this);
        this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
        this.signupValidation = this.signupValidation.bind(this);
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

    handleSignupOpen() {
        this.setState({
            signupModal: true
        })
    }

    handleSignupClose() {
        this.setState({
            signupModal: false,
            newUser: getBlankUser(),
            signUpSuccess: false,
            signUpErrors: getBlankSignupErrors(),
            signUpFailure: ''
        })
    }

    handleSignupSubmit(event:any) {
        event.preventDefault();
        this.setState({
            signUpErrors: getBlankSignupErrors(),
            signUpFailure: ''
        })
        if(this.signupValidation()) {
            // handle signup
            this.auth.signUp(this.state.newUser).then(() => {
                this.setState({
                    newUser: getBlankUser(),
                    signUpErrors: getBlankSignupErrors(),
                    signUpSuccess: true,
                }, () => {
                    setTimeout(() => {
                        this.handleSignupClose();
                    }, 3000)
                });
            }).catch(error => {
                console.log(error.response.data)
                if(!("errors" in error.response.data)) {
                    this.setState({
                        signUpFailure: error.response.data.message
                    })
                } else {
                    let errors = getBlankSignupErrors() as {[k:string]: any};
                    for(var prop in error.response.data.errors) {
                        if(error.response.data.errors.hasOwnProperty(prop)) {
                            errors[prop] = error.response.data.errors[prop][0];
                        }
                    }
                    this.setState({
                        signUpErrors: errors as signUpErrors
                    });
                }
            });

        }
    }

    signupValidation() {
        let valid = true;
        let errors = getBlankSignupErrors();
        if(this.state.newUser.username.length < 1) {
            errors.first_name = "First name required!";
            valid = false;
        }
        if(this.state.newUser.first_name.length < 1) {
            errors.first_name = "First name required!";
            valid = false;
        }
        if(this.state.newUser.last_name.length < 1) {
            errors.last_name = "Last name required!";
            valid = false;
        }
        if(this.state.newUser.email.length < 1) {
            errors.email = "Email required!";
            valid = false;
        }
        if(this.state.newUser.password.length < 1) {
            errors.password = "Password required!";
            valid = false;
        }
        if(this.state.newUser.passwordConfirmation.length < 1) {
            errors.passwordConfirmation = "Password confirmation required!";
            valid = false;
        }
        if(this.state.newUser.password.length > 0 && this.state.newUser.passwordConfirmation.length > 0
            && this.state.newUser.password !== this.state.newUser.passwordConfirmation) {
            errors.passwordConfirmation = "Passwords must match!";
            valid = false
        }
        this.setState({
            signUpErrors: errors
        })
        return valid;
    }

    handleSignupChange(event:React.FormEvent<HTMLInputElement>, field:string) {
        let newModifyUser = this.state.newUser;
        switch(field) {
            case 'username':
                newModifyUser.username = event.currentTarget.value;
                this.setState({
                    newUser: newModifyUser
                });
                break;
            case 'first_name':
                newModifyUser.first_name = event.currentTarget.value;
                this.setState({
                    newUser: newModifyUser
                });
                break;
            case 'last_name':
                newModifyUser.last_name = event.currentTarget.value;
                this.setState({
                    newUser: newModifyUser
                });
                break;
            case 'email':
                newModifyUser.email = event.currentTarget.value;
                this.setState({
                    newUser: newModifyUser
                });
                break;
            case 'password':
                newModifyUser.password = event.currentTarget.value;
                this.setState({
                    newUser: newModifyUser
                });
                break;
            case 'password_confirmation':
                newModifyUser.passwordConfirmation = event.currentTarget.value;
                this.setState({
                    newUser: newModifyUser
                });
                break;
            default:
                break;
        }
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
                <Modal show={this.state.signupModal}>
                    <Alert variant="success" show={this.state.signUpSuccess}><h4>Success! Happy Reading :)</h4></Alert>
                    <Alert variant="danger" show={this.state.signUpFailure !== ''}><h5>Sorry! {this.state.signUpFailure}</h5></Alert>
                    <Modal.Header>
                        <h4 className="font-weight-bold col-12">Sign up!
                        <button className="close" onClick={this.handleSignupClose}>x</button>
                        </h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSignupSubmit}>
                            <Form.Group controlId="newUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control 
                                    value={this.state.newUser.username} 
                                    type="text" 
                                    onChange={(ev:React.FormEvent<HTMLInputElement>) =>{this.handleSignupChange(ev, 'username');}}
                                    isInvalid={this.state.signUpErrors.first_name !== ''} 
                                    placeholder="Username"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.signUpErrors.first_name}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="newfirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control 
                                    value={this.state.newUser.first_name} 
                                    type="text" 
                                    onChange={(ev:React.FormEvent<HTMLInputElement>) =>{this.handleSignupChange(ev, 'first_name');}}
                                    isInvalid={this.state.signUpErrors.first_name !== ''} 
                                    placeholder="First Name"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.signUpErrors.first_name}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="newLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control 
                                    value={this.state.newUser.last_name}
                                    type="text"
                                    onChange={(ev:React.FormEvent<HTMLInputElement>) =>{this.handleSignupChange(ev, 'last_name');}} 
                                    isInvalid={this.state.signUpErrors.last_name !== ''} 
                                    placeholder="Last Name"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.signUpErrors.last_name}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="newEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    value={this.state.newUser.email}
                                    type="email"
                                    onChange={(ev:React.FormEvent<HTMLInputElement>) =>{this.handleSignupChange(ev, 'email');}}
                                    isInvalid={this.state.signUpErrors.email !== ''} 
                                    placeholder="Email Address"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.signUpErrors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="modPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    value={this.state.newUser.password}
                                    type="password"
                                    onChange={(ev:React.FormEvent<HTMLInputElement>) =>{this.handleSignupChange(ev, 'password');}}
                                    isInvalid={this.state.signUpErrors.password !== ''}
                                    placeholder="Password"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.signUpErrors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="modPasswordConfirmation">
                                <Form.Label>Password Confirmation</Form.Label>
                                <Form.Control
                                    value={this.state.newUser.passwordConfirmation}
                                    type="password"
                                    onChange={(ev:React.FormEvent<HTMLInputElement>) =>{this.handleSignupChange(ev, 'password_confirmation');}}
                                    isInvalid={this.state.signUpErrors.passwordConfirmation !== ''}
                                    placeholder="Password Confirmation"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.signUpErrors.passwordConfirmation}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="success" type="submit">Submit</Button>
                        </Form>
                    </Modal.Body>
                </Modal>

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
                                <Button name="submit" type="submit">Login</Button>
                            </FormGroup>
                            <FormGroup>
                                <Button variant="outline-primary" name="signup" onClick={this.handleSignupOpen}>Sign Up!</Button>
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