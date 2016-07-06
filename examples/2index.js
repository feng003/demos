/**
 * Created by zhang on 2016/1/7.
 */
var HelloWorld =React.createClass({
    componentWillReceiveProps: function(nextProps) {
        console.log("componentWillReceiveProps 1");
        console.log(nextProps);
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        console.log("shouldComponentUpdate 2");
        return true;
    },
    componentWillUpdate: function(nextProps, nextState) {
        console.log("componentWillUpdate 3");
    },
    render: function() {
        console.log("render 4");
        return (
            <p> Hello {this.props.name?this.props.name:"world"}</p>
        );
    },
    componentDidUpdate: function() {
        console.log("componentDidUpdate 5");
    },
});

var TestRun = React.createClass({
    getInitialState: function() {
        return {
            name:""
        };
    },
    handleChange:function(event){
        this.setState({name:event.target.value});
    },
    render:function()
    {
        return (<div>
            <HelloWorld name={this.state.name}></HelloWorld>
    <input type="text" onChange={this.handleChange} />
        <br />
    </div>
        )
    }
});
React.render( <div> <TestRun></TestRun> </div> ,document.getElementById('running'));
