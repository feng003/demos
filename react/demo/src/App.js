import React,{ Component }  from 'react';

const suffix = "被调用，this指向：";

export default class App extends Component
{
    constructor(props){
        super(props);
        this.handler = this.handler.bind(this)
    }

    componentDidMount(){
        console.log(`componentDidMount${suffix}`,this);
    }

    componentWillReceiveProps(){
        console.log(`componentWillReceiveProps${suffix}`,this);
    }

    shouldComponentUpdate(){
        console.log(`shouldComponentUpdate${suffix}`,this);
        return true;
    }

    componentDidUpdate(){
        console.log(`componentDidUpdate${suffix}`,this);
    }

    componentWillMount(){
        console.log(`componentWillMount${suffix}`,this);
    }

    handler(){
        console.log(`handler${suffix}`,this);
    }

    render(){
        console.log(`render${suffix}`,this);
        this.handler();
        window.handler = this.handler;
        window.handler();
        return (
            <div>
                <h1 onClick={this.handler}>hello world</h1>
                <p>
                    this
                </p>
            </div>
        )
    }
}