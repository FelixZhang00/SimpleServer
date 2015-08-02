var vcss = document.createElement('style');
vcss.textContent="@-webkit-keyframes nodeInserted{from{outline-color:#fff}to{outline-color:#000}}video{-webkit-animation-duration:0.01s;-webkit-animation-name:nodeInserted}\
@-webkit-keyframes nodeInserted_flash{from{outline-color:#fff}to{outline-color:#000}}embed{-webkit-animation-duration:0.01s;-webkit-animation-name:nodeInserted_flash}object{-webkit-animation-duration:0.01s;-webkit-animation-name:nodeInserted_flash}";
vcss.type = "text/css";
vcss.id = '__ks_css_video';


if(document.location.host.match(/pptv/)){
    vcss = document.createElement('style');
    vcss.textContent="@-webkit-keyframes nodeInserted{from{outline-color:#fff}to{outline-color:#000}}video{-webkit-animation-duration:0.01s;-webkit-animation-name:nodeInserted}\
    @-webkit-keyframes nodeInserted_frame{from{outline-color:#fff}to{outline-color:#000}}iframe{-webkit-animation-duration:0.01s;-webkit-animation-name:nodeInserted_frame}frame{-webkit-animation-duration:0.01s;-webkit-animation-name:nodeInserted_frame}";
    vcss.type = "text/css";
    vcss.id = '__ks_css_video';
}

 var isvalid_video_source = function(playurl){

        var ret = true;
        try{
            var x = undefined;
            if (/\.qq\.com/i.test(playurl)){
                x = document.querySelector(".mod_player_tips").textContent;
                if((x&&x.indexOf("分钟")<0) && ( x && x.indexOf("观看完整版")<0)){
                    // debug_print('source is valid');
                    x = null;
                }
            }else if (/\.youku\.com/i.test(playurl)){
                x = document.querySelector(".txt").childNodes[1].textContent;
                var y = document.querySelector(".btn-maj").childNodes[0].textContent;
                if((x&&x.indexOf("分钟预览")<0) && (y&&y.indexOf("观看完整版")<0)){
                    // debug_print('source is valid');
                }else{
                    if (x == undefined){
                        x = y;
                    }
                }
            }else if(/\.tudou\.com/i.test(playurl)){
                //x = document.querySelector(".panel-body").childNodes[0].textContent;
                x = document.querySelector(".app-info").childNodes[0].textContent;
                var y = document.querySelector(".app-full").childNodes[0].textContent;
                if((x&&x.indexOf("网页只给看")<0)&&(y && y.indexOf("看完整版")<0)){                    
                    // debug_print('source is valid');
                }else{
                    if (x == undefined){
                        x = y;
                    }
                }
            }else if (/\.pptv\.com/i.test(playurl)){
                x = document.querySelector(".tip").childNodes[1].textContent;
                var y = document.querySelector(".viewall").textContent;
                if((x&&x.indexOf("分钟预览")<0)&&(y && y.indexOf("看完整版")<0)){                    
                    // debug_print('source is valid');
                }else{
                    if (x == undefined){
                        x = y;
                    }
                }                
             }
            //else if (/m1905\.com/i.test(playurl)){
            //     return false;
            // }else if (/m.letv.com/i.test(playurl)){
            //     if(/m.letv.com\/live\//.test(document.URL)){
            //          return false;
            //     }
            // }else if (/kankan.com/i.test(playurl)){                
            //     return false;
            // }
            // else if (/youtube\.com/.test(playurl)){
            //     return false;
            // }
            
            if(x&&x!=undefined){
                ret=false;
            };
        }catch(e){
            ret = true;
        };

        return ret;
    }



var flashdectected = function(event){
    var flashobj = event.srcElement;
    if(flashobj&&flashobj.type
        &&flashobj.type.match(/application/)
        &&flashobj.type.match(/flash/)){

        var width = flashobj.offsetWidth; 
        var height = flashobj.offsetHeight;
        if(width&&height&&width>100&&height>100){
             if(typeof(__ks) != 'undefined') {
                __ks.onFlashElementFound(document.URL);
            }
        }
        return true;
    }
    return false;
}

var playvideo = function(param_obj){
    try{
        __ks.play_source(JSON.stringify(param_obj));
        return true;
    }catch(e){
    }
    return false;
}

var is_secret_video = function()
{
     var playview = document.getElementById('playView');
     if (typeof(playview) != 'undefined') {
        var allinput =  document.evaluate(
             "//input[@class='pw-input']",
             playview,
             null,
             XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
             null);
        if (allinput.snapshotLength > 0) {
            return true;
        };
     };
    return false;
}

var skipadvideo = function(videoparam,is_ad){
    try{
    if(window.__ks_current_video
        &&window.__ks_current_video.vsrc.videourl==videoparam.data.urls[0].videourl
    ){
        if(videoparam.data.urls.length>1
            &&is_ad.retcode==0
            &&window.__ks_current_video.is_ad
            &&window.__ks_current_video.ad_end_times>0){
            videoparam.data.urls.splice(0,__ks_current_video.ad_end_times);
            if(window.__ks_current_video.ad_end_times==window.__ks_current_video.ad_number){
                videoparam.data.urls[0].seekpos 
                    = window.__ks_current_video.seekpos;
            }
        }
        else if(videoparam.data.urls.length==1
            &&is_ad.retcode!=0
            &&(!window.__ks_current_video.is_ad)){

            videoparam.data.urls[0].seekpos 
                = window.__ks_current_video.seekpos;
        }
    }else{
        var ad_number = 0;
        for(var i=0;i<videoparam.data.urls.length;i++){
            if(videoparam.data.urls[i].is_advertise){
                ad_number=ad_number+1;
            }
        }
        window.__ks_current_video = {
            'vsrc':videoparam.data.urls[0],
            'is_ad':is_ad.retcode==0,
            'ad_end_times':0,
            'ad_number':ad_number,
            'seekpos':0
        }
    }
    }catch(e){
    }
}


var hookplay = function(event){
    var dochost = document.location.host;
    if(!(   dochost.match(/v\.youku\.com/)  
            || dochost.match(/ifeng\.com/) 
            || dochost.match(/t\.m\.cctv\.com/)
            || dochost.match(/m\.iqiyi\.com/)
            || dochost.match(/m\.56\.com/)
            || dochost.match(/m\.tv\.sohu\.com/)
            || dochost.match(/m\.sohu\.com/)
            || dochost.match(/v\.qq\.com/)
            || dochost.match(/\.3g\.qq\.com/)
            || dochost.match(/xw\.qq\.com/)
            || dochost.match(/m\.letv\.com/)
            || dochost.match(/m\.ku6\.com/)
            || dochost.match(/m\.v1\.cn/)
            || (dochost.match(/\.tudou\.com/)&&!document.URL.match(/recommend/))
            || dochost.match(/m\.pps\.tv/)
            || dochost.match(/www\.wasu\.cn/)
            || dochost.match(/m\.fun\.tv/)
            || dochost.match(/\.sina\.cn/)
            || dochost.match(/\.3g\.cn/)
            || dochost.match(/3g\.163\.com/)
            || dochost.match(/inews\.qq\.com/)
            || dochost.match(/zhibo\.cmcm\.com/)
            || dochost.match(/zjstv\.com/)
            || dochost.match(/hunantv\.com/)
            || dochost.match(/pptv\.com/)
            || dochost.match(/cdna\.mobile\.youjizz\.com/)

        )
    ){

        return;
    }
    var myvideo = event.srcElement;
    var ishooked = myvideo.getAttribute('ishooked');
    if(typeof(ishooked)=='string'&&ishooked=='true'){
        return;
    }
    myvideo.setAttribute('ishooked',true);
    myvideo.ori_play = myvideo.play;
    myvideo.controls = false;
    myvideo.pause();
    myvideo.onclick = function(e){
        this.play();
    };
    myvideo.removeAttribute('autoplay');
    if(dochost.match(/v\.youku\.com/)){
        var youkuplay = function(e){
            myvideo.youku_user_clicked = true;
            myvideo.play();
        }
        var playbtn = document.getElementById('x-video-button'); 
        if(playbtn){
            playbtn.addEventListener('click',function(e){
                setTimeout(youkuplay,300);
            });
        }
        var triger = document.getElementsByClassName('x-trigger');
        if(triger.length==1){
            triger = triger[0];
            triger.addEventListener('click',function(e){
                setTimeout(youkuplay,300);
            });
        }
    }else if(dochost.match(/m\.iqiyi\.com/)){
        if(document.URL.match(/m\.iqiyi\.com\/find\/hotSpot/)){
            setTimeout(function(){
                myvideo.iqiyi_user_clicked = true;
                myvideo.play();
            },500);
        }
        var plybtn = document.getElementById('player-bigBtn');
        if(plybtn){
            plybtn.ontouchstart = function(e){
                e.preventDefault();
                e.stopPropagation();
                var poster = document.getElementById('player-poster');
                if(poster){
                    poster.style.display = 'block';
                }
                myvideo.iqiyi_user_clicked = true;
                myvideo.play();
            };
        }
        var fuls = document.getElementsByClassName('ff-fullScreen');
        if(fuls.length==1){
            var ful = fuls[0];
            ful.onclick = function(e){
                e.preventDefault();
                e.stopPropagation();
                myvideo.iqiyi_user_clicked = true;
                myvideo.play();
            };
        }
        var poster = document.getElementById('player-poster');
        if(poster){
            poster.style.display = 'block';
        }

    }else if(dochost.match(/m\.56\.com/)){
        var plybtn = document.getElementById('statusTips_m_player_playStatus');
        if(plybtn){
            plybtn.style.display='block';
        }
        var pausebtn = document.getElementById('statusTips_m_player_pauseStatus');
        if(pausebtn){
            pausebtn.style.display='none';
        }
        var bar_m_player = document.getElementById('bar_m_player');
        if(bar_m_player){
            bar_m_player.style.display='none';
        }
        var m_player = document.getElementById('m_player');//statusTips_m_player
        if(m_player){
            m_player.addEventListener('click'
                ,function(e){
                    myvideo.m56_user_clicked = true;
                    myvideo.play();
            });
        }
    }else if(document.URL.match(/m\.tv\.sohu\.com\/hots/)){
        var button_plays = document.getElementsByClassName('button_play');
        for(var i=0;i<button_plays.length;i++){
            var btn = button_plays[i];
            btn.addEventListener('click',function(){
                myvideo.sohu_user_clicked = true;
            });
        }
    }
    if(dochost.match(/m\.tv\.sohu\.com/)||dochost.match(/m\.sohu\.com/)){
        var loadbtn = document.getElementsByClassName('state_loading');
        if(loadbtn.length==1){
            loadbtn=loadbtn[0];
            loadbtn.setAttribute('class','state_play');
        }
        var pausebtns = document.getElementsByClassName('state_pause');
        if(pausebtns.length==2){
            var pausebtn=pausebtns[0];
            pausebtn.setAttribute('class','state_play');
            pausebtn=pausebtns[0];
            pausebtn.setAttribute('class','state_play');
        }
        var playbtns = document.getElementsByClassName('state_play');
        if(playbtns.length>1){
            var len = playbtns.length;
            for(var i=0;i<len;i++){
                var playbtn=playbtns[i];
                playbtn.ontouchend = function(e){
                    myvideo.sohu_user_clicked = true;
                    myvideo.play();
                }
            }
        }
        var poster = document.getElementsByClassName('svp_poster');
        if(poster.length>0){
            poster = poster[0];
            poster.setAttribute('class','poster svp_poster');
        }
        var playbtn = document.getElementsByClassName('play_pause_con');
        if(playbtn.length==1){
            playbtn = playbtn[0];
            playbtn.onclick = function(e){
                myvideo.sohu_user_clicked = true;
                myvideo.play();
            }
        }
        var player_controls = document.getElementsByClassName('player_controls');
        if(player_controls.length==1){
            player_controls = player_controls[0];
            player_controls.onclick = function(e){
                myvideo.sohu_user_clicked = true;
                myvideo.play();
            }
        }
        var poster = document.getElementsByClassName('svp_poster');
        if(poster.length>0){
            poster = poster[0];
            poster.setAttribute('class','poster svp_poster');
        }
        $('.slider_bar').addClass('hide');
        setTimeout(function(){
            $('.slider_bar').remove();
        },1000);
        setInterval(function(){
            var playbtn = document.getElementsByClassName('play_pause_con');
            if(playbtn.length==1){
                playbtn = playbtn[0];
                playbtn.style.display='block';
                playbtn.style.opacity='1';
            }
            var svp_mid_play = document.getElementsByClassName('svp_mid_play');
            if(svp_mid_play.length==1){
                svp_mid_play = svp_mid_play[0];
                svp_mid_play.style.display='block';
            }
            $('.video_title').removeClass('hide');
        },400);
    }else if(dochost.match(/v\.qq\.com/)||dochost.match(/inews\.qq\.com/)){
        if(typeof(tvp)=='undefined'||!tvp){
            return;
        }
        tvp.Html5UI.prototype.enterFullScreen = function(){}
        tvp.Html5UI.prototype.cancelFullScreen = function(){}
        setInterval(function(){
            var tvp_overlay_play = document.getElementsByClassName('tvp_overlay_play');
            tvp_overlay_play = tvp_overlay_play[0];
            var parent = tvp_overlay_play.parentNode;
            parent.removeChild(tvp_overlay_play);
            parent.appendChild(tvp_overlay_play);
        },500);
        var __ks_qqclick = function(e){
            myvideo.qq_user_clicked = true;
            myvideo.play();
            e.preventDefault();
            e.stopPropagation();
        }
        var playbtns  = document.getElementsByClassName('tvp_button_play');
        if(playbtns.length==1){
            var playbtn  = playbtns[0];
            playbtn.addEventListener('touchend',__ks_qqclick);
        }
        var overlays  =document.getElementsByClassName('tvp_overlay_play');
        if(overlays.length==1){
            var overlay  = overlays[0];
            overlay.addEventListener('touchend',__ks_qqclick);
        }
        var tvpbtns  =document.getElementsByClassName('tvp_btn_value');
        if(tvpbtns.length>0){
            for(var i=0;i<tvpbtns.length;i++){
                var tvpbtn  = tvpbtns[i];
                tvpbtn.addEventListener('touchend',__ks_qqclick);
            }
        }
        var buttons = document.getElementsByTagName('button');
        for(var i=0;i<buttons.length;i++){
            if(buttons[i].title=='切换全屏'){
                var btn = buttons[i];
                btn.addEventListener('touchend',__ks_qqclick);
                break;
            }
        }
    }else if(dochost.match(/m\.letv\.com/)){
        var poster = document.getElementsByClassName('hv_play_poster');
        if(poster.length==1)
        {
            poster = poster[0];
            poster.style.display = 'block';
            poster.addEventListener('touchend',function(e){
                myvideo.letv_user_clicked = true;
                myvideo.play();
            });
            myvideo.pause();
        }
        var hv_play_bg = document.getElementsByClassName('hv_play_bg');
        if(hv_play_bg.length>0){
            hv_play_bg = hv_play_bg[0]; 
            hv_play_bg.style.display='block';
            hv_play_bg.addEventListener('touchend',function(e){
                myvideo.letv_user_clicked = true;
                        myvideo.play();
            });
            myvideo.pause();
        }
        window.__ks_letvtimerid = setInterval(
            function(){
                var btn_a_resume = document.getElementsByClassName('hv_ico_pasued');

                if(btn_a_resume.length>0){
                    btn_a_resume = btn_a_resume[0];
                    btn_a_resume.addEventListener('touchend',function(e){
                        myvideo.letv_user_clicked = true;
                        myvideo.play();
                    });
                    clearInterval(window.__ks_letvtimerid);
                }
            },500);
    }else if(dochost.match(/m\.ku6\.com/)){
        setInterval(
            function(){
                myvideo.controls=false;
            },
            400);
        var fullscreen_btn = document.getElementById('KP_fullscreen_btn');
        if(fullscreen_btn){
           var parentDiv =  fullscreen_btn.parentNode;
           parentDiv.parentNode.removeChild(parentDiv);
        }
        
        var video = document.getElementById('video');
        if(video){
            video.style.height='240px';
        }
        var video = document.getElementById('video');
        var lastc = video.lastChild;
        if(lastc.tagName.toLowerCase()=='div'){
            video.removeChild(lastc);
        }
        var inputs = document.getElementsByTagName('input');
        var i=0;
        var flag = true;
        for(i=0;i<inputs.length;i++){
            var one = inputs[i];
            if(one.type&&one.type=='image'){
                one.style.display='block';
                one.onclick = function(e){
                }
                flag = false;
            }
        }
        if(flag){
            var inputimage = document.createElement('input');
            inputimage.src = 'http://m.ku6.com/statics/kplayer/img/play.png';
            inputimage.type ='image';
            inputimage.style.position='absolute'; 
            inputimage.style['z-index']='1003'; 
            inputimage.style['width']='60px'; 
            inputimage.style['height']='60px'; 
            inputimage.style['margin-left']='-30px'; 
            inputimage.style['margin-top']='-30px'; 
            inputimage.style['top']='50%'; 
            inputimage.style['left']='50%';
            video.appendChild(inputimage);
            inputimage.addEventListener('click',function(e){myvideo.play()});
        }
    }else if(dochost.match(/\.tudou\.com/)){
        if(is_secret_video()){
            myvideo.setAttribute('ishooked',false);
            return;
        }
        var playBtn = document.getElementById('playView');
        if(playBtn){
            playBtn.addEventListener('click',function(e){
                myvideo.tudou_user_clicked = true;
                myvideo.play();
            });
        }
        var touch = document.getElementsByClassName('touch');
        if(touch.length==1){
            touch = touch[0];
            touch.addEventListener('move',function(e){
                window.__ks_tudou_move = true;
            });
            touch.addEventListener('touchend',function(e){
                if(window.__ks_tudou_move){
                    return;
                }
                window.__ks_tudou_move = false;
                myvideo.tudou_user_clicked = true;
                myvideo.play();
            });
        }
        var btn = document.getElementsByClassName('play-btn');
        if (btn.length == 1) {
            btn = btn[0];
            btn.onclick = function(e){
                myvideo.play();
            };
        };
        var loading = document.getElementsByClassName('loading');
        if(loading.length>0){
            loading = loading[0];
            loading.parentNode.removeChild(loading);
        }
        setInterval(function(){
           var btn = document.getElementsByClassName('play-btn');
           if(btn.length==1){
                btn = btn[0];
                btn.style.display='block';
           }else if(btn.length==0){
                var div = document.createElement('div');
                var i = document.createElement('i');
                i.setAttribute('class','icon-play');
                div.setAttribute('class','play-btn');
                div.setAttribute('style','display:block');
                div.appendChild(i);
                $('#playView')[0].appendChild(div);
           }
           var poster = document.getElementsByClassName('poster');
           if(poster.length==1){
                poster = poster[0];
                poster.style.display='block';
           }
        },1000);
    }else if(dochost.match(/www\.wasu\.cn/)){

        coverElement(myvideo,myvideo,1,0.5,null,99999999,'wasu_user_clicked');

        var deleteControl = function(){
            myvideo.pause();
            myvideo.setAttribute('preload','none');
            myvideo.removeAttribute('autoplay');
            myvideo.controls = false;
        }
        deleteControl();
        setInterval(deleteControl,1000);
        var player = document.getElementById('player');
        if(player){
            player.addEventListener('click',function(e){
                myvideo.wasu_user_clicked = true;
                myvideo.play();
            });
        }
    }else if(dochost.match(/ifeng\.com/)){
        var ifengplay = function(){
            myvideo.ifeng_user_clicked = true;
            myvideo.play();
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        var video01Pl = document.getElementById('video01Pl');
        if(video01Pl){
            video01Pl.onclick = ifengplay;
        }
        var video01btn = document.getElementById('video01but');
        if(video01btn){
            video01btn.onclick = ifengplay;
        }
        myvideo.onclick = ifengplay;
        var vifeng_player_console = document.getElementsByClassName('vifeng_player_console');
        if(vifeng_player_console.length==1){
            vifeng_player_console = vifeng_player_console[0];
            vifeng_player_console.parentNode.removeChild(vifeng_player_console);
        }
        var vifeng_video_Btnplaye = document.getElementsByClassName('vifeng_video_Btnplaye');
        if(vifeng_video_Btnplaye.length==1){
            vifeng_video_Btnplaye = vifeng_video_Btnplaye[0];
            vifeng_video_Btnplaye.addEventListener('touchend',function(e){setTimeout(ifengplay,300);});
        }
        var vifeng_player_touch = document.getElementsByClassName('vifeng_player_touch');
        if(vifeng_player_touch.length==1){
            vifeng_player_touch = vifeng_player_touch[0];
            vifeng_player_touch.addEventListener('touchend',function(e){setTimeout(ifengplay,300);});
        }
    }else if(dochost.match(/m\.fun\.tv/)){
        coverElement(myvideo,myvideo,1,0.5,null,99999999,'funtv_user_clicked');
    }else if(dochost.match(/m\.pps\.tv/)){
        var play = document.getElementsByClassName('play-area');
        if(play.length==1){
            play = play[0];
            play.addEventListener('click',function(e){
                myvideo.pps_user_clicked = true;
                myvideo.play();
            });
        }

        var play = document.getElementsByClassName('player-panel');
        if(play.length==1){
            play = play[0];
            play.addEventListener('click',function(e){
                e.preventDefault();
                e.stopPropagation();
                myvideo.pps_user_clicked = true;
                myvideo.play();
            });
        }


    }else if(dochost.match(/3g\.163\.com/)){
        setInterval(function(){
            var v = document.getElementById('video');
            var video_top = v.offsetTop;
            var video_left = v.offsetLeft;
            var video_width = v.offsetWidth;
            var video_height = v.offsetHeight;


            var vv = document.getElementsByClassName('play-btn')[0]
            var vv_width = vv.offsetWidth;
            var vv_height = vv.offsetHeight;

            vv.style.top = (video_top+video_height/2-vv_height/2)+'px';
            vv.style.left = (video_left+video_width/2-vv_width/2)+'px';
        },400);
    }else if(dochost.match(/cdna\.mobile\.youjizz\.com/)){
        coverElement(myvideo,myvideo,1,0.5);
        setTimeout(function(){
            myvideo.play();
        },100);
    }else if(dochost.match(/zjstv\.com/)){
        coverElement(myvideo,myvideo,1,0.5);
    }else if(dochost.match(/hunantv\.com/)){
        coverElement(document.getElementById('live-play')
        ,myvideo,1,0.5,myvideo.getAttribute('poster'),100);
    }else if(dochost.match(/m\.v1\.cn/)){
        coverElement(myvideo,myvideo,1,0.5);
    }else if(dochost.match(/xw\.qq\.com/)){
        coverElement(myvideo,myvideo,1,0.5);
    }else if(dochost.match(/\.sina\.cn/)){
        myvideo.__ks_video_sina_height = myvideo.offsetHeight;
        setInterval(function(){
            try{
                if(myvideo.offsetHeight!=myvideo.__ks_video_sina_height&&
                    window.onorientationchange){
                    window.onorientationchange();
                    myvideo.__ks_video_sina_height = myvideo.offsetHeight;
                }
            }
            catch(e){
            }
        },500);
        coverElement(myvideo,myvideo,1,0.5,myvideo.getAttribute('poster'),100);
    }else if(dochost.match(/t\.m\.cctv\.com/)){
        coverElement(myvideo,myvideo,1,0.5);
    }

    myvideo.play = function(e){
        var dochost = document.location.host;
        var vsrc = this.src;
        if(!vsrc || vsrc.length == 0){
            var source = this.firstElementChild;
            if(source){
                vsrc = source.src;
                if(vsrc==document.URL&&!dochost.match(/cdna\.mobile\.youjizz\.com/)){
                    vsrc='';
                }
            }
        }
        if(isvalid_video_source(document.URL)==false)
        {  
            vsrc="";
        }
        var videoparam = {
            'version':'1.0',
            'key':'',
            'data':{
                   'weburl':document.URL,
                   'title':document.title,
                   'is_force_parse':false,
                   'urls': []
               }
    
        };
        var param_obj = {'webUrl':document.URL, 'videoUrl':vsrc, 'duration':this.duration,'host':dochost};
        var is_ad = detect_video_ad(param_obj);
        var handled = false;
        if(dochost.match(/v\.youku\.com/)){
            if(!this.youku_user_clicked||vsrc.length==0){
                if(vsrc.length==0){
                    var button_play = document.getElementById('x-video-button');
                    if(button_play&&button_play.style.display=='none'){
                        var loading = document.getElementsByClassName('x-video-loading');
                        if(loading.length==1){
                            loading = loading[0];
                            loading.style.display='block';
                        }
                    }
                }
                return;
            }
            this.youku_user_clicked = false;
            this.pause();
            if(is_ad.retcode == 0){
                var gug_src = vsrc;
                if(BuildVideoInfo&&BuildVideoInfo.mp4srcs&&BuildVideoInfo.mp4srcs.length>0){
                    if(BuildVideoInfo.mp4srcs.length==1){
                        vsrc = BuildVideoInfo.mp4srcs[0];
                    }else{
                        var d = (new Date()).getTime()+'';
                        d = d.substr(0,d.length-3);
                        vsrc = 'http://v.youku.com/player/getM3U8/vid/'+videoId+'/type/m3u8/ts/'+d+'/v.m3u8';
                    }
                }
                if(gug_src.length>10){
                    videoparam.data.urls.push({'videourl':gug_src,'is_advertise':true});
                }
            }
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});

            skipadvideo(videoparam,is_ad);            
            handled = playvideo(videoparam);
            var poster = document.getElementsByClassName('x-video-poster');
            if(poster.length==1){
                poster=poster[0];
                poster.style.display='block';
            }
        }else if(dochost.match(/ifeng\.com/)){
            if(!this.ifeng_user_clicked){
                return;
            }
            this.ifeng_user_clicked = false;
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/t\.m\.cctv\.com/)){
            this.pause();
            if(typeof(html5VideoData)=='string'&&html5VideoData.length>10){
                try{
                    var m3u8src = JSON.parse(html5VideoData);
                    if(m3u8src.hls_url&&m3u8src.hls_url.indexOf('.m3u8')>-1){
                        vsrc = m3u8src.hls_url;
                    }
                }catch(e){}
            }
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/m\.iqiyi\.com/)){
            if(!this.iqiyi_user_clicked){
                return;
            }
            if(document.URL.indexOf('m.iqiyi.com/find/hotSpot')>-1){
                if(this.src.length==0){
                    this.iqiyi_user_clicked = true;
                    setTimeout(this.play,200);
                    return;
                }
            }
            this.iqiyi_user_clicked=false;
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/m\.56\.com/)){
            if(!this.m56_user_clicked){
                return;
            }
            this.m56_user_clicked=false;
            this.removeAttribute('autoplay');
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/m\.tv\.sohu\.com/)||dochost.match(/m\.sohu\.com/)){
            if(!this.sohu_user_clicked){
                return;
            }
            this.sohu_user_clicked = false;
            this.pause();
            if(document.URL.indexOf('hots')>-1){
                videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            }else{
                if(is_ad.retcode == 0){
                    var gug_src = vsrc;
                    if(typeof(xmlData)!='undefined'&&xmlData){
                        var regexp = /<duration>[\d:]+<\/duration>\s*<mediaFiles>.*?CDATA\[.*?\.mp4.*?><\/mediaFiles>/gi;
                        var gugs = xmlData.match(regexp);
                        if(gugs&&gugs.length>0){
                            for(var i=0;i<gugs.length;i++){
                                var gug = gugs[i];
                                var gug_video = gug.match(/\[http[^\]]+\.mp4\]/);
                                var gug_duration = gug.match(/>[\d:]+</);
                                if(gug_video&&gug_video.length==1&&gug_duration&&gug_duration.length==1){
                                    gug_video = gug_video[0];
                                    gug_duration = gug_duration[0];
                                    if(gug_video.indexOf('[')==0){
                                        gug_video = gug_video.replace('[','');
                                        gug_video = gug_video.replace(']','');
                                    }
                                    if(gug_duration.indexOf('>')==0){
                                        gug_duration = gug_duration.replace('<','');
                                        gug_duration = gug_duration.replace('>','');
                                    }
                                }
                                console.log(gug_video);
                                
                                gug_duration = gug_duration.split(':')[2];
                                gug_duration = gug_duration*1000;
                                console.log(gug_duration);
                                videoparam.data.urls.push({'videourl':gug_video,'duration':gug_duration,'is_advertise':true});
                            }
                        }
                    }
                }
                var vurls = VideoData.urls;
                vsrc = '';
                if(vurls){
                    if(vurls.mp4){
                        var mp4srcs = VideoData.urls.mp4;
                        if(mp4srcs.hig&&mp4srcs.hig.length==1){
                            vsrc = mp4srcs.hig[0];
                        }else if(mp4srcs.nor&&mp4srcs.nor.length==1){
                            vsrc = mp4srcs.nor[0];
                        }else if(mp4srcs.sup&&mp4srcs.sup.length==1){
                            vsrc = mp4srcs.sup[0];
                        }
                    }
                    if(vsrc.length==0&&vurls.downloadUrl){
                        vsrc = vurls.downloadUrl[0];
                    }
                    if((vsrc.length==0||VideoData.total_duration>600)&&vurls.m3u8){
                        var m3u8urls = VideoData.urls.m3u8;
                        if(m3u8urls.hig){
                            vsrc = m3u8urls.hig[0];
                        }else if(m3u8urls.nor){
                            vsrc = m3u8urls.nor[0];
                        }else if(m3u8urls.sup){
                            vsrc = m3u8urls.sup[0];
                        }
                    }
                    videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
                }
            }

            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/v\.qq\.com/)||dochost.match(/inews\.qq\.com/)){
            var tip = document.querySelector(".mod_player_tips");
            if(tip){
                this.__ks_qqlimited = true;
            }
            if(!this.qq_user_clicked){
                return;
            }
            this.qq_user_clicked = false;
            this.pause();
            var tip = document.querySelector(".mod_player_tips");
            if(tip){
                vsrc = '';
            }
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/m\.letv\.com/)){
            if(!this.letv_user_clicked){
                return;
            }
            this.letv_user_clicked = false;
            this.pause();
            if(is_ad.retcode==0){
                videoparam.data.urls.push({'videourl':vsrc,'is_advertise':true});
                videoparam.data.urls.push({'videourl':'','is_advertise':false});
            }else{
                videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            }
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/m\.ku6\.com/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/m\.v1\.cn/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            handled = playvideo(videoparam);
        }else if(dochost.match(/\.tudou\.com/)){
            if(!this.tudou_user_clicked){
                return;
            }
            this.tudou_user_clicked = false;
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/m\.pps\.tv/)){
            if(!this.pps_user_clicked){
                return;
            }
            this.pps_user_clicked = false;
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/www\.wasu\.cn/)){
             if(!this.wasu_user_clicked){
                return;
            }
            this.wasu_user_clicked = false;
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/\.3g\.qq\.com/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/m\.fun\.tv/)){
            if(!this.funtv_user_clicked){
                return;
            }
            this.funtv_user_clicked = false;
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/\.sina\.cn/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/xw\.qq\.com/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/\.3g\.cn/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/3g\.163\.com/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);

            handled = playvideo(videoparam);
        }else if(dochost.match(/zhibo\.cmcm\.com/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            handled = playvideo(videoparam);
        }else if(dochost.match(/zjstv\.com/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/hunantv\.com/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/pptv\.com/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            skipadvideo(videoparam,is_ad);
            handled = playvideo(videoparam);
        }else if(dochost.match(/cdna\.mobile\.youjizz\.com/)){
            this.pause();
            videoparam.data.urls.push({'videourl':vsrc,'is_advertise':false});
            handled = playvideo(videoparam);
        }

        if (handled) {
            this.isLBPlayer = true;
        } else {
            this.isLBPlayer = false;
            this.ori_play();
        }
    }
}

var playevent = function(event) {
    var hasRecord = false;
    var myvideo = event.srcElement;
    myvideo.addEventListener('play', 
           function(e){
            var currentVideo = e.srcElement;
            if(typeof(currentVideo.isLBPlayer)!='undefined'&&currentVideo.isLBPlayer){
                return;
            }
            var weburl = document.URL;           
            setTimeout(function() {
                if(typeof(__ks) != 'undefined' && typeof(__ks.onVideoPlay) == 'function') {
                    var weburl = document.URL;
                    var host = document.location.host;
                    var vsrc = currentVideo.src;
                    if(!vsrc || vsrc.length == 0){
                        var source = currentVideo.firstChild;
                        if(source){
                            vsrc = source.src;
                        }
                    }
                    var param_obj = {'webUrl':weburl, 'videoUrl':vsrc, 'duration':currentVideo.duration,'host':host};
                    var is_ad = detect_video_ad(param_obj);
                    if(is_ad.retcode > 0) {
                        if(host.indexOf(".hunantv.com") > 0) {
                            var videoTitle = document.getElementById('appTitle');
                            var title = "";
                            if (videoTitle) {
                               title = videoTitle.textContent; 
                            }
                            if (title) {
                                title = title + "-" + document.title;
                            } else {
                                title = document.title;
                            }
                            
                            __ks.onVideoPlay(weburl, vsrc, title, currentVideo.currentTime, currentVideo.duration);
                        } else {
                          __ks.onVideoPlay(weburl, vsrc, document.title, currentVideo.currentTime, currentVideo.duration);
                        }
                        hasRecord = true;
                    } else {
                        console.log("__ks parse is AD");
                    }
                } else { console.log("__ks parse failed ");}
            }, 1000 * 5);  
        }
    );
    
    myvideo.addEventListener('pause', 
        function(e) {
            if (hasRecord) {
                var currentVideo = e.srcElement;
                if(typeof(currentVideo.isLBPlayer)!='undefined'&&currentVideo.isLBPlayer){
                    return;
                }
                if(typeof(__ks) != 'undefined' && typeof(__ks.onVideoPause) == 'function') {
                    __ks.onVideoPause(currentVideo.currentTime, currentVideo.duration);
                }
            }
        }
    );
};

function detect_video_ad(param) {

    var retcode = -1;
    var retdata = '#undefined#';
    
   if ('undefined' == typeof(param)) {
      return { 'retcode': -1, 'retdata':'ERROR_PARAM_NULL'}
    }

    if ('object'!= typeof(param)) {
      return { 'retcode': -2, 'retdata':'ERROR_PARAM_IS_NOT_JSON_OBJECT'}
    }
    if (param.host && param.host.indexOf("letv.com") > 0) {
        if (param.videoUrl && param.videoUrl.length > 10) {
            if (param.videoUrl.match("/letv\-gug/")) {
                retcode = 0;
                retdata = 'OK';
            } else {
                retcode = 1;
                retdata = 'IS_NOT_AD';
            }
        } else {
            if (param.duration < 31 * 1000) {
                retcode = 0;
                retdata = 'OK';
            } else {
                retcode = 1;
                retdata = 'IS_NOT_AD';
            }
        }
    }else if(param.host && param.host.indexOf('m.tv.sohu.com')>-1){
        var videourl = param.videoUrl;
        if(param.duration > 60*1000){
            retcode = 1;
            retdata = 'IS_NOT_AD';
        }else if(videourl&&videourl.length>10){
            if(videourl.match(/advEFId=/i)){
              retcode = 0;
              retdata = 'OK';
            }else{
              retcode = 1;
              retdata = 'IS_NOT_AD';
            }
        }else{
            retcode = 1;
            retdata = 'IS_NOT_AD';
        }
    }
    else if(param.host && param.host.indexOf("youku.com")>-1){
          var videourl = param.videoUrl;
          if(videourl&&videourl.length>10){
            if(videourl.match(/ctype=10/)){
              retcode = 0;
              retdata = 'OK';
            }else{
              retcode = 1;
              retdata = 'IS_NOT_AD';
            }
          }else{
              retcode = 1;
              retdata = 'IS_NOT_AD';
          }
    }
    else if (param.host && (param.host.indexOf("m1905.com") >= 0 || param.host.indexOf("m1905.cn") >= 0) && param.duration < 31) {
        retcode = 0;
        retdata = 'OK';
    } else {
        retcode = 1;
        retdata = 'IS_NOT_AD';
    }
    return { 'retcode': retcode, 'retdata': retdata};
}

var webkitAnimationStart_listener = function(event){
    if(event.animationName=='nodeInserted'){
        hookplay(event);
        playevent(event);
    }
    else if(event.animationName == 'nodeInserted_flash'){
        flashdectected(event);
    }
}


var webkitAnimationEnd_listener = function(event){
    if(event.animationName == 'nodeInserted_frame'){
        var frame = event.srcElement;
        setTimeout(function(){injectcss2frame(frame);},300);
    }
}

var injectcss2frame = function(frame){

    try{
        var fd = frame.contentDocument;
        if(fd.readyState=='interactive'||fd.readyState=='complete'){
            fd.addEventListener('webkitAnimationStart', webkitAnimationStart_listener, false);
            fd.body.appendChild(vcss);
        }else{
            setTimeout(function(){injectcss2frame(frame);},300);
        }
    }catch(e){
    }
}
var change_youku_orientation = function(){
    try{
        if(ykPlayerH5&&typeof(ykPlayerH5.switchFullScreen)=='function'){
            ykPlayerH5.ori_switchFullScreen = ykPlayerH5.switchFullScreen;
            ykPlayerH5.switchFullScreen = function(e){};
            var zoomin = document.getElementsByClassName('x-zoomin');
            if(zoomin.length==1){
                zoomin = zoomin[0];
                zoomin.onclick =  
                    function(e){ 
                        var video = document.getElementById('youku-html5player-video');
                        if(video){
                            video.youku_user_clicked = true;
                            video.play();
                        }
                        e.stopPropagation();
                    }
            }
            if(window.__ks_youkutimer){
                clearInterval(window.__ks_youkutimer);
            }
        }
    }catch(e){

    }
}

var change_show_youkuvideo = function(){
    try{
        var video = document.getElementById('youku-html5player-video');
        if(video){    
            video.style.display='block';
            var hookfunc = function(e){
                var video = e.srcElement;
                var hooked = video.getAttribute('ishooked');
                if(typeof(hooked)=='string'&&hooked=='yes'){
                    return;
                }else{
                    hookplay({'srcElement':video});
                    video.youku_user_clicked = true;
                    video.play();
                }
                video.removeEventListener('play',hookfunc);
            }
            video.addEventListener('play',hookfunc);
            if(window.__ks_youkutimer2){
                clearInterval(window.__ks_youkutimer2);
            }      
        }
    }catch(e){

    }
}

var show_youku_playbtn = function(){
    try{
        if(BuildVideoInfo&&BuildVideoInfo.mp4srcs&&BuildVideoInfo.mp4srcs.length>0){
            var vbtn = document.getElementById('x-video-button');
            if(vbtn){
                vbtn.style.display='block';
                clearInterval(window.__ks_youkutimer3);
            }
        }
    }catch(e){
    }
}

var adjustTudouView = function(){
    var as = document.getElementsByTagName('A');
    for (var i = 0; i < as.length; i++) {
        var v = as[i];
        if((v.href&&!v.getAttribute('href2'))&&v.href.indexOf('tudou.com')>-1){
            v.onclick = function(e) {
                document.location.href = e.srcElement.getAttribute('href2');
            }
            v.setAttribute('href2',v.getAttribute('href'));
            v.removeAttribute('href');
        }
    }
    var v = document.getElementById('video')
    if(!v.src||v.src.length==0){
        return;
    }
    if(document.getElementById('privateForm')){
        return;
    }
    var playview = document.getElementById('playView');
    playview&&(playview.style.height='202.5px');
} 


var hooktudouByTimer = function(){
    var v = document.getElementById('video')
    if(!v.src||v.src.length==0){
        return;
    }
    if(document.getElementById('privateForm')){
        return;
    }

    var v = document.getElementById('video');
    if(v){
        var ishooked = v.getAttribute('ishooked');
        if(!ishooked||ishooked=='false'){
            hookplay({srcElement:v});
            return;
        }
        window.__ks_tudoutimerid2&&clearInterval(window.__ks_tudoutimerid2);
    }
}


var showvifengvideo = function(){
    var vifeng_video_videoContainer = document.getElementsByClassName('vifeng_video_videoContainer');
    if(vifeng_video_videoContainer.length==1){
        vifeng_video_videoContainer = vifeng_video_videoContainer[0];
        vifeng_video_videoContainer.style.display='block';
        if(window.__ks_vifengtimerid){
            clearInterval(window.__ks_vifengtimerid);
        }
    }
}

var change_show_iqiyivideo = function(){
    try{
        var video = document.getElementById('video');
        if(video){
            video.style.display='block';
            if(window.__ks_iqiyitimer){
                clearInterval(window.__ks_iqiyitimer);
            }
        }
    }catch(e){

    }
} 



var change_3g_cn = function(){
    try{
        var videoImg = document.getElementsByClassName('videoImg')
        if(videoImg.length>0){
            for (var i = videoImg.length - 1; i >= 0; i--) {
                if(typeof(videoImg[i].changed)!='undefined'){
                    continue;
                }
                videoImg[i].addEventListener('click',function(e){
                    var src = e.srcElement.parentNode.getAttribute('data-videosrc');
                    if(src&&src.length>10){
                        var videoparam = {
                            'version':'1.0',
                            'key':'',
                            'data':{
                                   'weburl':document.URL,
                                   'title':document.title,
                                   'is_force_parse':false,
                                   'urls': [{'videourl':src,'is_advertise':false}]
                               }
                    
                        };
                        skipadvideo(videoparam,{retcode:1});
                        playvideo(videoparam);
                    }
                    e.preventDefault();
                    e.stopPropagation()
                });
                videoImg[i].changed = true;
            };
            if(window.__ks_3gcntimer){
                clearInterval(window.__ks_3gcntimer);
            }
        }
    }catch(e){

    }
}


var hook_sina_cn = function(){
    try{
        var video = document.getElementById('video');
        if(video&&!video.getAttribute('hooked')){
            hookplay({srcElement:video});
            if(window.__ks_sinacntimer){
                clearInterval(window.__ks_sinacntimer);
            }
        }else if(!video){
            return;
        }else if(video.getAttribute('hooked')=='true'){
            if(window.__ks_sinacntimer){
                clearInterval(window.__ks_sinacntimer);
            }
        }
    }catch(e){

    }
}


var getTop = function(e) {
    var offset = e.offsetTop;
    return offset;
}
var getLeft = function(e) {
    var offset = e.offsetLeft;
    return offset;
}

var coverElement = function (e,video,opacity,btnscale,poster,zindex,userclick){
    try{ 
        var top = getTop(e);
        var left = getLeft(e);
        var width = e.offsetWidth;
        var height = e.offsetHeight;
        if(document.URL.indexOf('m.hunantv.com')>-1){
            height = width*0.5625;
            e.style.height = height+'px';
        }
        var div = document.createElement('div');
        div.style.top = top + "px";
        div.style.left = left + "px";
        div.style.width = width + "px";
        div.style.height = height + "px";
        if(poster&&poster.length>5){
            div.style['background']='url('+poster+')';
            div.style['background-size']=width+'px '+height+'px';
        }else{
            div.style['background-color']='black';
        }
        
        div.style.position='absolute';
        div.style.opacity = opacity;
        div.id = '__ks_cover_1';
        div.style['z-index'] = zindex?zindex+1:999999;
        e.parentNode.appendChild(div);
        var plybtn = document.createElement('div');
        plybtn.style['-webkit-transform']='scale('+btnscale+')';
        plybtn.style.width = '162px';
        plybtn.style.height = '162px';
        plybtn.style.top = top+(height-162)/2 + "px";
        plybtn.style.left = left+(width-162)/2 + "px";
        plybtn.style.position='absolute';
        plybtn.id='__ks_cover_2';
        plybtn.style.opacity = 1;
        plybtn.style['z-index'] = zindex?zindex+1:999999;
        plybtn.style.background = 'url(http://m.liebao.cn/ios/public/akbm_mediacontroller_center_play.png)';
        e.parentNode.appendChild(plybtn);
        div.addEventListener('click',function(ee){
            userclick&&(video[userclick] = true);
            video.play();
        });
        plybtn.addEventListener('click',function(ee){
            userclick&&(video[userclick] = true);
            video.play();
        });
        if(!window.hooked_onorientationchange){
            window.hooked_onorientationchange = true;
            window.ori_onorientationchange = window.onorientationchange;
        }
        window.onorientationchange = function(event){
            if(window.ori_onorientationchange){
                window.ori_onorientationchange(event);
            }
            var revcover = function(){
                try{
                    if(e.offsetWidth){
                        var __ks_cover_1 = document.getElementById('__ks_cover_1');
                        var __ks_cover_2 = document.getElementById('__ks_cover_2');
                        __ks_cover_1.parentNode.removeChild(__ks_cover_1);
                        __ks_cover_2.parentNode.removeChild(__ks_cover_2);
                        coverElement(e,video,opacity,btnscale,poster,zindex,userclick); 
                    }
                }catch(e1){
                }
            }
            setTimeout(revcover,400);
            setTimeout(revcover,800);
            setTimeout(revcover,1200);
        }
    }catch(e2){
    }
}

var injectcss = function(){
    if(document.readyState=='interactive'||document.readyState=='complete'){
        if(document.getElementById('__ks_css_video')){
            return;
        }
        try{
            if(document.URL&&document.URL.indexOf('v.youku.com/v_show')>-1){
                change_youku_orientation();
                window.__ks_youkutimer = setInterval(change_youku_orientation,200);
                change_show_youkuvideo();
                window.__ks_youkutimer2 = setInterval(change_show_youkuvideo,300);
                window.__ks_youkutimer3 = setInterval(show_youku_playbtn,800);
            }else if(document.URL&&document.URL.indexOf('m.iqiyi.com')>-1){
                change_show_iqiyivideo();
                window.__ks_iqiyitimer = setInterval(change_show_iqiyivideo,500);
            }else if(document.URL&&document.URL.indexOf('www.tudou.com/programs/')>-1
                ||document.URL.indexOf('www.tudou.com/albumplay/')>-1
                ||document.URL.indexOf('www.tudou.com/listplay/')>-1){
                adjustTudouView();
                window.__ks_tudoutimerid = setInterval(function(e){
                    adjustTudouView();
                },500);
                window.__ks_tudoutimerid2 = setInterval(hooktudouByTimer,300);
            }else if(document.URL.indexOf('v.ifeng.com')>-1){
                showvifengvideo();
                window.__ks_vifengtimerid = setInterval(function(e){
                    showvifengvideo();
                },500);
            }else if(document.URL.indexOf('.3g.cn')>-1){
                change_3g_cn();
                window.__ks_3gcntimer = setInterval(change_3g_cn,500);
            }else if(document.URL.indexOf('.sina.cn')>-1){
                window.__ks_sinacntimer = setInterval(hook_sina_cn,500);
            }
            document.addEventListener('webkitAnimationStart', webkitAnimationStart_listener, false);
            document.addEventListener('webkitAnimationEnd', webkitAnimationEnd_listener, false);
            document.body.appendChild(vcss);
            setTimeout(injectcss,300);
        }catch(e){
            setTimeout(injectcss,100);
        }
    }else{
        setTimeout(injectcss,100);
    }
}

// 将其它方法全部移至此命名空间内
var __ks_player = {
    //onquit
    postevent : function(key, event, extra) {
        try{
            var dochost = document.location.host
            if(event=='onquit'){
                if(window.__ks_current_video
                    &&extra
                    &&  (
                        window.__ks_current_video.ad_end_times==window.__ks_current_video.ad_number
                        &&window.__ks_current_video.is_ad
                            ||
                        !window.__ks_current_video.is_ad
                        )
                    ){
                    window.__ks_current_video.seekpos = extra;
                }

                if(dochost.match(/v\.youku\.com/)){
                    var poster = document.getElementsByClassName('x-video-poster');
                    if(poster.length==1){
                        poster = poster[0];
                        poster.style.display = 'block';
                    }

                    var loading = document.getElementsByClassName('x-video-loading');
                    if(loading.length==1){
                        loading = loading[0];
                        loading.style.display='none';
                    }

                    var button_play = document.getElementById('x-video-button');
                    if(button_play){
                        button_play.style.display = 'block';
                    }

                    var controls = document.getElementsByClassName('x-controls');
                    if(controls.length==1){
                        controls = controls[0];
                        controls.style.display = 'none';
                    }
                }
                if(dochost.match(/m\.iqiyi\.com/)){
                    var playbtncCotainer = document.getElementById('player-bigBtnCotainer');
                    playbtncCotainer&&playbtncCotainer.setAttribute('class','mod-video_button');
                    var playbtn = document.getElementById('player-bigBtn');
                    playbtn&&playbtn.setAttribute('playsign','play');
                    var poster = document.getElementById('player-poster');
                    if(poster){
                        poster.style.display = 'block';
                    }
                }else if(dochost.match(/m\.56\.com/)){
                    var plybtn = document.getElementById('statusTips_m_player_playStatus');
                    if(plybtn){
                        plybtn.style.display='block';
                    }
                    var pausebtn = document.getElementById('statusTips_m_player_pauseStatus');
                    if(pausebtn){
                        pausebtn.style.display='none';
                    }
                    var bar_m_player = document.getElementById('bar_m_player');
                    if(bar_m_player){
                        bar_m_player.style.display='none';
                    }
                    var vgaHtml = document.getElementById('vgaHtml');
                    if(vgaHtml){
                        if(vgaHtml._ks_click_processed){
                            return;
                        }
                        vgaHtml._ks_click_processed = true;
                        vgaHtml.addEventListener('click',function(e){
                            var vgas = document.getElementsByName('vga_radio');
                            if(vgas.length>0){
                                for(var i=0;i<vgas.length;i++){
                                    vga = vgas[i];
                                    vga.addEventListener('click',function(e){
                                        if(plybtn){
                                            plybtn.style.display='block';
                                        }
                                        if(pausebtn){
                                            pausebtn.style.display='none';
                                        }
                                        if(bar_m_player){
                                            bar_m_player.style.display='none';
                                        }
                                        var cover_m_player = document.getElementById('cover_m_player');
                                        if(cover_m_player){
                                            cover_m_player.style.display='block';
                                        }
                                        var cover_m_player_title = document.getElementById('cover_m_player_title');
                                        if(cover_m_player_title){
                                            cover_m_player_title.style.display='block';
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                else if(dochost.match(/tudou\.com/)){
                    window.__ks_tudoutimerid&&clearInterval(window.__ks_tudoutimerid);
                    window.document.location.reload();
                }else if(dochost.match(/m\.ku6\.com/)){
                    setTimeout(function(){  
                        try{
                            var video = document.getElementById('video');
                            var lastc = video.lastChild;
                            if(lastc.tagName.toLowerCase()=='div'){
                                video.removeChild(lastc);
                            }
                            var inputs = document.getElementsByTagName('input');
                            var i=0;
                            for(i=0;i<inputs.length;i++){
                                var one = inputs[i];
                                if(one.type&&one.type=='image'){
                                    one.style.display='block';
                                    one.src = one.src.replace('pause','play');
                                }
                            }
                        }catch(e){
                        }                      
                    },300)
                }else if(dochost.match(/m\.pps\.tv/)){
                    var player = document.getElementsByClassName('player-default');
                    if(player.length==1){
                        player = player[0];
                        player.style.display = 'block';
                    }

                    var playimg = document.getElementsByClassName('play-img');
                    if(playimg.length==1){
                        playimg = playimg[0];
                        playimg.style.display = 'block';
                    }
                }else if(dochost.match(/ifeng\.com/)){
                    var adVideo = document.getElementById('adVideo');
                    adVideo&&(adVideo.controls = false);
                }else if(dochost.match(/m\.letv\.com/)){
                    var poster = document.getElementsByClassName('hv_play_poster');
                    if(poster.length==1){
                        poster = poster[0];
                        poster.style.display = 'block';
                    }
                    var hv_play_bg = document.getElementsByClassName('hv_play_bg');
                    if(hv_play_bg.length>0){
                        hv_play_bg = hv_play_bg[0]; 
                        hv_play_bg.style.display='block';
                    }
                }else if(dochost.match(/m\.fun\.tv/)){
                    setTimeout(
                        function(){
                            try{
                                var plybtn = document.getElementsByClassName('video-start');
                                plybtn.length==1?plybtn=plybtn[0]:plybtn=null;
                                plybtn&&(plybtn.style.display='block');
                                var ctrlbtn = document.getElementsByClassName('html5-video-control');
                                ctrlbtn.length==1?ctrlbtn=ctrlbtn[0]:ctrlbtn=null;
                                ctrlbtn&&(ctrlbtn.style.display='none');
                                var loadingbtn = document.getElementsByClassName('video-loading');
                                loadingbtn.length==1?loadingbtn=loadingbtn[0]:loadingbtn=null;
                                loadingbtn&&(loadingbtn.style.display='none');
                                if(window.onorientationchange){
                                    window.onorientationchange();
                                }
                            }catch(e){}
                        },1000
                    )
                }else if(dochost.match(/pptv\.com/)){
                    if(document.URL.match(/m\.pptv\.com\/show\//)){
                        setTimeout(function(){
                            try{
                                var frame = document.getElementsByTagName('iframe');
                                if(frame.length==1){
                                    frame = frame[0];
                                    var fd = frame.contentDocument;
                                    var btn = fd.getElementsByClassName('p-video-button');
                                    if(btn.length==1){
                                        btn = btn[0];
                                        btn.setAttribute('class','p-video-button go');
                                        btn.style.display = 'block';
                                    }
                                }
                            }catch(e){}
                        },300);
                    }
                }else if(dochost.match(/cdna\.mobile\.youjizz\.com/)){
                    setTimeout(function(){
                        if(window.onorientationchange){
                            window.onorientationchange();
                        }
                    },500);
                }else if(dochost.match(/zjstv\.com/)){
                    setTimeout(function(){
                        if(window.onorientationchange){
                            window.onorientationchange();
                        }
                    },500);
                }else if(dochost.match(/hunantv\.com/)){
                    setTimeout(function(){
                        if(window.onorientationchange){
                            window.onorientationchange();
                        }
                    },500);
                }else if(dochost.match(/m\.v1\.cn/)){
                    setTimeout(function(){
                        if(window.onorientationchange){
                            window.onorientationchange();
                        }
                    },500);
                }else if(dochost.match(/xw\.qq\.com/)){
                    setTimeout(function(){
                        if(window.onorientationchange){
                            window.onorientationchange();
                        }
                    },500);
                }else if(dochost.match(/\.sina\.cn/)){        
                    setTimeout(function(){
                        if(window.onorientationchange){
                            window.onorientationchange();
                        }
                    },500);
                }
            }else if(event=='onend'){
                if(window.__ks_current_video
                    &&window.__ks_current_video.is_ad
                    &&window.__ks_current_video.ad_end_times<window.__ks_current_video.ad_number){
                    window.__ks_current_video.ad_end_times = __ks_current_video.ad_end_times + 1;
                }
            }
        }catch(e){
        }
    }
};
injectcss();
