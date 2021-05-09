window.addEventListener('load', function () {
    let audio = $get('#audio');

    //控件start
    //播放与停止start
    let playBtn=$get('#playBtn');
    let play=false;
    playBtn.addEventListener('click',function(){
        play=rightChange(play);
        (play==true)?audio.play():audio.pause();
    })
    //播放与停止end
    //循环播放
    let loopBtn=$get('#loopBtn');
    let loop=false;
    loopBtn.addEventListener('click',function(){
        loop=rightChange(loop);
        audio.loop = loop;
        audio.play();
        play = true;
    })
    //控件end

    //进度条start
    let bar=$get('#bar');
    let progress=$get('#progress');
    let barSpan=$get('#barSpan');//滑块
    let timeInfo=$get('#timeInfo');//显示事件信息
    let duration=0;//总时间
    let currentTime=0;//当前时间
    let width=0;//progress长度(占比0-1)
    let barWidth=bar.clientWidth;//进度条总长度

    audio.addEventListener('durationchange',function(){//获取时间长度
        duration=parseInt(audio.duration);
    });        
    audio.addEventListener('timeupdate',function(){//获取时间
        currentTime=parseInt(audio.currentTime);
        width=currentTime/duration;
        progress.style.width=width*100+'%';
        timeInfo.innerHTML=timefy(currentTime)+' / '+timefy(duration);
    });
    bar.addEventListener('click',function(e){//点击bar，progress定位到点击位置,播放同步
        width=e.offsetX;
        progress.style.width=e.offsetX+'px';
        audio.currentTime=width/barWidth*duration;
        audio.play();//点击后自动播放
        play=true;//与播放按钮同步
    })
    //进度条end

    //交互start
    let searchBtn=$get('#searchBtn');
    let search=$get('#search');
    let musicRight=$get('#musicRight');
    let songsList=[];

    searchBtn.addEventListener('click',function(){
        let keywords=search.value;
        let songInfo={
            songId:0,
            songUrl:'',
            songName:'',
            songAr:'',//歌手名字
            songRight:true,
        };
        //ajax先获取歌曲信息，再具体网页操作
        ajax({
            url: '/cloudsearch',
            data: {
                keywords: keywords,
            },
            success: function (data) {//获取歌词的id,name,artist
                console.log(data);
                console.log(data.result.songs[0]);
                songInfo.songId = data.result.songs[0].id;
                songInfo.songName = data.result.songs[0].name;
                songInfo.songAr = data.result.songs[0].ar[0].name;
                //判断是否音乐有版权
                ajax({
                    url: '/check/music',
                    data: {
                        id: songInfo.songId,
                    },
                    //版权可用时将音乐id转为url并播放
                    success: function (data) {
                        console.log('success');
                        console.log(data);
                        songInfo.songRight = true;
                        ajax({
                            url: '/song/url',
                            data: {
                                id: songInfo.songId,
                            },
                            success: function (data) {
                                songInfo.songUrl = data.data[0].url;
                                audio.src=songInfo.songUrl;
                            }
                        })
                    },
                    //版权不可用时将返回false给songRight,并显示提示信息
                    error: function (data) {//404时执行error
                        console.log('error:');
                        console.log(data);
                        songInfo.songRight = false;
                        musicRight.style.display = 'block';
                        musicRight.innerHTML = data.message;
                    }
                });
                //获取完所有歌曲信息后，将songInfo添加到songsList数组
                songsList.push(songInfo);
                console.log(songsList);
                // let songsUl = $get('#songsUl');
                // console.log(songsList.children.length);
                // for (let i = 0; i < songsList.children.length; i++){
                    
                // }
                // let li=$create('li');
                // let songName=$create('span');
                // songName.innerHTML=songsList[0].songName;
                // let songAr=$create('span');
                // songAr.innerHTML=songsList[0].songAr;
                // let songRight=$create('span');
                // songRight.innerHTML=songsList[0].songRight;
                // li.appendChild(songName);
                // li.appendChild(songAr);
                // li.appendChild(songRight);
                // console.log(li);
            }
        });
    })
        
    //交互end
    //网页操作函数start
    // 生成播放列表start
    // function createSongsUl() {
            
    //     }
    // for(let i=0;i<songsList.length;i++){
    //     let li=$create('li');
    //     let songName=$create('span');
    //     songName.innerHTML=songsList[0].songName;
    //     let songAr=$create('span');
    //     songAr.innerHTML=songsList[0].songAr;
    //     let songRight=$create('span');
    //     songRight.innerHTML=songsList[0].songRight;
    //     li.appendChild(songName);
    //     li.appendChild(songAr);
    //     li.appendChild(songRight);
    //     console.log(li);
    // }
    //生成播放列表end
    //网页操作end

})
