/**
 * Created by zhang on 2016/3/20.
 */
var React = require('react');
var ReactDOM = require('react-dom');

var HelloMessage = React.createClass({

    render:function(){
        return <div>Hello {this.props.name}</div>;
    }
});
ReactDOM.render(<HelloMessage name="React" />,document.getElementById('app'));
