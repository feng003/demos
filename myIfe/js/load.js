/**
 * Created by zhang on 2016/3/6.
 */

function loadScript(url,callback)
{
    var script = document.createElement('script');
    script.type = "text/javascript";
    if(script.readyState)
    {
        script.onreadystatechange = function()
        {
            if(script.readyState == 'loaded' || script.readyState == 'complete')
            {
                script.onreadystatechange = null;
                callback();
            }
        };
    }else{
        script.onload = function()
        {
            callback();
        }
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}
//通过 loadScript()函数加载多个 JavaScript 脚本
loadScript("script1.js", function(){
    loadScript("script2.js", function(){
        loadScript("script3.js", function(){
            alert("All files are loaded!");
        });
    });
});
