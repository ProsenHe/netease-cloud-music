window.addEventListener('load', function () {
    // music相关函数



    let audio = $get('#audio');
    let musicBox = $get('#musicBox');//自制音乐盒子

    //交互获取歌单信息与页面显示start
    let searchInp = $get('#searchInp');
    //歌单信息
    let songList = [];
    //musicBox部分歌曲信息元素
    let songPic = $get('#songPic');
    let songName = $getAll('.songName');
    let songArt = $getAll('.songArt');
    // songList部分
    let songListUl = $get('#songListUl');
    //歌曲顺序操作按钮
    let preSong = $get('#preSong');
    let nextSong = $get('#nextSong');
    // 搜索建议
    let searchAdviseBox = $get('#searchAdviseBox');
    let searchAbout = $get('#searchAbout');
    let songAdviceUl = $get('#songAdviceUl');//歌曲建议
    let albAdvice = $get('#albAdvice');
    let listAdvice = $get('#listAdvice');

    // 搜索start(1.获取搜索信息并显示；2.点击li后将播放对应歌曲，并添加至歌单)
    let timer = null;
    searchInp.addEventListener('input', function () {
        //  当输入框有内容时
        if (searchInp.value.length != 0) {
            // 获取输入的内容
            let keywords = searchInp.value;
            // 显示搜索结果盒子
            searchAdviseBox.style.display = 'block';            
            // 相关用户显示
            searchAbout.innerHTML = keywords;
            // 清除li
            if (songAdviceUl.children.length > 0) {
                for (let i = 0; i < 4; i++){
                    songAdviceUl.removeChild(songAdviceUl.children[0]);
                }
            }
            if (albAdvice.children.length > 0) {
                for (let i = 0; i < 2; i++){
                    albAdvice.removeChild(albAdvice.children[0]);
                }
            }
            if (listAdvice.children.length > 0) {
                for (let i = 0; i < 2; i++){
                    listAdvice.removeChild(listAdvice.children[0]);
                }
            }
            // 显示搜索结果
            
            // 清除定时器
            clearTimeout(timer);
            timer = setTimeout(function () {
                // 1.根据搜索结果获取歌曲建议
                getSongAdvice(keywords).then(function (songAdvice) {
                    // 创建li，储存对应歌曲信息，添加到搜索结果的盒子
                    for (let i = 0; i < 4; i++) {
                        let li = $create('li')
                        li.className = 'adviceLi';
                        li.songId = songAdvice[i].adviceId;
                        li.songName = songAdvice[i].adviceSongName;
                        li.songArt = songAdvice[i].adviceSongArt;
                        li.songPic = songAdvice[i].advicePic;
                        let adviceSongName = $create('span')
                        adviceSongName.className = 'adviceSongName';
                        adviceSongName.innerHTML = songAdvice[i].adviceSongName + '-';
                        let adviceSongArt = $create('span');
                        adviceSongArt.className = 'adviceSongArt';
                        adviceSongArt.innerHTML = songAdvice[i].adviceSongArt;
                        li.appendChild(adviceSongName);
                        li.appendChild(adviceSongArt);
                        songAdviceUl.appendChild(li);
                    }
                    // 点击li时，将li的信息给playInfo对象
                    let lis = $getAll('.adviceLi');
                    for (let i = 0; i < lis.length; i++){
                        lis[i].addEventListener('click', function () {
                            // 创建playInfo对象(获取li的信息)
                            let playInfo = {};
                            playInfo.songId = this.songId;
                            playInfo.songId = this.songId;
                            playInfo.songName = this.songName;
                            playInfo.songArt = this.songArt;
                            playInfo.picUrl = this.songPic;
                            // 获取歌曲的url
                            getSongUrlOnly(this.songId).then(function (data) {
                                playInfo.songUrl = data;
                                // 不重复添加歌曲
                                if (songList.length > 0) {// 添加第二首歌曲
                                    let ifPush = true;
                                    for (let i = 0; i < songList.length; i++){
                                        if (songList[i].songId == playInfo.songId) {
                                            ifPush = false;
                                        }
                                    }
                                    if (ifPush) {
                                        // 将songInfo添加到歌单songList
                                        songList.push(playInfo);
                                    }
                                } else {// 第一首歌曲直接添加到歌单
                                    songList.push(playInfo);
                                }
                                // 根据歌单信息做出对应的播放响应
                                musicPlay(songList);
                            })
                        })
                    }
                })
                // 2.获取歌单建议
                searchGetListInfo(keywords).then(function (data) {
                    // 创建lis
                    for (let i = 0; i < 2; i++) {
                        let li = $create('li')
                        li.className = 'adviceLi';
                        let adviceSongName = $create('span')
                        adviceSongName.className = 'adviceSongName';
                        adviceSongName.innerHTML = data.result.playlists[i].name ;
                        li.appendChild(adviceSongName);
                        listAdvice.appendChild(li);
                    }
                })
                // 3.获取专辑建议
                getAlbInfo(keywords).then(function (data) {
                    for (let i = 0; i < 2; i++) {
                        let li = $create('li')
                        li.className = 'adviceLi';
                        let adviceSongName = $create('span')
                        adviceSongName.innerHTML = data.result.albums[i].name+'-';
                        let adviceSongArt = $create('span');
                        adviceSongArt.innerHTML = data.result.albums[i].artist.name;
                        li.appendChild(adviceSongName);
                        li.appendChild(adviceSongArt);
                        albAdvice.appendChild(li);
                    }
                })
            }, 2000)
        //当输入框无内容时
        } else {
            searchAdviseBox.style.display = 'none';
        }
    })

    // 获取选取的歌曲信息后相关网页操作start（搜索的回调函数）

    // 播放当前歌曲的函数(保证不与上一首播放重复换audio.src)
    function audioPlay(songCurrent) {
        playHistory.push(songCurrent);
        // 第二首歌起，
        if (playHistory.length !=1) {
            if (playHistory[playHistory.length - 1] != playHistory[playHistory.length - 2]) {
                audio.src = songList[songCurrent].songUrl;//不重复时输入播放地址
                play = false;
                playBtn.click();
            }
        } else {
            audio.src = songList[songCurrent].songUrl;//第一首歌直接输入播放地址
            musicBox.style.height = '50px';
            lock.click();
            play = false;
            playBtn.click();
        }
    }

    // 歌曲信息显示函数(对所有songName/songArt类名元素修改)
    function songDisplay(songCurrent) {
        // 更改图片
        songPic.src = songList[songCurrent].picUrl;
        //更改歌名
        for (let i = 0; i < songName.length; i++){
            songName[i].innerHTML = songList[songCurrent].songName;
        }
        //更改歌手名
        for (let i = 0; i < songArt.length; i++){
            songArt[i].innerHTML = songList[songCurrent].songArt;
        }
        // 更改歌单数量
        playListBtn.innerHTML = songList.length;
    }

    let playHistory = [];//播放歌曲序号的历史
    let LengthHistory = [];//播放歌单长度的历史
    let songCurrent = 0;//当前播放的歌曲的索引号

    function musicPlay(songList) {
        //当前歌曲序号

        //默认播放播放
        songDisplay(songCurrent);//显示song信息
        audioPlay(songCurrent);

        // 歌单部分响应start：根据songList添加li到songListUl
        let ifAppend = true;//是否添加li
        LengthHistory.push(songList.length);//添加songList长度到历史
        if (LengthHistory.length > 1) {//第二次添加
            ifAppend = true;
            if (LengthHistory[LengthHistory.length - 1] == LengthHistory[LengthHistory.length - 2]) {
                ifAppend = false;
            }
        }
        if (ifAppend) {
            let li = document.createElement('li');
            li.className = 'playListItem pore pointer';
            let itemplay = document.createElement('span');//播放图标
            itemplay.className = 'itemPlay';
            let itemSongName = document.createElement('span');//歌曲名
            itemSongName.className = 'itemSongName';
            let itemArtName = document.createElement('span');//歌手名
            itemArtName.className = 'itemArtName poab ';
            li.appendChild(itemplay);
            li.appendChild(itemSongName);
            li.appendChild(itemArtName);
            songListUl.appendChild(li); 
        }
        //显示歌单信息内容
        let itemSongNameList = $getAll('.itemSongName');
        let itemArtNameList = $getAll('.itemArtName');
        let playListItem = $getAll('.playListItem');
        for (let i = 0; i < songList.length; i++){
            playListItem[i].setAttribute('index', i);//每个li设置Index
            itemSongNameList[i].innerHTML = songList[i].songName;
            itemArtNameList[i].innerHTML = songList[i].songArt;
        }

        // 点击li，改变当前播放
        for (let i = 0; i < playListItem.length; i++){
            playListItem[i].addEventListener('click', function () {
                songCurrent = this.getAttribute('index');
                songDisplay(songCurrent);
                audioPlay(songCurrent);
            })
        }
        
        // 歌单部分响应end

        // 音乐盒子响应start
    }

    // 搜索end

    // 相关控件设置start

    // 搜索框显示与隐藏start
    searchInp.addEventListener('focus', function () {
        if (searchInp.value.length != 0) {
            searchAdviseBox.style.display = 'block';
        } else {
            searchAdviseBox.style.display = 'none';
        }
    })
    // searchInp失去焦点时建议框消失
    let blur = false;
    searchAdviseBox.addEventListener('mouseover', function () {
        blur = false;
    })
    searchAdviseBox.addEventListener('mouseout', function () {
        blur = true;
    })
    searchAdviseBox.addEventListener('click', function () {
        searchAdviseBox.style.display = 'none';
    })
    searchInp.addEventListener('blur', function () {
        if (blur) {
            searchAdviseBox.style.display = 'none';
        }
    })
    // 搜索框显示与隐藏end

    //进度条start
    let bar = $get('#bar');
    let barClientX = bar.getBoundingClientRect().left;//bar相对窗口左边的距离
    let progress=$get('#progress');
    let barSpan = $get('#barSpan');//滑块
    let barSpanWidth = barSpan.offsetWidth;
    let barSpanStart = -barSpanWidth / 2;
    let timeInfo = $get('#timeInfo');//显示事件信息
    let songDuration = $getAll('.songDuration');
    let duration=0;//总时间
    let currentTime=0;//当前时间
    let width=0;//progress长度(占比0-1)
    let barWidth = bar.clientWidth;//进度条总长度
    //获取歌曲的时长
    audio.addEventListener('durationchange',function(){
        duration = parseInt(audio.duration);
        for (let i = 0; i < songDuration.length; i++){
            songDuration[i].innerHTML = timefy(duration);
        }
        // 清零进度条
        barSpan.style.left = barSpanStart+'px';
        progress.style.width = 0;
    });

    //获取当前播放时间并自动显示进度
    let loop = false;//与循环联动
    audio.addEventListener('timeupdate', function () {
        //显示当前时间时进度
        currentTime = parseInt(audio.currentTime);
        timeInfo.children[0].innerHTML = timefy(currentTime);
        // progress的宽度
        width =(currentTime / duration)*barWidth;
        progress.style.width = width + 'px';
        barSpan.style.left = width - barSpanWidth / 2 + 'px';
        // 播完后
        if (currentTime / duration == 1) {
            // 判断是否只有一首歌，是否单曲循环；
            //有多于两首的歌
            if (songList.length > 1) {
                // 判断是否循环
                if (!loop) {//无循环
                    nextSong.click();
                } 
            //只有一首歌
            } else {
                if (!loop) {//无循环则改变播放按钮样式为暂停
                    play = true;
                    playBtn.click();
                }  
            }
        }
    });

    // 拖动progress，音乐同步
    bar.addEventListener('mousedown', function (e) {
        //点击bar，让span定位
        let startX =parseInt(e.clientX - barClientX) ;//鼠标相对bar左端初始位置
        barSpan.style.left = startX - barSpanWidth / 2+ 'px';
        progress.style.width = startX + 'px';
        // 改变歌曲播放进度
        if (songList.length > 0) {
            audio.currentTime = (startX / barWidth) * duration;
            play = true;
            playBtn.click();
        }
        // 按下后滑动鼠标，让span与progress移动移动
        window.onmousemove = function (e) {
            let barX = parseInt(e.clientX - barClientX);//鼠标相对于bar左端的位置
            // 设置范围
            if (barX < 0) {
                barX = 0;
            }
            else if (barX >barWidth) {
                barX = barWidth;
            }
            barSpan.style.left =barX- barSpanWidth / 2+ 'px';
            progress.style.width = barX + 'px';
            // 改变歌曲播放进度
            if (songList.length > 0) {
                audio.currentTime = barX / barWidth * duration;
                play = true;
                playBtn.click();
            }
        }
        window.onmouseup = function () {
             // 有歌曲时才播放
            if (songList.length > 0) {
                play = false;
                playBtn.click();
            }
            window.onmousemove = null;
            window.onmouseup = null;
        }
    })

    // 歌单显示
    let playListBox = $get('#playListBox');
    let playListBtn = $get('#playListBtn');
    let playListCancel = $get('#playListCancel');
    let ifPlayList = false;
    // 锁，歌单显示，盒子显示都需用到ifClock变量
    let ifLock = false;
    playListBtn.addEventListener('click', function () {
        if (!ifPlayList) {
            ifPlayList = true;
            // 若未锁则锁上
            if (!ifLock) {
                lock.click();
            }
            playListBox.style.display = 'block';
        } else {
            ifPlayList = false;
            playListBox.style.display = 'none';
        }
    })
    playListCancel.addEventListener('click', function () {
        playListBox.style.display = 'none';
    })

    // 盒子显示与锁
    let lock = $get('#lock');
    let musicBoxTimer = null;
    musicBox.addEventListener('mouseenter', function () {
        musicBox.className='musicBox musicBoxBlock'
    })
    musicBox.addEventListener('mouseleave', function () {
        musicBoxTimer = null;
        if (!ifLock) {
            // 若有显示歌单则隐藏；
            if (ifPlayList) {
                playListBtn.click();
            }
            musicBoxTimer = setTimeout(function () {
                musicBox.className='musicBox musicBoxHide'
            }, 1000)
        }
    })

    lock.addEventListener('click', function () {
        if (ifLock) {
            ifLock = false;
            lock.className = 'poab unlocked';
            
        } else {
            ifLock = true;
            
            lock.className = 'poab locked';
        }
    })

    //播放与停止start
    let playBtn=$get('#playBtn');
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
    //播放与停止end

    // 歌曲按钮歌曲切换
    preSong.addEventListener('click', function () {
        songCurrent--;
        if (songCurrent < 0) {
            songCurrent = songList.length-1;
        }
        songDisplay(songCurrent);
        audioPlay(songCurrent);
        // 进度条响应
        barSpan.style.left = 0;
        progress.style.width = 0;
    })
    nextSong.addEventListener('click', function () {
        songCurrent++;
        // 若为最后一个则回到原点
        if (songCurrent > songList.length - 1) {
            songCurrent = 0;
        }
        songDisplay(songCurrent);
        audioPlay(songCurrent);
        // 进度条响应
        barSpan.style.left = 0;
        progress.style.width = 0;
    })
    // 音乐盒子响应end
    
    //循环播放
    let loopBtn=$get('#loopBtn');
    loopBtn.addEventListener('click', function () {
        if (!loop) {
            loop = true;
            audio.loop = loop;
            play = false;
            playBtn.click();
            this.style.backgroundPosition = '-69px -347px';
        } else {
            loop = false;
            this.style.backgroundPosition = '-6px -347px';
        }
    })
    
    //进度条end

    // 音量控制
    let volumeBtn = $get('#volumeBtn');
    let volumeControl = $get('#volumeControl');
    let volumeBar = $get('#volumeBar');
    let volumeProgress = $get('#volumeProgress');
    let volumeSpan = $get('#volumeSpan');
    let volume = audio.volume;

    // volume控制器的显示
    ifVolume = false;
    // 默认volume定位
    volumeBtn.addEventListener('click', function () {
        if (!ifVolume) {
            ifVolume = true;
            volumeControl.style.display = 'block';
            // 显示后获取音量控制条底部到网页顶部的距离加自身高度
            let volumeBarClientY = parseInt(volumeBar.getBoundingClientRect().top + volumeBar.offsetHeight);
            volumeChange(volumeBarClientY);
        } else {
            ifVolume = false;
            volumeControl.style.display = 'none';

        }
    })
    function volumeChange(volumeBarClientY) {
        volumeBar.addEventListener('mousedown', function (e) {
            //点击bar，让span定位
            let startY = parseInt(volumeBarClientY - e.clientY);//鼠标相对bar下端初始位置
            if (startY < 1) {
                startY = 1;
            } else if (startY > 85) {
                startY = 85;
            }
            volume = startY / 91;
            audio.volume = volume;
            volumeProgress.style.height = startY + 'px';
            volumeSpan.style.bottom = startY + 'px';
            // 按下后滑动鼠标，让span与progress移动移动
            this.onmousemove = function (e) {
                let barY = parseInt(volumeBarClientY - e.clientY);//鼠标相对于bar左端的位置
                if (barY < 1) {
                    barY = 1;
                } else if (barY > 85) {
                    barY = 85;
                }
                volume = barY / 91;
                audio.volume = volume;
                volumeProgress.style.height = barY + 'px';
                volumeSpan.style.bottom=barY + 'px';
            }
            this.onmouseup = function () {
                this.onmousemove = null;
                this.onmouseup = null;
            }
        })
    }
    
    // 相关控件设置start

})
