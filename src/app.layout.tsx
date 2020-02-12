import React from 'react';
import auth from './auth'
import {Props} from './App'

export class AppLayout extends React.Component<Props> {
    render() {
        return (
            <div>
                <h1>App layout</h1>
                <button onClick={
                    () => {
                        auth.logout(() => {
                            this.props.history.push("/");
                        })
                    }
                }>Logout</button>
            </div>
        );
    }
}