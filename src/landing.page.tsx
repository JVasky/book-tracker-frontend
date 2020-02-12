import React from 'react'
import auth from './auth'
import {Props} from './App'
import {login} from './services/authentication.service'

export class LandingPage extends React.Component<Props> {
    constructor(props:Props){
        super(props);
        this.state = {
            username: null,
            password: null
        };
    }

    render () {
        return (
            <div>
                <h1>Landing Page</h1>
                <form>
                    <label>Username:
                        <input type="text" name="name"/>
                    </label>
                    <label>Password:
                        <input type="password" name="password" />
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