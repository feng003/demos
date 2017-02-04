/**
 * Created by zhang on 2017/2/3.
 */

import React from 'react';
import { render } from 'react-dom';
import App from './src/App';

function tick(){
    render(<App />,document.querySelector('#app'));
}
setInterval(tick,1000);
