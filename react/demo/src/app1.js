/**
 * Created by zhang on 2017/2/6.
 */

import {createStore} from 'redux';

//Reducer
function counter(state = 1,action){
    switch(action.type){
        case 'INCREMENT':
            return state+1;
        case 'DECREMENT':
            return state-1;
        default:
            return state;
    }
}

const store = createStore(counter,20);

let currentValue = store.getState();

const listener = () => {
    const previousValue = currentValue;
    currentValue = store.getState();
    console.log('pre state: ',previousValue,'next state: ',currentValue);
};

store.subscribe(listener);

// action
store.dispatch({type:'INCREMENT'});
store.dispatch({type:'INCREMENT'});
store.dispatch({type:'INCREMENT'});
store.dispatch({type:'INCREMENT'});
store.dispatch({type:'DECREMENT'});
