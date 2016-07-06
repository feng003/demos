/**
 * Created by zhang on 2016/1/18.
 */
//
var style = {
    color:"red",
    border:"1px #000 solid",
};
var rawHTML = {
    __html: "<h1>this is h1 </h1>"

};

var TsetDom = React.createClass({
    render:function()
    {
        return (<div ref="child">Hello World</div>);
    }

});

React.render( <div dangerouslySetInnerHTML={rawHTML}></div>,document.getElementById('example'));
