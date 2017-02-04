/**
 * Created by zhang on 2017/2/3.
 */
import React from 'react';
import Counter from './Counter';
import Messagelist1 from './Messagelist1';
import Messagelist2 from './Messagelist2';

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
                <h3>It is {new Date().toLocaleTimeString()}.</h3>
                <h2>
                    state props
                </h2>
                <Counter />
                <h2>
                    props传递数据
                </h2>
                <Messagelist1 />
                <h2>
                    context跨级传递数据
                </h2>
                <Messagelist2 />
            </div>
}
