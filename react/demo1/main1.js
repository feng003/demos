/**
 * Created by zhang on 2017/2/3.
 */

import React from 'react';
import { render } from 'react-dom';
import App from './src/App1';

function tick(){
    render(<App />,document.querySelector('#app'));
}
tick();
setInterval(tick,1000);