import React from 'react';
import {Route, Redirect} from 'react-router-dom'
import auth from './auth'
import AuthenticationService from './services/authentication.service'
import { ReactComponent } from '*.svg';

export const ProtectedRoute = ({component: Component, ...rest}:any) => {
    const auth = new AuthenticationService()
    return (
        <Route {...rest} render = {
            props => {
                if(auth.isValid()) {
                    return <Component {...props}/>
                } else {
                    return <Redirect to={
                        {
                            pathname: '/',
                            state: {
                                from: props.location
                            }
                        }
                    } />
                }
            }
        }/>
    )
}