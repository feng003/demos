/**
 * Created by zhang on 2016/1/14.
 */

var Comment = React.createClass({
    rawMarkup:function()
    {
        var rawMarkup = marked(this.props.children.toString(),{sanitize:true});
        return {__html:rawMarkup};
    },
    render:function()
    {
        return (
            <div className='comment'>
        <h2 className='commentAuthor'>
        {this.props.author}
        </h2>
    <span dangerouslySetInnerHTML={this.rawMarkup()} />
        </div>
        )
    }
});
