window.addEventListener('load', function () {
    let uid=1367105362;
    //获取听歌排行start
    let history=$get('#history');//btn
    let songList=$get('#songList');
    history.addEventListener('click',function(){
        ajax({
            url:'/user/record',
            data:{
                uid:1367105362,
                type:1
            },
            success:function(data){
                for(let i=0;i<data.weekData.length;i++){
                    let li=$create('li');
                    li.value=data.weekData[i].song.id;
                    let num=$create('span');
                    num.innerHTML=i+1+'.';
                    num.className='num';
                    let songName=$create('span');
                    songName.innerHTML=data.weekData[i].song.name;
                    songName.className='songName';
                    let songArt=$create('span');
                    songArt.innerHTML='-'+data.weekData[i].song.ar[0].name;
                    songArt.className='songArt';
                    li.appendChild(num);
                    li.appendChild(songName);
                    li.appendChild(songArt)
                    songList.appendChild(li);
                }
            }
        })
    })
    //获取听歌排行end

    //获取用户信息start(不需要登录，直接传递uid)
    let checkinfo=$get('#checkinfo');
    let userImg=$get('#userImg');
    let username=$get('#username');
    let level=$get('#level');
    let gender=$get('#gender');
    let province=$get('#province');
    let signature=$get('#signature');
    let listenSongs=$get('#listenSongs');
    let follows=$get('#follows');
    let followed=$get('#followed');
    let event=$get('#event');
    checkinfo.addEventListener('click',function(){
        if(uid==0){
            return alert('请先登录');
        }
        ajax({
            url:'/user/detail',
            data:{
                uid:uid
            },
            success:function(data){
                userImg.src=data.profile.avatarUrl;//显示图片
                username.innerHTML='名称:'+data.profile.nickname;
                level.innerHTML='等级：'+data.level;
                gender.innerHTML='性别：'+data.profile.gender;//0未知，1为男，2为女
                province.innerHTML='城市区域代码：'+data.profile.city;
                signature.innerHTML='个人介绍:'+data.profile.signature;
                listenSongs.innerHTML='听的歌曲：'+data.listenSongs;
                ajax({
                    url:'/user/follows',
                    data:{
                        uid:uid
                    },
                    success:function(data){
                        follows.innerHTML='关注：'+data.follow.length;
                    }
                });
                ajax({
                    url:'/user/followeds',
                    data:{
                        uid:uid
                    },
                    success:function(data){
                        followed.innerHTML='粉丝：'+data.followeds.length;
                    }
                });
                ajax({
                    url:'/user/event',
                    data:{
                        uid:uid
                    },
                    success:function(data){
                        event.innerHTML='动态：'+data.events.length;
                    }
                })
            }
        })
    })
    //获取用户信息详情end

    //获取用户歌单信息start
    let list=$get('#list');
    let subPlaylist=$get('#subPlaylist');
    let createdPlaylist=$get('#createdPlaylist');
    let created=0;//创建歌单的个数
    let checksong=$get('#checksong');
    checksong.addEventListener('click',function(){
        if(uid==0){
            return alert('请先登录');
        }
        ajax({//获取用户歌单收藏与创建数量
            url:'/user/subcount',
            success:function(data){
                created=data.createdPlaylistCount;
                createdPlaylist.children[0].innerHTML='我创建的歌单：'+created;
                subPlaylist.children[0].innerHTML='我收藏的歌单：'+data.subPlaylistCount;
                console.log(data);
                ajax({//获取用户歌单具体信息
                    url:'/user/playlist',
                    data:{
                        uid:uid
                    },
                    success:function(data){
                        console.log(data);
                        for(let i=0;i<created;i++){
                            let li=$create('li');
                            li.className='songsli';
                            let p=$create('p');
                            p.innerHTML=data.playlist[i].name;
                            let img=$create('img');
                            img.className='songsImg';
                            img.src=data.playlist[i].coverImgUrl;
                            li.appendChild(img);
                            li.appendChild(p);
                            createdPlaylist.appendChild(li);
                        }
                        for(let i=created;i<data.playlist.length;i++){
                            let li=$create('li');
                            li.className='songsli';
                            let p=$create('p');
                            p.innerHTML=data.playlist[i].name;
                            let img=$create('img');
                            img.className='songsImg';
                            img.src=data.playlist[i].coverImgUrl;
                            li.appendChild(img);
                            li.appendChild(p);
                            subPlaylist.appendChild(li);
                        }
                    }
                })
            }
        })
    })
    //获取用户歌单end
})