/**
 * Created by zhang on 2016/3/21.
 */

//var React = require('react');
//var ReactDOM = require('react-dom');

var Todo = React.createClass({

    render:function(){
        return <li></li>
    }
});

var TodoList = React.createClass({

    render: function() {
        var createItem = this.props.items.map(function(item) {
            return <Todo> {item} </Todo>;
        });
        return <ul>{createItem}</ul>;
    }
});
var TodoApp = React.createClass({
    getInitialState: function() {
        return {items: [], text: ''};
    },
    onChange: function(e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
        var nextText = '';
        this.setState({items: nextItems, text: nextText});
    },
    render: function() {
        return (
            <div>
                <h3>TODO</h3>
                <TodoList items={this.state.items} />
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.onChange} value={this.state.text} />
                    <button>{'Add #' + (this.state.items.length + 1)}</button>
                </form>
            </div>
        );
    }
});

ReactDOM.render(<TodoApp />, document.getElementById('todo'));
