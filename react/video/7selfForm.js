/**
 * Created by zhang on 2016/1/17.
 */

//自定义表单组件


var Radio = React.createClass({
    getInitialState:function()
    {
        return{
            value:this.props.defaultValue
        };
    },
    handleChange:function(e)
    {
        if(this.props.onChange)
        {
            this.props.onChange(e);
        }
        this.setState({
            value: e.target.value
        });
    },
    render:function()
    {
        var children = {};
        var value = this.props.value || this.state.value;
        React.Children.forEach(this.props.children,function(child,i){
            var label =  <label>
                            <input type="radio" name={this.props.name} value={child.props.value} checked={child.props.value == value} onChange={this.handleChange} />
                            {child.props.children}
                            <br/>
                        </label>;
            children['label' + i] = label;
        }.bind(this));

        return <span>{children}</span>;
        //return this.transferPropsTo(<span>{children}</span>);
    }
});

//不可控
var NcSelfForm = React.createClass({
    submitHandle:function(e)
    {
        e.preventDefault();
        alert(this.refs.radio.state.value);
    },
    render:function()
    {
        return (
            <form onSubmit={this.submitHandle}>
                <Radio ref="radio" name="my_radio" defaultValue="C">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </Radio>
                <button type="submit">speck</button>
            </form>
        )
    }
});
React.render(<NcSelfForm></NcSelfForm>,document.getElementById('ncSelfForm'));


//可控
var SelfForm = React.createClass({
    getInitialState:function()
    {
        return {my_radio:"A"};
    },
    handleChange:function(e)
    {
        this.setState({
            my_radio: e.target.value
        });
    },
    submitHandle:function(e)
    {
        e.preventDefault();
        alert(this.state.my_radio);
    },
    render:function()
    {
        return (
            <form onSubmit={this.submitHandle}>
                <Radio name="my_radio" value={this.state.my_radio} onChange={this.handleChange}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                </Radio>
                <button type="submit">speck</button>
            </form>
        )
    }
});

React.render(<SelfForm></SelfForm>,document.getElementById('selfForm'));