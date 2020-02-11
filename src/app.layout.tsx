import React from 'react';
import auth from './auth'

export const AppLayout = (props:any) => {
    return (
        <div>
            <h1>App layout</h1>
            <button onClick={
                () => {
                    auth.logout(() => {
                        props.history.push("/");
                    })
                }
            }>Logout</button>
        </div>
    );
}