import React from 'react'
import auth from './auth'
import {Props} from './App'
import {login} from './services/authentication.service'

export class LandingPage extends React.Component<Props, any> {
    constructor(props:Props){
        super(props);
        this.state = {
            username: '',
            password: '',
            error: ''
        };
        this.validateLogin = this.validateLogin.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    validateLogin() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleSubmit(event:React.FormEvent) {
        event.preventDefault();
        if(!this.validateLogin()) {
            return this.setState({error: 'Username and password are required!'})
        }

        login(this.state.username, this.state.password).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error)
        })
        this.props.history.push("/app");

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
        return (
            <div>
                <h1>Landing Page</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>Username:
                        <input type="text" name="name" value={this.state.username} onChange={this.handleUserChange} />
                    </label>
                    <label>Password:
                        <input type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <button onClick={
                    () => {
                        auth.login(() => {
                            this.props.history.push("/app");
                        })
                    }
                }>Login</button>
                <button onClick={
                    () => {
                        login('', '');
                    }
                }>Get Token</button>
            </div>
        );
    }
}