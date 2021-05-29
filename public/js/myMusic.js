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

        let idHistory = [];//记录播放的历史
        
        // 显示用户信息start
        // 用户图片
        let infoImg = $get('#infoImg');
        let commentBoxImg = $get('#commentBoxImg');
        getUserImgSrc(uid).then(function (data) {
            infoImg.src = data;
            commentBoxImg.src = data;
        })
        // 用户名
        let infoUserName = $get('#infoUserName');
        getUserInfo(uid).then(function (data) {
            infoUserName.innerHTML = data.profile.nickname;
        })
        // 显示用户信息end

        // 创建歌单与收藏歌单的显示
        let createdPlayList = $get('#createdPlayList')
        let subPlaylist = $get('#subPlayList');
        // let playNum = $get('#playNum');
        let createdPlayListNum = $get('#createdPlayListNum');
        let subPlaylistNum = $get('#subPlaylistNum');
        
        // 根据选定的歌单显示歌单信息与歌单内歌曲信息start
        let listTitle = $get('#listTitle');//歌单名称
        let createTime = $get('#createTime');//创建时间
        let listImg = $get('#listImg');//歌单封面
        let listSongNum = $get('#listSongNum');//歌单内歌曲个数
        let playNum = $get('#playNum');//歌单播放次数
        let songListUlBox = $get('#songListUlBox');//歌单列表

        // 评论相关功能：
        let commentInp = $get('#commentInp');
        let commentTextData = '';
        let commentHistory = [];
        let commentUl = $get('#commentUl');
        
        getCreatedNum(uid).then(getListInfo).then(function (pInfo) {
            // console.log(pInfo);
            // 数量显示
            // playNum.innerHTML = pInfo.playCount[0];
            createdPlayListNum.innerHTML = '(' + pInfo.createdNum + ')';
            subPlaylistNum.innerHTML = '(' + (pInfo.imgSrc.length - pInfo.createdNum) + ')';     
            // 创建歌单信息显示
            for (let i = 0; i < pInfo.createdNum; i++){
                let li = $create('li');
                li.className = 'billLi';
                // 歌单id
                li.setAttribute('id', pInfo.id[i]);
                // 索引号
                li.setAttribute('index', i);
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
                li.className = 'billLi';
                // 歌单id
                li.setAttribute('id', pInfo.id[i]);
                
                // 索引号
                li.setAttribute('index', i);
                // 歌单封面
                let img = $create('img');
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
            // 选择歌单，显示对应歌单歌曲信息start
            let billLi = $getAll('.billLi');
            let billLiHistory = [];//歌单历史
            for (let i = 0; i < billLi.length; i++) {
                billLi[i].addEventListener('click', function () {
                    // 获取歌单id
                    let id = this.getAttribute('id');
                    billLiHistory.push(id);
                    // 清零comment
                    commentInp.value = '';
                    commentTextData = '';
                    while (commentUl.hasChildNodes()) {
                        commentUl.removeChild(commentUl.firstChild);
                    }
                    let index = this.getAttribute('index');
                    // 选中当前的歌单sart
                    for (let j = 0; j < billLi.length; j++) {
                        billLi[j].className = '';
                    }
                    this.className = ' current';
                    // 选中当前的歌单end
                    
                    // 获取歌单内歌曲详情
                    ajaxNew({
                        url: '/playlist/detail',
                        data: {
                            id: id,
                        }
                   
                    }).then(function (response) {
                        // console.log(response);
                        //显示歌单信息
                        //显示歌单名称
                        listTitle.innerHTML = response.playlist.name;
                        // 显示歌单封面
                        listImg.src = response.playlist.coverImgUrl;
                        //显示创建时间
                        createTime.innerHTML = dateFy(response.playlist.createTime) + '&nbsp;创建';
                        // 显示歌曲数目
                        listSongNum.innerHTML = response.playlist.trackIds.length;
                        // 显示播放次数
                        playNum.innerHTML = response.playlist.playCount;
                        // 显示歌单内歌曲信息
                        // 先清除
                        while (songListUlBox.hasChildNodes()) {
                            songListUlBox.removeChild(songListUlBox.firstChild);
                        }
                        // 生成li，添加内容
                        for (let i = 0; i < response.playlist.tracks.length; i++) {
                            let li = $create('li');
                            li.className = 'listLi';
                            // 歌曲id
                            li.setAttribute('songId', response.playlist.trackIds[i].id);
                            li.setAttribute('songName', response.playlist.tracks[i].name);
                            li.setAttribute('songArt', response.playlist.tracks[i].ar[0].name);
                            li.setAttribute('songPic', response.playlist.tracks[i].al.picUrl);
                            // 序号
                            let numBox = $create('div');
                            let num = $create('span');
                            num.className = 'num';
                            num.innerHTML = i + 1;
                            numBox.appendChild(num);
                            let playIco = $create('span');
                            playIco.className = 'playIco';
                            numBox.appendChild(playIco);
                            li.appendChild(numBox);
                            // 歌曲名称
                            let billSongName = $create('div');
                            billSongName.className = 'billSongName ellipsis';
                            billSongName.innerHTML = response.playlist.tracks[i].name;
                            li.appendChild(billSongName);
                            // 时长
                            let duration = $create('div');
                            duration.className = 'duration';
                            li.appendChild(duration);
                            // 歌手名
                            let billArtName = $create('div');
                            billArtName.className = 'billArtName ellipsis';
                            billArtName.innerHTML = response.playlist.tracks[i].ar[0].name;
                            li.appendChild(billArtName);
                            // 专辑名
                            let ablum = $create('div');
                            ablum.className = 'ablum ellipsis';
                            ablum.innerHTML = response.playlist.tracks[i].al.name;
                            li.appendChild(ablum);
                            songListUlBox.appendChild(li);
                        }
            
                        // 选择歌单，显示对应歌单歌曲信息end
            
                        // 点击playIco，生成播放列表，回调函数musicPlay进行显示与播放
                        let playIco = $getAll('.playIco');
                        
                        for (let i = 0; i < playIco.length - 1; i++) {
                            playIco[i].addEventListener('mouseenter', function () {
                                this.style.backgroundPosition = '0 -128px';
                            })
                            playIco[i].addEventListener('mouseleave', function () {
                                this.style.backgroundPosition = '0 -103px';
                            })
                            playIco[i].addEventListener('click', function () {
                                let songListItem = {
                                    songName: '',
                                    songArt: '',
                                    songId: '',
                                    songUrl: '',
                                }
                                songListItem.songId = this.parentNode.parentNode.getAttribute('songId');
                                songListItem.songName = this.parentNode.parentNode.getAttribute('songName');
                                songListItem.songArt = this.parentNode.parentNode.getAttribute('songArt');
                                songListItem.songPic = this.parentNode.parentNode.getAttribute('songPic');
                                ajaxNew({
                                    url: '/song/url',
                                    data: {
                                        id: songListItem.songId,
                                    }
                                }).then(function (response) {
                                    // console.log(response);
                                    songListItem.songUrl = response.data[0].url;
                                    // console.log(songListItem);
                                    //音乐盒子显示并播放
                                    musicPlay(songListItem);
                                })
                            })
                            
                        }

                        // 音乐盒子部分
                        let audio = $get('#audio');
                        let musicBox = $get('#musicBox');//自制音乐盒子
                        let songPic = $get('#songPic');
                        let songName = $getAll('.songName');
                        let songArt = $getAll('.songArt');
                        // 歌单部分
                        let songListUl = $get('#songListUl');
                        
                        //相关控件：播放与停止start
                        let playBtn = $get('#playBtn');
                        let play = false;
                        playBtn.addEventListener('mouseover', function () {
                            if (play == true) {
                                playBtn.style.backgroundPosition = '-41px -163px';//改变图片
                            } else {
                                playBtn.style.backgroundPosition = '-41px -202px';
                            }
                        })
                        playBtn.addEventListener('mouseleave', function () {
                            if (play == true) {
                                playBtn.style.backgroundPosition = '-1px -163px';//改变图片
                            } else {
                                playBtn.style.backgroundPosition = '-1px -202px';
                            }
                        })
                        playBtn.addEventListener('click', function () {
                            play = rightChange(play);
                            if (play == true) {
                                playBtn.style.backgroundPosition = '-1px -163px';//改变图片
                                audio.play();
                            } else {
                                playBtn.style.backgroundPosition = '-1px -202px';
                                audio.pause();
                            }
                        })

                        // 播放当前歌曲的函数(保证不与上一首播放重复换audio.src)
                        function audioPlay(songListItem) {
                            // 当前歌曲的url不同才添加
                            if (songListItem.songUrl != audio.src) {
                                audio.src = songListItem.songUrl;//不重复输入播放地址
                                musicBox.className = 'musicBox musicBoxBlock';//显示音乐盒子
                            }
                            play = false;
                            playBtn.click();
                        }

                        // 歌曲信息显示函数(对所有songName/songArt类名元素修改)
                        function songDisplay(songListItem) {
                            // 更改图片
                            songPic.src = songListItem.songPic;
                            //更改歌名
                            for (let i = 0; i < songName.length; i++) {
                                songName[i].innerHTML = songListItem.songName;
                            }
                            //更改歌手名
                            for (let i = 0; i < songArt.length; i++) {
                                songArt[i].innerHTML = songListItem.songArt;
                            }
                        }
                        
                        //播放与停止end
                        // 根据songList显示歌单信息start
                        function musicPlay(songListItem) {
                            // 根据songList修改歌单信息
                            let change = true;//是否修改
                            idHistory.push(songListItem.songId);// 添加id历史记录
                            // console.log(idHistory);
                            if (idHistory[idHistory.length - 1] == idHistory[idHistory.length - 2]) {
                                change = false;
                            }
                            // 添加li，显示内容
                            if (change) {
                                let li = document.createElement('li');
                                li.className = 'playListItem pore pointer';
                                li.setAttribute('songName', songListItem.songName);
                                li.setAttribute('songId', songListItem.songId);
                                li.setAttribute('songArt', songListItem.songArt);
                                li.setAttribute('songPic', songListItem.songPic);
                                li.setAttribute('songUrl', songListItem.songUrl);
                                let itemplay = document.createElement('span');//播放图标
                                itemplay.className = 'itemPlay';
                                let itemSongName = document.createElement('span');//歌曲名
                                itemSongName.className = 'itemSongName';
                                itemSongName.innerHTML = songListItem.songName;
                                let itemArtName = document.createElement('span');//歌手名
                                itemArtName.className = 'itemArtName poab ';
                                itemArtName.innerHTML = songListItem.songArt;
                                let itemCancel = $create('span');
                                itemCancel.className = 'itemCancel poab';
                                li.appendChild(itemplay);
                                li.appendChild(itemSongName);
                                li.appendChild(itemArtName);
                                li.appendChild(itemCancel);
                                songListUl.appendChild(li);
                            }
                            
                            //默认播放第一首歌
                            songDisplay(songListItem);//显示song信息
                            audioPlay(songListItem);
                            //获取li
                            let playListItem = $getAll('.playListItem');
                            // 点击li，改变当前播放
                            for (let i = 0; i < playListItem.length; i++) {
                                playListItem[i].addEventListener('click', function () {
                                    let songListItem = {
                                        songName: this.getAttribute('songName'),
                                        songArt: this.getAttribute('songArt'),
                                        songPic: this.getAttribute('songPic'),
                                        songUrl: this.getAttribute('songUrl'),
                                    }
                                    songDisplay(songListItem);
                                    audioPlay(songListItem);
                                })
                            }
                        }
                        // 根据songList显示歌单信息end

                    })//根据歌单id获取歌单详情
                    //评论功能
                    let subBtn = $get('#subBtn');
                    let rest = $get('#rest');
                    // let subBtn = $get('#subBtn');
                    commentInp.oninput = null;
                    commentInp.oninput = function () {
                        commentInp.addEventListener('input', function () {
                            rest.innerHTML = 140 - this.value.length;
                            commentTextData = this.value + '';
                            subBtn.onclick = null;
                            subBtn.onclick = function () {
                                let li = $create('li');
                                let img = $create('img');
                                img.className = 'fl commentImg';
                                getUserImgSrc(uid).then(function (data) {
                                    img.src = data;
                                })
                                li.appendChild(img);
                                let commentText = $create('div');
                                commentText.className = 'commentText';
                                let commentTextBox = $create('span');
                                commentTextBox.innerHTML =commentTextData;
                                commentTextBox.className = 'commentTextBox';
                                let commentUser = $create('span');
                                commentUser.className = 'commentUser';
                                getUserInfo(uid).then(function (data) {
                                    commentUser.innerHTML = data.profile.nickname+':&nbsp;';
                                })
                                commentText.appendChild(commentUser);
                                commentText.appendChild(commentTextBox);
                                li.appendChild(commentText);
                                let commentBtn = $create('div');
                                commentBtn.className = 'commentBtn';
                                let reply = $create('span');
                                reply.className = 'reply';
                                let commentBorder = $create('span');
                                commentBorder.className = 'commentBorder';
                                let like = $create('span');
                                like.className = 'like';
                                commentBtn.appendChild(reply);
                                commentBtn.appendChild(commentBorder);
                                commentBtn.appendChild(like);
                                commentUl.insertBefore(li, commentUl.firstChild);
                                ajaxNew({
                                    url: '/comment',
                                    data: {
                                        t: 1,
                                        type:2,
                                        id: id,
                                        content:commentTextData,
                                    },
                                }).then(function (response) {
                                    console.log(response);
                                    commentInp.value = '';
                                })
                                // 调用API
                            }
                        })
                    }

                })//每个billList添加事件:点击billList获取歌单id
                
            }//遍历每个billList
            if (billLiHistory == 0) {
                billLi[0].click(); // 默认显示第一个且无评论
            }
            
        })//获取用户歌单信息

        
        
        
        // 根据选定的歌单显示歌单信息与歌单内歌曲信息end
        // 提交评论
        
        
        
    }//已登录
})
