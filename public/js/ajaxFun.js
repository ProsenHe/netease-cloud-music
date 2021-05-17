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
            playCount:[],
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
                //获取歌单名与图片路径
                for (let i = 0; i < data.playlist.length; i++){
                    pInfo.playListName[i] = data.playlist[i].name;
                    pInfo.imgSrc[i] = data.playlist[i].coverImgUrl;
                    pInfo.creater[i] = data.playlist[i].creator.nickname;
                    pInfo.trackCount[i] = data.playlist[i].trackCount;
                    pInfo.playCount[i] = data.playlist[i].playCount;
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
function getSongInfo(keywords) {
    let songInfo = {
        songAdvice:[],
        songId: 0,
        songName:'',
        songArt: '',//歌手名字
        songUrl: '',
        picUrl: '',
        songRight:Boolean,
    };
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
                    songInfo.songAdvice.push(songAdviceItem);
                }
                resolve(songInfo);
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
