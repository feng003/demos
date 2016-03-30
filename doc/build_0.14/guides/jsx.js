/**
 * Created by zhang on 2016/1/6.
 */

var myDivElement= <div className="foo" />;

var MyComponent = React.createClass({
    render:function()
    {
        return (
            <p> Hello </p>
        )
    }
});
var myElement = <MyComponent someProperty={true} />;

ReactDOM.render(myElement,document.getElementById('example'));

var LikeButton = React.createClass({
    getInitialState: function() {
        return {liked: false};
    },
    handleClick: function(event) {
        this.setState({liked: !this.state.liked});
    },
    render: function() {
        var text = this.state.liked ? 'like' : 'haven\'t liked';
        return (
            <p onClick={this.handleClick}>
        You {text} this. Click to toggle.
        </p>
        );
    }
});

ReactDOM.render(
<LikeButton />,
    document.getElementById('jsx')
);


var Avatar = React.createClass({
    render: function() {
        return (
            <div>
            <ProfilePic username={this.props.username} />
        <ProfileLink username={this.props.username} />
        </div>
        );
    }
});

var ProfilePic = React.createClass({
    getInitialState:function()
    {
        return {username:''};
    },
    render: function() {
        return (
            <img src={'https://graph.facebook.com/' + this.props.username + '/picture'} />
        );
    }
});

var ProfileLink = React.createClass({
    getInitialState:function()
    {
        return {username:''};
    },
    render: function() {
        return (
            <a href={'https://www.facebook.com/' + this.props.username}>
            {this.props.username}
        </a>
        );
    }
});

ReactDOM.render(
<Avatar username="pwh" />,
    document.getElementById('example')
);