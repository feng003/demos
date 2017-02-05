/**
 * Created by zhang on 2017/2/3.
 */

import React from 'react';
import { render,unmountComponentAtNode } from 'react-dom';
import App from './src/App';

console.log('首次挂载');
let componentInstance = render(<App />,document.querySelector('#app'));

console.log('组件、reactElement与组件实例');
console.log(App); //组件
console.log(<App />); //reactElement
console.log(componentInstance); //组件实例

window.renderComponent = ()=>{
    console.log('挂载');
    componentInstance = render(<App />,document.querySelector('#app'));
};

window.setState = ()=>{
    console.log('更新');
    componentInstance.setState({foo:'bar'});
};

window.unmountComponentAtNode = ()=>{
    console.log('卸载');
    unmountComponentAtNode(document.querySelector('#app'));
};

