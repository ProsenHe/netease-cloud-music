// 公共部分响应
window.addEventListener('load', function () {
    //header部分
    // 获取元素
    // 登录部分
    let loginBox = $get('#loginBox');//登录信息填写框
    let loginBg = $get('#loginBg');//填写时背景
    let phoneInp=$get('#phoneInp');//填写表单部分手机号输入框
    let passwordInp = $get('#passwordInp');//填写表单部分密码输入框
    let loginBtn = $get('#loginBtn');//填写表单部分登录按钮
    let preLoginBtnBox = $get('#preLoginBtnBox');//header部分登录按钮
    let logined = $get('#logined');//header部分登录成功时下拉框
    let loginedImg = $get('#loginedImg');//header部分登录成功时图片
    //退出登录
    let loginOutBtn = $get('#loginOutBtn');

    // 先判断有无参数：若有则显示登录，无则退出显示；调用api；即登录操作只是修改了uid参数
    // 登录状态判断
    let uid = uidCheck();
    let indexBtn = $get('#indexBtn');
    let myMusicBtn = $get('#myMusicBtn');
    let userHomeBtn = $get('#userHomeBtn');
    if (uid == undefined) {//未登录
        preLoginBtnBox.style.display = 'block';
        logined.style.display = 'none';
        // 跳转到index
        indexBtn.addEventListener('click', function () {
            location.href = 'http://localhost:3000/myindex.html';
        })
        // 跳转到myMusic
        myMusicBtn.addEventListener('click', function () {
            location.href = 'http://localhost:3000/myMusic.html';
        })
        // 跳转到userHome
        userHomeBtn.addEventListener('click', function () {
            location.href = 'http://localhost:3000/userHome.html';
        })
    } else {//已登录
        loginBox.style.display = 'none';
        loginBg.style.display = 'none';
        preLoginBtnBox.style.display = 'none';
        logined.style.display = 'inline-block';
        // 改换header部分头像
        getUserImgSrc(uid).then(function (src) {
            loginedImg.src = src;
        })
        // 跳转到index
        indexBtn.addEventListener('click', function () {
            location.href = 'http://localhost:3000/myindex.html?uid='+uid;
        })
        // 跳转到myMusic
        myMusicBtn.addEventListener('click', function () {
            location.href = 'http://localhost:3000/myMusic.html?uid='+uid;
        })
        // 跳转到userHome
        userHomeBtn.addEventListener('click', function () {
            location.href = 'http://localhost:3000/userHome.html?uid='+uid;
        })
    }
    
    // 相关事件
    // 登录修改url
    loginBtn.onclick = function (uid) {
        let phone=phoneInp.value;
        let password=passwordInp.value;
        getUid(phone, password,uid).then(function (uid) {
            uidChange(uid);
        })
    };
    // 退出登录修改url
    loginOutBtn.addEventListener('click', function () {
        ajax({
            url:'/logout',
            success:function(){
                console.log('loginOut');
                let href = location.href;
                let hrefChange = href.split('?')[0];
                location.href = hrefChange;
            }
        })
    })
    
})  
