/**
 * Created by zhang on 2016/1/6.
 */

var HelloWorld = React.createClass({
    render:function()
    {
        return (
            <p>
            Hello <input type="text" placeholder='Your name' />
        It is {this.props.date.toTimeString()}
        </p>
        );
    }
});
setInterval(function(){
    ReactDOM.render(
    <HelloWorld date={new Date()} />,document.getElementById('example')
    );
},5000)
