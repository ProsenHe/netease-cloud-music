window.addEventListener('load', function () {
    //头部start
    let tabListLis = $get('#tabList').getElementsByTagName('li');
    let tabListItems = $get('#tabListItems');
    //每个li添加事件,点击则改变样式,并显示cor
    for (let i = 0; i < tabListLis.length; i++){
        tabListLis[i].addEventListener('click', function () {
            if (i == 0) {//当点击对应li时,tabListItem隐藏
                tabListItems.style.height = '34px';
            }
            if (i == 1 || i == 5) {
                tabListItems.style.height = '2px';
            }
            for (let i = 0; i < tabListLis.length; i++){
                tabListLis[i].children[0].className = '';
                tabListLis[i].children[1].style.display = 'none';//li与tabListItem互动
            }
            this.children[0].className = 'tabCurrent';
            this.children[1].style.display = 'block';
        })
    }
    //头部end
    
    //返回顶部start
    let returnTop = $get('#returnTop');
    window.addEventListener('scroll', function () {
        if (window.pageYOffset != 0) {
            returnTop.style.display = 'block';
        } else {
            returnTop.style.display = 'none';
        }
    })
    returnTop.addEventListener('click', function () {
        animateTop(window, 0);
    })
    //返回顶部end

    //登录静态模块start
    let preLoginBtn = $get('#preLoginBtn');
    let floorLoginBtn = $get('#floorLoginBtn');//floor部分登录按钮
    let loginBox = $get('#loginBox');
    let cancel = $get('#cancel');
    let loginBg = $get('#loginBg');
    // 显示与取消
    preLoginBtn.addEventListener('click', function () {
        loginBg.style.display = 'block';
        loginBox.style.display = 'block';
    })
    //floor部分点击后登录
    floorLoginBtn.onclick = function () {
        preLoginBtn.click();
    }
    cancel.addEventListener('click', function () {
        loginBg.style.display = 'none';
        loginBox.style.display = 'none';
    })
    // 拖拽
    let loginHeader = loginBox.getElementsByTagName('header')[0];
    loginHeader.addEventListener('mousedown',function(e){
        let x=e.pageX-loginBox.offsetLeft;
        let y=e.pageY-loginBox.offsetTop;
        function move(e){
            loginBox.style.left=e.pageX-x+'px';
            loginBox.style.top=e.pageY-y+'px';
        }
        document.addEventListener('mousemove',move)
        document.addEventListener('mouseup',function(){
            document.removeEventListener('mousemove',move);
        })
    })
    //用户手机归属地下拉框
    let select = $get('#select');
    let selectContentBox = $get('#selectContentBox');
    let selectItems = $get('#selectUl').getElementsByTagName('li');
    select.addEventListener('click', function () {
        selectContentBox.style.display = 'block';
    })
    for (let i = 0; i < selectItems.length; i++){
        selectItems[i].addEventListener('click', function () {
            select.children[0].innerHTML = this.children[1].innerText;
            selectContentBox.style.display = 'none';
        })
    }
    // 显示与隐藏密码
    let eyeFlag = false;
    let eye = $get('#eye');
    eye.onclick = function () {
        if (!eyeFlag) {
            eyeFlag = true;
            eye.src='data/img/eyeOpen.png';
            passwordInp.type='text';
        } else {
            eyeflag = false;
            eye.src='data/img/eyeClose.png';
            passwordInp.type = 'password';
        }
    }
    //判断号码是否正确，判断有无密码，返回提示信息
    let phoneInp = $get('#phoneInp');
    let passwordInp = $get('#passwordInp');
    let leg = /^[1][3,4,5,7,8][0-9]{9}$/;
    let message = $get('#message');
    let loginBtn = $get('#loginBtn');
    loginBtn.addEventListener('click', function () {
        let phoneNum = phoneInp.value;
        let passwordNum = passwordInp.value;
        if (phoneNum == '') {
            message.style.display = 'block';
            message.children[0].className='message wrong';
            message.children[0].innerHTML = '请输入手机号';
            return;
        } else if (passwordNum == '') {
            message.style.display = 'block';
            message.children[0].className='message wrong';
            message.children[0].innerHTML = '请输入密码';
            return;
        } else if (!leg.test(phoneNum, leg)) {
            message.style.display = 'block';
            message.children[0].className='message wrong';
            message.children[0].innerHTML = '请输入正确的手机号';
            return;
        }
        else {
            message.style.display = 'none';
        }
    })

    //登录静态模块end
})