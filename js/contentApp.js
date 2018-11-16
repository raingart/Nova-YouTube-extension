// 'use strict';
// console.log(i18n("app_name") + ": init app.js");
console.log(": init content.js");

const App = {
   DEBUG: true,

   // Register the event handlers.
   eventListener: (function () {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
         App.log("Message from the background script: %s", JSON.stringify(request));

         switch (request.action) {
            // case 'getOptions':
            //   let defaults = {};
            //   let resp = {};
            //   for (let key in defaults) {
            //       if (!(key in localStorage)) {
            //           localStorage[key] = defaults[key];
            //       }
            //       resp[key] = localStorage[key];
            //   }
            //   sendResponse(resp);
            // break;

            case 'setOptions':
               App.storage.set(request.options);

               // if (App.runned) App.run()
               // window.location.reload();
               sendResponse({
                  // reaction: "setOptions - ok"
                  reaction: "gotMessage"
               });
               break;

            case 'tabUpdated':
               // console.log('request.options %s', JSON.stringify(request.options));
               break;

            default:
               console.log('App eventListener switch default')
         }
      });

      // wait head page
      // window.addEventListener("DOMContentLoaded", () => {
      //    console.log('DOMContentLoaded');
      //    window.removeEventListener("DOMContentLoaded", null, null);
      // });

      // window.addEventListener("loadstart", function (evt) {
      //    if (!(evt.target instanceof window.HTMLMediaElement)) return;
      //    console.log("loadstart load");
      //    window.removeEventListener("loadstart", null, null);
      //    App.connect();
      // }, true);
   }()),

   getPageType: () => {
      // "*://www.youtube.com/watch?v=*",
      // "*://www.youtube.com/user/*",
      // "*://www.youtube.com/channel/*"
      let page = location.pathname.split('/')[1];
      return (page == 'channel' || page == 'user') ? 'channel' : page;
   },

   // sessionSettings: null,

   storage: {
      set: (options) => {
         App.sessionSettings = options;
         let apiKeys = [
            "AIzaSyA-dlBUjVQeuc4a6ZN4RkNUYDFddrVLxrA",
            "AIzaSyCXRRCFwKAXOiF1JkUBmibzxJF1cPuKNwA",
            "AIzaSyAgcQ6VzgBPjTY49pxeqHsIIDQgQ09Q4bQ"
         ];
         let getRandArrayItem = arr => arr[Math.floor(Math.random() * arr.length)];
         App.sessionSettings.api_key = getRandArrayItem(apiKeys);
      },

      load: (callback) => {
         chrome.runtime.sendMessage({
            action: 'getOptions'
         }, (resp) => {
            // if (callback && typeof (callback) === "function") {
            //    return callback();
            // }
         });
      }
   },

   init: () => {
      App.log('init');
      App.storage.load();

      PolymerYoutube.waitFor('head', function (element) {
         App.connect();
      });

      //so slow
      // let waitYT = setInterval(() => {
      //    App.log('init..');
      //    if (document.head) {
      //       clearInterval(waitYT);
      //       App.connect();
      //    }
      // }, 100);
   },

   connect: () => {
      App.log("connect");
      Plugins.load.sandbox();
      Plugins.load.direct_init();
      Plugins.load.direct();

      let waitYT = setInterval(() => {
         App.log('waitYT');
         if (App.sessionSettings && Object.keys(App.sessionSettings).length) {
            clearInterval(waitYT);

            // direct
            // Plugins.injectScript.in_direct("if (!plugins_run) var plugins_run = " + Plugins.run + ";", 'script');
            Plugins.injectScript.in_direct("plugins_run = " + Plugins.run + ";", 'script');

            // window.addEventListener("load", () => {
            // App.log("window load");
            window.addEventListener("yt-navigate-finish", () => {
               // App.log("yt-navigate-finish load");
               App.run();
            }, true);
         }
      }, 100);
   },

   run: () => {
      App.log('run');
      // sandbox
      Plugins.run(App.getPageType(), App.sessionSettings);

      // direct
      let plugins_execute = "plugins_run(" + JSON.stringify(App.getPageType()) + "," + JSON.stringify(App.sessionSettings) + ")";
      Plugins.injectScript.in_direct(plugins_execute, 'script');

      // Plugins.injectScript.in_direct("plugins_run2 = " + a1 + ";", 'script');
      // let plugins_execute2 = "plugins_run2()";
      // Plugins.injectScript.in_direct(plugins_execute2, 'script');
   },

   log: function (msg) {
      if (this.DEBUG) {
         for (let i = 1; i < arguments.length; i++) {
            msg = msg.replace(/%s/, arguments[i].toString().trim());
         }
         console.log('App: %s', msg);
      }
   },
}

App.init();













// var a1 = function (e) {
//    var isUnMuted = true;

//    player.addEventListener("onStateChange", function(event) {
//       console.log('onStateChange');
//         if( player.isMuted() && player.getPlayerState() == 2 && isUnMuted ) {
//          console.log('2');
//              player.unMute();
//              player.playVideo(); // resume playback
//              isUnMuted = false;  // you want to run this once only! 
//         }
//    });
// } 

// vid.setPlaybackQualityRange(player_quality);
// document.getElementById('movie_player').setPlaybackQuality(player_quality);
// document.getElementById('movie_player').setPlaybackQualityRange(player_quality);
// function playSpeed() {
//    document.getElementsByTagName("video")[0].playbackRate = 2; //WORKING
//    document.getElementById('movie_player').setPlaybackRate(2); //NOT WORKING
//    document.getElementById("movie_player").stopVideo(); //NOT WORKING
//    document.getElementById("movie_player").setPlaybackQuality('hd720'); //NOT WORKING
//    document.getElementById("movie_player").playVideo(); //NOT WORKING
// }


// function player_autoplay(playerAPI, player, playlist) {
//    DEBUG && console.log('player_autoplay');
//    var option = settings.player_autoplay;
//    var flash = (player.nodeName == 'EMBED');
//    var self = this;
//    var playVideo = null;
//    var htmlPlay = null;
//    var playClicked = 0;

//    if (option == 'enabled' || (option == 'playlist' && playlist)) {
//      player.playVideo();
//    } else if (option == 'disabled' || (option == 'playlist' && !playlist)) {
//      if (!flash) {
//        htmlPlay = HTMLVideoElement.prototype.play;
//        playVideo = player.playVideo;

//        player.playVideo = player.pauseVideo;
//        HTMLVideoElement.prototype.play = player.pauseVideo;
//        player.pauseVideo();
//        document.querySelector('#movie_player video').addEventListener('click', function() {
//          player.playVideo = playVideo;
//          HTMLVideoElement.prototype.play = htmlPlay;
//          playClicked = 1;
//        });
//        document.querySelector('.ytp-play-button').addEventListener('click', function() {
//          player.playVideo = playVideo;
//          HTMLVideoElement.prototype.play = htmlPlay;
//          if (playClicked == 0) {
//            document.querySelector('.ytp-play-button').click();
//            playClicked = 1;
//          }
//        });
//      }
//    }
//  }

// var buttons = document.getElementsByClassName("ytp-play-button");
// for (var i in buttons) {
//    buttons[i].click();
// }

// ytp-play-button ytp-button

// window.addEventListener('blur', function() {
//    var player = document.getElementById('movie_player');

//    // if (player && window.improvedtubex.video_autopause == 1)
//      player.pauseVideo();
//  });

/*window.addEventListener('focus', function() {
         var player = document.getElementById('movie_player');
     
         if (player && window.improvedtubex.video_autopause == 1)
           player.playVideo();
       });*/


// (function() {
//    'use strict';
//    console.log('Floating youtube init');
// })();

// document.addEventListener("webkitfullscreenchange", function () {
//    console.log('webkitfullscreenchange');
//    // var R = document.getElementById('PlayBackRatePanel');
//    // if (document.webkitIsFullScreen == true) {
//    //     R.className = "PlayBackRatePanelFullScreen";
//    // } else {
//    //     R.className = "PlayBackRatePanel";
//    // }
// }, false);

// document.addEventListener('DOMNodeInserted', function (R) {
//    //    var S = R.target || null;
//    //    if (S && S.nodeName === 'VIDEO') {
//    //       //  new p.videoController(S);
//    //       console.log('DOMNodeInserted');
//    //    }
//    // });
//    // if (p.settings.allowMouseWheel) {
//    //    document.addEventListener('mousewheel', function(R) {
//    //        if (R.shiftKey) {
//    //            if ('wheelDelta' in R) {
//    //                rolled = R.wheelDelta;
//    //                if (rolled > 0) P('faster');
//    //                else if (rolled < 0) P('slower');
//    //            }
//    //        }
// }, false);


// $(document).on("keydown", onKeyDown);
// $(document).on("scroll", onPageScroll);
