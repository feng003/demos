/**
 * Created by zhang on 2017/2/4.
 */

import React,{Component,PropTypes} from 'react';

function Content(props){
    return <p>Content 组件的props.value:{props.value}</p>
}

Content.propTypes = {
    value:PropTypes.number.isRequired
};

export default class Counter extends Component{
    constructor(){
        super();
        this.state = {value:1};
    }

    render(){
        return (
            <div>
                <button onClick={()=>this.setState({value:this.state.value+1})}>
                    increment
                </button>
                Counter组件的内部状态
                <pre>{JSON.stringify(this.state,null,2)}</pre>
                <Content value={this.state.value} />
            </div>
        );
    }
}
