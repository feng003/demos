/**
 * Created by zhang on 2016/1/11.
 */

var Content = React.createClass({
    //实例创建的时候调用
    getInitialState:function()
    {
        return {
            inputText:"",
        };
    },
    handleChange:function(e)
    {
        this.setState({inputText: e.target.value});
    },
    //把需要计算的部分放在 真正使用的地方，不要放在初始化
    handleSubmit:function()
    {
        console.log("reply To:" +this.props.selectName + " \n "+ this.state.inputText);
    },

    // <p>{this.props.selectName}</p>
    render:function()
    {
        return <div>
                    <textarea onChange={this.handleChange} placeholder='please enter sth...'>

                    </textarea>
                    <button onClick={this.handleSubmit}>submit</button>
               </div>;
    },
});
//父组件
var Comment = React.createClass({
    getInitialState:function()
    {
        return {names:['Tim','John','Hank'],selectName:""};
    },
    handleSelect:function(event)
    {
        this.setState({selectName:event.target.value});
    },
    render:function()
    {
        var options = [];
        for(var option in this.state.names )
        {
            options.push(<option value={this.state.names[option]}> {this.state.names[option]} </option>)
        };
        /*
          属性 selectName 赋值给子组件
         */
        return <div>
                    <select onChange={this.handleSelect}>{options}</select>
                    <Content selectName={this.state.selectName}></Content>
                </div>;
    }
});
React.render(<Comment></Comment>,document.getElementById('exam'));
