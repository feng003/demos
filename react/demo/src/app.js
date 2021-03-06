/**
 * Created by zhang on 2017/2/6.
 */

import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

function increment(){
    return {type:'INCREMENT'};
}

function decrement(){
    return {type:'DECREMENT'};
}

function incrementIfOdd(){
    return (dispatch,getState) =>{
        const value = getState;
        if(value % 2 === 0){
            return;
        }

        dispatch(increment());
    };
}

function incrementAsync(delay = 1000){
    return dispatch => {
        setTimeout(()=>{
            dispatch(increment());
        },delay);
    };
}

//Reducer
function counter(state = 4,action){
    switch(action.type){
        case 'INCREMENT':
            return state+1;
        case 'DECREMENT':
            return state-1;
        default:
            return state;
    }
}

const store = createStore(counter,applyMiddleware(thunk));

let currentValue = store.getState();

const listener = () => {
    const previousValue = currentValue;
    currentValue = store.getState();
    console.log('pre state: ',previousValue,'next state: ',currentValue);
};

store.subscribe(listener);

// action
store.dispatch(increment());
store.dispatch(increment());
store.dispatch(decrement());
store.dispatch(incrementIfOdd());
store.dispatch(incrementAsync());
store.dispatch(incrementAsync());

