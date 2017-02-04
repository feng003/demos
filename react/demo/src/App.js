/**
 * Created by zhang on 2017/2/3.
 */
import React from 'react';

function formatName(user){
    return user.firstName + '' + user.lastName;
}

const user = {
    firstName:'H',
    lastName:'L',
    avatarUrl:"https://facebook.github.io/react/img/logo.svg"
};

export default function App(){
    return <div>
                <img src={user.avatarUrl} alt={user.firstName} />
                <h3> Hello </h3>
                <h1> {formatName(user)} </h1>
                <h2>It is {new Date().toLocaleTimeString()}.</h2>
            </div>
}
