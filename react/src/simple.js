/**
 * Created by zhang on 2016/3/20.
 */
var React = require('react');
var ReactDOM = require('react-dom');

//var HelloMessage = React.createClass({
//
//    render:function(){
//        return <div>Hello {this.props.name}</div>;
//    }
//});
//ReactDOM.render(<HelloMessage name="React" />,document.getElementById('app'));

var Timer = React.createClass({
    getInitialState: function() {
        return {secondsElapsed: 0};
    },
    tick: function() {
        this.setState({secondsElapsed: this.state.secondsElapsed + 1});
    },
    componentDidMount: function() {
        this.interval = setInterval(this.tick, 1000);
    },
    componentWillUnmount: function() {
        clearInterval(this.interval);
    },
    render: function() {
        return (
            <div>Seconds Elapsed: {this.state.secondsElapsed}</div>
        );
    }
});

ReactDOM.render(<Timer />, document.getElementById('app'));


