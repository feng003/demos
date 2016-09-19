/**
 * Created by zhang on 2016/1/6.
 */

var HelloWorld = React.createClass({
    render:function()
    {
        console.log(this.props.date);
        return (
            <p>
            Hello  <input type="text" placeholder='Your name' />
        It is {this.props.date.toLocaleDateString()}
        </p>
        );
    }
});
setInterval(function(){
    ReactDOM.render(
    <HelloWorld date={new Date(2018,12,20)} />,document.getElementById('example')
    );
},2000)
