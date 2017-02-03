/**
 * Created by zhang on 2016/1/13.
 */

/*
bubbles
cancelable
DOMEventTarget currentTarget
defaultPrevented
number eventPhase
isTrusted
nativeEvent
void preventDefault()
void stopProagation()
target
timeStamp
type
 */
var HelloWorld = React.createClass({
    getInitialState:function()
    {
        return {backgroundColor:"#FFFFFF"}
    },
    handleWheel:function(e)
    {
        var newColor = (parseInt(this.state.backgroundColor.substr(1),16) + e.deltaY*997).toString(16);
        newColor = "#" + newColor.substr(newColor.length - 6).toUpperCase();
        this.setState({
            backgroundColor:newColor
        })
    },
    render:function()
    {
        console.log(this.state);
        return (<div onWheel={this.handleWheel} style={this.state}> <p>Hello world</p> </div>);
    },
});
React.render(<HelloWorld></HelloWorld>,document.getElementById('example'));


