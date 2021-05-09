//秒数标准化
function timefy(time){
    let minute=parseInt(time/60);
    if(minute<10){
        minute='0'+minute;
    }
    let second=time%60;
    if(second<10){
        second='0'+second;
    }
    return minute+':'+second;
};
//对错互换
function rightChange(boolean) {
    return (boolean==true)?false:true;
}

//调用函数(pointnav)指向指定的小点(排他思想)
function point(obj,n) {
    for (var i = 0; i < obj.children.length; i++){
        obj.children[i].className = '';
    }
    obj.children[n].className = 'current';
}

//动画
function animate(obj, target, callback) {
    clearInterval(obj.timer);//先清除，防止反复点导致bug
    obj.timer=setInterval(function(){//设置定时器
        var step=(target-obj.offsetLeft)/20;//设置step变量
        step=step>0?Math.ceil(step):Math.floor(step);//对step取绝对值大的
        obj.style.left=obj.offsetLeft+step+'px';//改变obj位置
        if(obj.offsetLeft==target){//判断结束条件
            clearInterval(obj.timer);
            callback && callback();
        }
    },15)
}

//返回顶部动画
function animateTop(obj, target, callback) {
    clearInterval(obj.timer);//先清除，防止反复点导致bug
    obj.timer=setInterval(function(){//设置定时器
        var step=(target-window.pageYOffset)/15;//计算step变量
        step=step>0?Math.ceil(step):Math.floor(step);//对step取绝对值大的
        window.scroll(0,window.pageYOffset + step)//改变窗口位置
        if(window.pageYOffset==target){//判断结束条件
            clearInterval(obj.timer);
            callback && callback();
        }
    },15)
}
//Ajax交互
function ajax(options) {
    //默认值
    let defaults={
        type:'get',
        url: '',
        header:{
            'Content-Type':'application/x-www-form-urlencoded',
        },
        data: {},
        success: function(){},
        error:function(){}
    };
    //将输入的options覆盖defaults
    Object.assign(defaults,options);
    //创建ajax对象
    let xhr=new XMLHttpRequest();
    //将请求数据拼接成字符串
    let params='';
    for(let attr in defaults.data){
        params+=attr+'='+options.data[attr]+'&';
    }
    params=params.substr(0,params.length-1);
    //判断请求类型设置url
    //设置时间戳(get与post)
    let timestamp = new Date().getTime();
    if (defaults.type == 'get' && params.length != 0) {//get请求且params不为空时
        defaults.url+='?'+params+'&timestamp=' + timestamp;
    } else {//post请求或params为空
        defaults.url += '?' + 'timestamp=' + timestamp;
    }
    //ajax初始化
    xhr.open(defaults.type,defaults.url);
    //判断请求类型设置send
    if(defaults.type=='post'){
        //获取设置的请求头
        let contentType=defaults.header['Content-Type'];
        //设置请求头
        xhr.setRequestHeader('Content-Type',contentType);
        //判断请求头设置send
        if(contentType=='application/json'){
            xhr.send(JSON.stringify(defaults.data));
        }else{
            xhr.send(params);
        }
    }else{//get请求
        xhr.send();
    }
    //请求结束后
    xhr.onload=function(){
        //获取响应头及响应数据
        let contentType=xhr.getResponseHeader('Content-Type');
        let response=xhr.response;
        //判断响应头是否为json字符串，是则转为json对象
        if(contentType.includes('application/json')){
            response=JSON.parse(response);//注意赋值
        }
        //判断请求是否成功调用success函数与error函数
        if(xhr.status>=200&&xhr.status<300){
            defaults.success(response,xhr);
        }else{
            defaults.error(response,xhr);
        }
    }
}