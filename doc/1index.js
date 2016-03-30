/**
 * Created by zhang on 2016/1/7.
 */

var count = 0;
var style = {
    color:"red",
    border:"1px #000 solid",
};
var HelloWorld = React.createClass({
    getDefaultProps:function()
    {
        console.log('getDefaultProps,1');
        return {name:"Name"};
    },
    getInitialState:function()
    {
        console.log('getInitialState,2');
        return {myCount: count++,ready:false};
//            return null;
    },
    componentWillMount:function()
    {
        console.log('componentWillMount,3');
        this.setState({ready:true});
    },
    render:function()
    {
        return <p ref='childp'>Hello,{(function(obj){
        //console.log(obj);
        if(obj.props.name)
            return obj.props.name
        else
            return "World"
    })(this)} <br/> {"" + this.state.ready} {this.state.myCount} </p>
    },
    componentDidMount:function(){
        console.log('componentDidMount,5');
        var exam = document.getElementById('example');
        //console.log(React.findDOMNode(this));
//            console.log(exam.childNodes[0]);
//            exam.removeChild(exam.childNodes[0]);
    },
});
React.render(<div style={style}> <HelloWorld></HelloWorld><HelloWorld></HelloWorld></div>,document.getElementById('example'));
