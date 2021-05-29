window.addEventListener('load', function () {

    //1.获取传过来的uid
    //a.获取听歌排行榜;b.获取用户信息(不需登录,不需要按钮，可同时进行)
    //c.先登录然后获取歌单数量然后获取歌单信息（login.js函数的调用，promise链式调用）//歌单数量来区分创建歌单与收藏歌单

    //1.获取网页传来的uid参数
    let uid = uidCheck(location.href);
    // 未登录
    if (uid == undefined) {
        location.href = 'http://localhost:3000/myindex.html';
    }    
    //a.获取听歌排行并显示
    //歌单ul
    let songList = $get('#songList');
    getBillList(uid).then(function (data) {
        console.log(data);
        for(let i=0;i<data.weekData.length;i++){
            let li=$create('li');
            li.value=data.weekData[i].song.id;
            let num = $create('span');
            num.innerHTML=i+1+'.';
            num.className = 'num';
            let playIco = $create('span');
            playIco.className = 'playIco';
            let billSongName=$create('span');
            billSongName.innerHTML=data.weekData[i].song.name;
            billSongName.className='billSongName';
            let billArtName=$create('span');
            billArtName.innerHTML='-'+data.weekData[i].song.ar[0].name;
            billArtName.className='billArtName';
            li.appendChild(num);
            li.appendChild(playIco);
            li.appendChild(billSongName);
            li.appendChild(billArtName)
            songList.appendChild(li);
        }
    })
    
    //获取听歌排行end

    //b.获取用户信息start(不需要登录，直接传递uid)
    //获取元素
    let userImg=$get('#userImg');
    let username=$get('#username');
    let level=$get('#level');
    let gender=$get('#gender');
    let province=$get('#province');
    let signature=$get('#signature');//个性签名
    let songNum = $getAll('.songNum');//听过的歌曲数量（类名，多次可用）
    let follows=$get('#follows');//关注
    let followed=$get('#followed');//粉丝
    let event = $get('#event');//动态
    // 获取用户信息并显示
    getUserInfo(uid).then(function (data) {
        //用户图片
        userImg.src = data.profile.avatarUrl;
        //用户昵称
        username.innerHTML = data.profile.nickname;
        //用户级别
        level.innerHTML=data.level;
        //性别：0未知，1为男，2为女
        if (data.profile.gender == 1) {
            gender.className = 'gender men';
        } else if (data.profile.gender == 2) {
            gender.className = 'gender women';
        }
        //城市编号
        province.innerHTML = '城市区域代码：' + data.profile.city;
        //个性签名
        signature.innerHTML = data.profile.signature;
        //听过的歌曲的数量(类名)
        for (let i = 0; i < songNum.length; i++){
            songNum[i].innerHTML = data.listenSongs;
        }
    })

    //获取关注数量并显示
    getFollowsNum(uid).then(function (data) {
        follows.innerHTML=data.follow.length;
    })
   
    //获取粉丝数量并显示
    getFollowedsNum(uid).then(function (data) {
        followed.innerHTML=data.followeds.length;
    })
    
    //获取动态数量并显示
    getEventsNum(uid).then(function (data) {
        event.innerHTML=data.events.length;
    })
    //获取与显示用户信息详情end

    //c.获取用户歌单信息start
    // 获取元素
    let createdPlayListNum = $get('#createdPlayListNum');//显示创建歌单数量的元素
    let subPlaylistNum = $get('#subPlaylistNum');//显示收藏歌单数量的元素
    let createdPlaylist = $get('#createdPlaylist');//显示创建歌单的元素
    let subPlaylist = $get('#subPlaylist');//显示收藏歌单的元素

    getCreatedNum(uid).then(getListInfo).then(function (pInfo) {
        // 数量显示
        createdPlayListNum.innerHTML = '(' + pInfo.createdNum + ')';
        subPlaylistNum.innerHTML = '(' + (pInfo.imgSrc.length-pInfo.createdNum)+ ')';
        // 创建歌单信息显示
        for (let i = 0; i < pInfo.createdNum; i++){
            let li=$create('li');
            li.className='songsli';
            let p=$create('p');
            p.innerHTML=pInfo.playListName[i];
            let img=$create('img');
            img.className='songsImg';
            img.src=pInfo.imgSrc[i];
            li.appendChild(img);
            li.appendChild(p);
            createdPlaylist.appendChild(li);
        }
        // 收藏歌单信息显示
        for (let i = pInfo.createdNum; i < pInfo.imgSrc.length; i++) {
            let li = $create('li');
            li.className = 'songsli';
            let p = $create('p');
            p.innerHTML = pInfo.playListName[i];
            let img = $create('img');
            img.className = 'songsImg';
            img.src = pInfo.imgSrc[i];
            li.appendChild(img);
            li.appendChild(p);
            subPlaylist.appendChild(li);
        }
    })
    
})