window.addEventListener('load', function () {
    let floorUnLogin = $get('#floorUnLogin');
    let floorLogin = $get('#floorLogin');
    //1.获取网页传来的uid参数
    let uid = uidCheck(location.href);
    //未登录
    if (uid == undefined) {
        floorUnLogin.style.display = 'block';
        floorLogin.style.display = 'none';
    // 已登录
    } else {
        floorUnLogin.style.display = 'none';
        floorLogin.style.display = 'block';
        // 获取用户信息并显示
        let userImg = $get('#userImg');
        let username = $get('#username');
        let level = $get('#level');
        let event = $get('#event');
        let follow = $get('#follow');
        let followed = $get('#followed');
        getUserInfo(uid).then(function (data) {
            userImg.src = data.profile.avatarUrl;
            username.innerHTML = data.profile.nickname;
            level.innerHTML = data.level;
        })
        getEventsNum(uid).then(function (data) {
            event.innerHTML = data.events.length;
        })
        getFollowsNum(uid).then(function (data) {
            follow.innerHTML = data.follow.length;
        })
        getFollowedsNum(uid).then(function (data) {
            followed.innerHTML = data.followeds.length;
            
        })
    }
    //轮播图功能start
    //css修改ul的宽度，js修改focusLisNum
    //调用函数(pointnav)指向指定的小点
    function pointnav(obj,n) {
        for (var i = 0; i < obj.children.length; i++){
            obj.children[i].className = '';
        }
        obj.children[n].className = 'current';
    }
    var focus = $get('.focus');
    var ul = focus.querySelector('ul');
    let focusLisNum = 10;//图片的个数
    let focusArrowLeft = $get('#focusArrowLeft');
    let focusArrowRight = $get('#focusArrowRight');
    var nav=focus.querySelector('.promo_nav');
    var focusW = focus.offsetWidth;
    var count = 0;//箭头索引
    var circle = 0;//箭头中导航栏索引(只需在next)
    //下方导航栏start
    for (var i = 0; i < focus.children[0].children.length; i++){
        var li = document.createElement('li');//创建li
        li.setAttribute('index', i);//每一个li添加属性
        nav.appendChild(li);//添加到nav结尾
        nav.children[0].className = 'current';//nav第一个样式修改为当前
        li.addEventListener('click', function () {//每一个li添加事件
            var index = this.getAttribute('index');//获取索引号
            count = index; circle = index;//箭头与导航栏联动;箭头中索引与导航栏联动
            pointnav(nav,index);
            animate(ul, -index * focusW);
        })
    }
    //下方导航栏end
    //克隆图片到最后一个且在li生成之后
    var first = ul.children[0].cloneNode(true);
    ul.appendChild(first);
    //箭头start
    let foflag = true;
    focusArrowLeft.addEventListener('click', function () {
        if (foflag) {
            foflag = false;
            if (count <= 0) {
                ul.style.left = -focusLisNum*focusW + 'px';//跳转克隆页到再实现滚动效果（未逗留）
                count = focusLisNum;
            }
            count--;
            animate(ul, -count * focusW, function () {
                foflag = true;
            })//移动图片
            pointnav(nav,count);//指定对应导航栏点
        }
    })

    focusArrowRight.addEventListener('click', function () {
        if (foflag) {
            foflag = false;
            if (count == focusLisNum) {//若上一个克隆页，则直接跳到第一个并实现滚动到第二个的效果
                count = 0; 
                ul.style.left = 0 + 'px';
            }
            count++;
            if (count == focusLisNum) {//在count加之后，cicle赋值前判断是否为克隆页，若在前判断则circle又会被覆盖
                circle = 0;
            } else {
                circle = count;//加一马上滚动
            }
            animate(ul, -count * focusW, function () {
                foflag = true;
            })
            pointnav(nav,circle);//覆盖问题(再申明一个变量circle)
        }
    })
   
    //箭头end
    //自动轮播图start
    focus.timer = setInterval(function () {//设置定时器并命名
        focusArrowRight.click();
    }, 3000);
    focus.addEventListener('mouseover', function () {
        clearInterval(focus.timer);//清楚定时器
    })
    focus.addEventListener('mouseout', function () {
        focus.timer = setInterval(function () {//重启时需要重新再声明
            focusArrowRight.click();
        }, 3000);
    })
    //自动轮播图end
    //轮播图功能end

    // 滚动图功能start
    let rollBox = $get('.rollBox');
    let roll = $get('.roll');
    let rollListNum = 2;
    let rollArrowRight = $get('.rollArrowRight');
    let rollArrowLeft = $get('.rollArrowLeft');
    var rollBoxW = rollBox.offsetWidth;
    //克隆li到最后一个且在li生成之后
    var rollFirst = roll.children[0].cloneNode(true);
    roll.appendChild(rollFirst);
    //箭头start
    //箭头索引
    let rollCount = 0;
    rollArrowLeft.addEventListener('click', function () {
        //跳转克隆页到再实现滚动效果（未逗留）
        if (rollCount <= 0) {
            roll.style.left = -rollListNum*rollBoxW + 'px';
            rollCount = rollListNum;
        }
        rollCount--;
        animate(roll, -rollCount * rollBoxW)//移动图片
        
    })

    rollArrowRight.addEventListener('click', function () {
        if (rollCount == rollListNum) {//若上一个克隆页，则直接跳到第一个并实现滚动到第二个的效果
            rollCount = 0; 
            roll.style.left = 0 + 'px';
        }
        rollCount++;
        animate(roll, -rollCount * rollBoxW)
    })
    // 滚动图功能end
})

