/**
 * Created by zhang on 2016/1/16.
 */

//bind复用

var Register = React.createClass({

    getInitialState:function()
    {
        return {
            "username":'',
            "gender":'female',
            checked:true
        }
    },
    handleChange:function(name,e)
    {
        var newState = {};
        newState[name] = name == "checked"? e.target.checked: e.target.value;
        this.setState(newState);
    },
    submitHandle:function(e)
    {
        e.preventDefault();
        console.log(this.state);
    },
    render:function()
    {
        return  <form onSubmit={this.submitHandle}>
                    <label htmlFor="username">username</label>
                    <input type="text" id="username" value={this.state.username} onChange={this.handleChange.bind(this,"username")} />
                    <br/>
                    <select value={this.state.gender} onChange={this.handleChange.bind(this,'gender')}>
                        <option value="male">male</option>
                        <option value="female">female</option>
                    </select>
                    <br/>
                    <label htmlFor="agree">agree</label>
                    <input type="checkbox" id="agree" checked={this.state.checked} onChange={this.handleChange.bind(this,"checked")} />
                    <button type="submit">register</button>
                </form>;
    }
});
React.render(<Register></Register>,document.getElementById('register'));

//name复用

//
