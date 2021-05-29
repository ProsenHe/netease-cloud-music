//Ajax交互
function ajax(options) {
    //设置默认值
    let defaults={
        type:'get',
        url: '',
        data: {},
        success: function () {},
        error:function(){}
    };
    //将输入的options覆盖defaults
    Object.assign(defaults,options);
    //1.创建ajax对象
    let xhr=new XMLHttpRequest();
    //将请求数据data中的属性值拼接成字符串
    let params='';
    for(let attr in defaults.data){
        params+=attr+'='+defaults.data[attr]+'&';
    }
    params=params.substr(0,params.length-1);// 将最后一个&去掉
    //判断请求类型设置url
    //设置时间戳添加到url后面
    let timestamp = new Date().getTime();
    if (defaults.type == 'get' && params.length != 0) {//get请求且params不为空时
        defaults.url+='?'+params+'&timestamp=' + timestamp;
    } else {//post请求或params为空
        defaults.url += '?' + 'timestamp=' + timestamp;
    }
    //2.ajax初始化（设置请求类型与请求路径）
    xhr.open(defaults.type,defaults.url);
    //3.判断请求类型，设置请求头请求体
    // 若为post请求
    if(defaults.type=='post'){
        //设置请求头
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        //设置请求体
        xhr.send(params);
    // 若为get请求
    } else {
        //设置请求体
        xhr.send();
    }
    //4.ajax绑定onload事件，即请求结束后获取响应头及响应信息
    xhr.onload=function(){
        let contentType=xhr.getResponseHeader('Content-Type');
        let response=xhr.response;
        //判断响应头是否显示响应内容为json格式，是则将响应信息由字符串转为json对象
        if(contentType.includes('application/json')){
            response=JSON.parse(response);
        }
        //判断响应状态码是否在200-300之间即判断请求是否成功调用对应函数
        if (xhr.status >= 200 && xhr.status < 300) {
            defaults.success(response, xhr);
        } else {
            defaults.error(response, xhr);
        }
    }
    
}
function ajaxNew(options) {
    let p = new Promise((resolve, reject) => {
        //设置默认值
        let defaults={
            type:'get',
            url: '',
            data: {},
        };
        //将输入的options覆盖defaults
        Object.assign(defaults,options);
        //1.创建ajax对象
        let xhr=new XMLHttpRequest();
        //将请求数据data中的属性值拼接成字符串
        let params='';
        for(let attr in defaults.data){
            params+=attr+'='+defaults.data[attr]+'&';
        }
        params=params.substr(0,params.length-1);// 将最后一个&去掉
        //判断请求类型设置url
        //设置时间戳添加到url后面
        let timestamp = new Date().getTime();
        if (defaults.type == 'get' && params.length != 0) {//get请求且params不为空时
            defaults.url+='?'+params+'&timestamp=' + timestamp;
        } else {//post请求或params为空
            defaults.url += '?' + 'timestamp=' + timestamp;
        }
        //2.ajax初始化（设置请求类型与请求路径）
        xhr.open(defaults.type,defaults.url);
        //3.判断请求类型，设置请求头请求体
        // 若为post请求
        if(defaults.type=='post'){
            //设置请求头
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            //设置请求体
            xhr.send(params);
        // 若为get请求
        } else {
            //设置请求体
            xhr.send();
        }
        //4.ajax绑定onload事件，即请求结束后获取响应头及响应信息
        xhr.onload=function(){
            let contentType=xhr.getResponseHeader('Content-Type');
            let response=xhr.response;
            //判断响应头是否显示响应内容为json格式，是则将响应信息由字符串转为json对象
            if(contentType.includes('application/json')){
                response=JSON.parse(response);
            }
            //判断响应状态码是否在200-300之间即判断请求是否成功调用对应函数
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(response, xhr);
            } 
        }
    });
    return p;
}
// 登陆相关函数start
// 获取uid
function getUid(phone,password,uid) {
    let p = new Promise((resolve, reject) => {
        ajax({
            type: 'post',
            url: '/login/cellphone',
            data: {
                phone: phone,
                password: password,
            },
            success: function (result) {
                // 登录失败
                if (!result.account) {
                    loginstantus = false;
                    message.style.display = 'block';
                    message.children[0].className = 'message wrong';
                    message.children[0].innerHTML = '密码错误或用户名不存在';
                    return;
                } else {
                    uid = result.account.id;
                    resolve(uid);
                    console.log('logined');
                }
            }
        })
    })
    return p;
}

// 获取用户的图像
function getUserImgSrc(uid) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url: '/user/detail',
            data: {
                uid:uid,
            },
            success: function (result) {
                resolve(result.profile.avatarUrl);
            }
        })
    })
    return p;
}

// 获取用户信息
function getUserInfo(uid) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url: '/user/detail',
            data: {
                uid:uid,
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
    return p;
}

// 获取关注数量
function getFollowsNum(uid) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url:'/user/follows',
            data:{
                uid:uid
            },
            success:function(data){
                resolve(data)
            }
        });
    })
    return p;
}

// 获取粉丝数量
function getFollowedsNum(uid) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url:'/user/followeds',
            data:{
                uid:uid
            },
            success: function (data) {
                resolve(data);
            }
        });
    })
    return p;
}

// 获取动态数量
function getEventsNum(uid) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url:'/user/event',
            data:{
                uid:uid
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
    return p;
}

// 获取听歌排行
function getBillList(uid) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url:'/user/record',
            data:{
                uid: uid,
                type:1
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
    return p;
}

// 获取歌单数量(需要先登录，不需要uid,但是得传递给info函数),与getListInfo函数连用
function getCreatedNum(uid) {
    let p = new Promise((resolve, reject) => {
        let pInfo = {
            uid: uid,
            createdNum:0,
            imgSrc: [],
            playListName: [],
            creater: [],
            trackCount: [],
            playCount: [],
            id:[],
        }
        ajax({
            url:'/user/subcount',
            success: function (data) {
                pInfo.createdNum=data.createdPlaylistCount;
                resolve(pInfo);
            }
        })
    })
    return p;
}

// 获取歌单信息(与歌单数量连用,pInfo对象为参数)
function getListInfo(pInfo) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url:'/user/playlist',
            data:{
                uid:pInfo.uid
            },
            success: function (data) {
                // console.log(data);
                //获取歌单名与图片路径
                for (let i = 0; i < data.playlist.length; i++){
                    pInfo.playListName[i] = data.playlist[i].name;
                    pInfo.imgSrc[i] = data.playlist[i].coverImgUrl;
                    pInfo.creater[i] = data.playlist[i].creator.nickname;
                    pInfo.trackCount[i] = data.playlist[i].trackCount;
                    pInfo.playCount[i] = data.playlist[i].playCount;
                    pInfo.id[i] = data.playlist[i].id;
                }
                resolve(pInfo);
            }
        })
    })
    return p;
}

// 单独使用（只需要uid)
function getListInfoOnly(uid) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url:'/user/playlist',
            data:{
                uid:uid
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
    return p;
}

// 获取歌单内容
function getListDetail(listId){
    let p = new Promise((resolve, reject) => {
        ajax({
            url: '/playlist/detail',
            data: {
                id:listId
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
    return p;
}

// 获取喜欢歌单的信息
function getLikeList(uid) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url: '/likelist',
            data: {
                uid:uid
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
    return p;
}
// 登陆相关函数end

// 歌曲信息相关函数start

// 根据搜索获取歌曲信息
function getSongAdvice(keywords) {
    let songAdvice=[];
    let p = new Promise((resolve, reject) => {
        ajax({
            url: '/cloudsearch',
            data: {
                keywords:keywords,
            },
            success: function (data) {
                // 获取歌曲搜索建议
                for (let i = 0; i < 4; i++){
                    let songAdviceItem = {};
                    songAdviceItem.adviceId = data.result.songs[i].id;
                    songAdviceItem.adviceSongName = data.result.songs[i].name;
                    songAdviceItem.adviceSongArt = data.result.songs[i].ar[0].name;
                    songAdviceItem.advicePic = data.result.songs[i].al.picUrl;
                    songAdvice.push(songAdviceItem);
                }
                resolve(songAdvice);
            }
        })
    })
    return p;
}
// 根据搜索获取歌单信息
function searchGetListInfo(keywords) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url: '/cloudsearch',
            data: {
                keywords: keywords,
                type:1000,
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
    return p;
}
// 根据搜索获取专辑信息
function getAlbInfo(keywords) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url: '/cloudsearch',
            data: {
                keywords: keywords,
                type:10,
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
    return p;
}
// 获取url，返回songInfo对象(与获取歌曲信息连用)
function getSongUrl(songInfo) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url: '/song/url',
            data: {
                id:songInfo.songId,
            },
            success: function (data) {
                console.log(data);
                songInfo.songUrl = data.data[0].url;
                resolve(songInfo);
            }
        })
    })
    return p;
}
// 获取url，单独使用(只需要songId)
function getSongUrlOnly(songId) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url: '/song/url',
            data: {
                id:songId,
            },
            success: function (data) {
                resolve(data.data[0].url);
            }
        })
    })
    return p;
}
// 歌曲信息相关函数end

// 收藏歌曲
function addLike(songId,userLikelistId) {
    let p = new Promise((resolve, reject) => {
        ajax({
            url: '/playlist/tracks',
            data: {
                op: 'add',
                pid: userLikelistId,
                tracks:songId
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
    return p;
}