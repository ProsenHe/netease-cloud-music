window.addEventListener('load', function () {
    //1.获取网页传来的uid参数
    let uid = uidCheck(location.href);
    let loginedFloor = $get('#loginedFloor');
    let unloginedFloor = $get('#unloginedFloor');
    //未登录
    if (uid == undefined) {
        loginedFloor.style.display = 'none';
        unloginedFloor.style.display = 'block';
    //已登录
    } else {
        loginedFloor.style.display = 'block';
        unloginedFloor.style.display = 'none';
        // 显示用户信息start

        // 图片
        let infoImg = $get('#infoImg');
        let commentBoxImg = $get('#commentBoxImg');
        getUserImgSrc(uid).then(function (data) {
            infoImg.src = data;
            commentBoxImg.src = data;
        })
        // 用户名/创建日期
        let infoUserName = $get('#infoUserName');
        let createTime = $get('#createTime');
        getUserInfo(uid).then(function (data) {
            infoUserName.innerHTML = data.profile.nickname;
            createTime.innerHTML = dateFy(data.profile.createTime)+'&nbsp;创建';
        })
        // 显示用户信息end

        // 显示歌单信息start
        // 喜欢音乐歌单的封面
        let likeImg = $get('#likeImg');
        getCreatedNum(uid).then(getListInfo).then(function (pInfo) {
            // console.log(pInfo);
            likeImg.src = pInfo.imgSrc[0];
        })
        // 喜欢音乐歌单中歌曲的显示
        let songList = $get('#songList');
        getListInfoOnly(uid).then(function (data) {
            getListDetail(data.playlist[0].id).then(function (data) {
                for (let i = 0; i < data.playlist.tracks.length; i++){
                    let li = $create('li');
                    // 序号
                    let numBox = $create('div');
                    let num = $create('span');
                    num.className = 'num';
                    num.innerHTML = i+1;
                    numBox.appendChild(num);
                    let playIco = $create('span');
                    playIco.className = 'playIco';
                    numBox.appendChild(playIco);
                    li.appendChild(numBox);
                    // 歌曲名称
                    let billSongName = $create('div');
                    billSongName.className = 'billSongName';
                    billSongName.innerHTML = data.playlist.tracks[i].name;
                    li.appendChild(billSongName);
                    // 时长
                    let duration = $create('div');
                    duration.className = 'duration';
                    li.appendChild(duration);
                    // 歌手名
                    let billArtName = $create('div');
                    billArtName.className = 'billArtName';
                    billArtName.innerHTML = data.playlist.tracks[i].ar[0].name;
                    li.appendChild(billArtName);
                    // 专辑名
                    let ablum = $create('div');
                    ablum.className = 'ablum';
                    ablum.innerHTML = data.playlist.tracks[i].al.name;
                    li.appendChild(ablum);
                    songList.appendChild(li);
                }
            })
        })
        // 创建歌单与收藏歌单的显示
        let createdPlayList = $get('#createdPlayList')
        let subPlaylist = $get('#subPlayList');
        let likeSongNum = $get('#likeSongNum');
        let playNum = $get('#playNum');
        let createdPlayListNum = $get('#createdPlayListNum');
        let subPlaylistNum = $get('#subPlaylistNum');
        getCreatedNum(uid).then(getListInfo).then(function (pInfo) {
            // console.log(pInfo);
            // 数量显示
            likeSongNum.innerHTML = pInfo.trackCount[0];
            playNum.innerHTML = pInfo.playCount[0];
            createdPlayListNum.innerHTML = '(' + pInfo.createdNum + ')';
            subPlaylistNum.innerHTML = '(' + (pInfo.imgSrc.length-pInfo.createdNum)+ ')';
            // 创建歌单信息显示
            for (let i = 0; i < pInfo.createdNum; i++){
                let li = $create('li');
                //歌单封面
                let img=$create('img');
                img.className='listImg fl';
                img.src=pInfo.imgSrc[i];
                li.appendChild(img);
                //歌单信息
                let liText = $create('div');
                liText.className = 'fl liText';
                // 歌单名
                let p=$create('p');
                p.innerHTML=pInfo.playListName[i];
                liText.appendChild(p);
                let ps = $create('p');
                // 歌单歌曲数目
                let billSongName = $create('span');
                billSongName.innerHTML = pInfo.trackCount[i]+'首';
                ps.appendChild(billSongName);
                // 歌单创建者
                let billArt = $create('span');
                billArt.innerHTML ='by'+pInfo.creater[i];
                ps.appendChild(billArt);
                liText.appendChild(ps);
                li.appendChild(liText);
                createdPlayList.appendChild(li);
            }
            // 收藏歌单信息显示
            for (let i = pInfo.createdNum; i < pInfo.imgSrc.length; i++) {
                let li = $create('li');
                let img=$create('img');
                img.className='listImg fl';
                img.src=pInfo.imgSrc[i];
                li.appendChild(img);
                //歌单信息
                let liText = $create('div');
                liText.className = 'fl liText';
                // 歌单名
                let p=$create('p');
                p.innerHTML=pInfo.playListName[i];
                liText.appendChild(p);
                let ps = $create('p');
                // 歌单歌曲数目
                let billSongName = $create('span');
                billSongName.innerHTML = pInfo.trackCount[i]+'首';
                ps.appendChild(billSongName);
                // 歌单创建者
                let billArt = $create('span');
                billArt.innerHTML = 'by'+pInfo.creater[i];
                ps.appendChild(billArt);
                liText.appendChild(ps);
                li.appendChild(liText);
                subPlaylist.appendChild(li);
            }
        })

        // 显示歌单信息end
    }
})
