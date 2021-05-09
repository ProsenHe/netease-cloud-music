window.addEventListener('load', function () {
    let loginBox = $get('#loginBox');//登录信息填写框
    let loginBg = $get('#loginBg');//填写时背景
    let phoneInp=$get('#phoneInp');
    let passwordInp = $get('#passwordInp');
    let message = $get('#message');//提示信息
    let loginBtn = $get('#loginBtn');//填写表单部分登录按钮
    let preLoginBtnBox = $get('#preLoginBtnBox');//header部分登录按钮
    let logined = $get('#logined');//登录成功时大盒子
    let loginedImg = $get('#loginedImg');//登录成功时图片
    let loginstantus = false;//登录状态
    let uid = 0;//用户id
    
    loginBtn.onclick=function(){
        let phone=phoneInp.value;
        let password=passwordInp.value;
        ajax({
            type: 'post',
            url: '/login/cellphone',
            data: {
                phone: phone,
                password: password,
            },
            success: function (result) {
                if (!result.account) {
                    loginstantus = false;
                    message.style.display = 'block';
                    message.children[0].className = 'message wrong';
                    message.children[0].innerHTML = '密码错误或用户名不存在';
                    return;
                }
                loginstantus = true;
                uid = result.account.id;
                console.log('logined');
                loginSuccess(result);// 登录成功后index部分
            }
        })
    };

    // 登录成功后index部分
    function loginSuccess(result) {
        if (loginSuccess) {
            loginBox.style.display = 'none';
            loginBg.style.display = 'none';
            preLoginBtnBox.style.display = 'none';
            logined.style.display = 'inline-block';
            loginedImg.src = result.profile.avatarUrl;//改变图片
        }
    }
    
    //退出登录
    let loginOutBtn = $get('#loginOutBtn');
    loginOutBtn.addEventListener('click', function (uid) {
        ajax({
            url:'/logout',
            success:function(result){
                console.log('loginOut');
                preLoginBtnBox.style.display = 'block';
                logined.style.display = 'none';
                return uid = 0;//退出登陆后清除用户id
            }
        })
    })










})  
