/**
 * Created by zhang on 2016/1/14.
 */
var CommentList = React.createClass({
    render:function()
    {
        var commentNodes = this.props.data.map(function(comment){
            return (
                <Comment author={comment.ahthor} key={comment.id}>
            {comment.text}
            </Comment>
            );
        });
        return (
            <div className='commentList'>
        {commentNodes}
        </div>
        );
    }
});
