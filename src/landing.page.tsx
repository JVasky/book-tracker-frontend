import React from 'react'
import auth from './auth'
import {login} from './services/authentication.service'

export const LandingPage = (props:any) => {
    return (
        <div>
            <h1>Landing Page</h1>
            <button onClick={
                () => {
                    auth.login(() => {
                        props.history.push("/app");
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