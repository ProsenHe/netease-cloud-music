//自定义的js函数

//获取元素
function $get(obj) {
    return document.querySelector(obj);
}
function $getAll(obj) {
    return document.querySelectorAll(obj);
}

//创建元素
function $create(string) {
    return document.createElement(string);
}
// 添加0
function addZero(time) {
    return time < 10 ? '0' + time : time;
}
//秒数标准化
function timefy(time){
    let minute=parseInt(time/60);
    if(minute<10){
        minute='0'+minute;
    }
    let second = time % 60;
    addZero(second);
    if(second<10){
        second='0'+second;
    }
    return minute+':'+second;
};
function dateFy(time) {
    let date = new Date(time);
    let result='';
    let month = addZero(date.getMonth() + 1);
    let dateTime = addZero(date.getDate());
    result = date.getFullYear() + '-' +month  + '-' + dateTime;
    return result;
}
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

//查看url中uid
function uidCheck() {
    let url = new URL(window.location.href);
    return url.search.split('=')[1];
}
//更改url中uid
function uidChange(uid) {
    let url = new URL(window.location.href);
    if (url.search.length == 0) {
        url.searchParams.append('uid', uid);
        location.href = url.href;
    }
}