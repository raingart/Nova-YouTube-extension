// 'use strict';
// console.log(i18n("app_name") + ": init app.js");
console.log(": init content.js");

const App = {

   // DEBUG: true,

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

            // if options is update
            case 'setOptions':
               console.log('setOptions', JSON.stringify(request));

               App.storage.set(request.options);
               App.reversal_plugins(request.options);

               sendResponse({
                  reaction: "setOptions gotMessage"
               });
               break;

               // case 'tabUpdated':
               //    console.log('request.options', JSON.stringify(request.options));
               //    break;

            case 'sendMessage':
               console.log(request.message);
               break;

            default:
               console.log('App eventListener switch default')
         }
      });

      // DOM (HTML+CSS) ready
      // window.addEventListener("DOMContentLoaded", () => {
      //    console.log('DOMContentLoaded');
      //    // window.removeEventListener("DOMContentLoaded", null);
      // });

      // window.addEventListener("loadstart", function (evt) {
      //    console.log('loadstart');
      //    // if (!(evt.target instanceof window.HTMLMediaElement)) return;
      //    // console.log("loadstart load");
      //    // window.removeEventListener("loadstart", null);
      //    // App.connect();
      // }, true);

      // CSS ready
      // document.addEventListener('transitionend', function (event) {
      //    console.log('transitionend', JSON.stringify(event.target.id));
      //    // console.log('event.propertyName', event.propertyName);
      //    // if (event.target.id === 'progress')
      //    // if (event.propertyName == 'top')
      // });

      document.addEventListener('yt-navigate-start', function () {
         //    console.log('yt-navigate-start');
         //    // do stuff
         //    App.run.sandbox();
         //    App.run.direct();
         // });

         // document.addEventListener('yt-navigate-finish', function () {
         if (location.href != App.this_url) {
            App.this_url = location.href;
            // console.log('yt-navigate-finish');
            App.rerun();
         }
      });

      // document.addEventListener('yt-preconnect-urls', function () {
      //    console.log('yt-preconnect-urls');
      //    // if (App.rerun && typeof (App.rerun) === 'function') return App.rerun();
      //    App.rerun();
      // });
      // document.addEventListener('yt-action', function (a) {
      //    console.log('yt-action', JSON.stringify(a));
      //    // if (App.rerun && typeof (App.rerun) === 'function') return App.rerun();
      // });

      // document.addEventListener("webkitfullscreenchange", function () {
      //    console.log('webkitfullscreenchange');
      //    // var R = document.getElementById('PlayBackRatePanel');
      //    if (document.webkitIsFullScreen == true) {
      //       console.log('document.webkitIsFullScreen == true');
      //    }
      //    //     R.className = "PlayBackRatePanelFullScreen";
      //    // } else {
      //    //     R.className = "PlayBackRatePanel";
      //    // }
      // }, false);

      // window.addEventListener('blur', function () {
      //    console.log('window blur');
      // });

      // window.addEventListener('focus', function () {
      //    console.log('window focus');
      // });
      // window.addEventListener('yt-preconnect-urls', function () {
      //    console.log('yt-preconnect-urls');
      // });


      // window.addEventListener("message", function (event) {
      //    // console.log('message', event.source);
      //    // if (event.source !== window) return;
      //    if (event.source !== window) console.warn('message warn');

      //    if (event.data.type) {
      //       console.log('event.data.value;', JSON.stringify(event.data.value));
      //    }
      // });

      // window.dispatchEvent(new Event("resize"));
      //getEventListeners(window)
      //getEventListeners(document)
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
      set: options => {
         App.log('storage.set: %s', JSON.stringify(options));

         App.sessionSettings = options;
         let apiKeys = [
            "AIzaSyA-dlBUjVQeuc4a6ZN4RkNUYDFddrVLxrA",
            "AIzaSyCXRRCFwKAXOiF1JkUBmibzxJF1cPuKNwA",
            "AIzaSyAgcQ6VzgBPjTY49pxeqHsIIDQgQ09Q4bQ"
         ];
         let getRandArrayItem = arr => arr[Math.floor(Math.random() * arr.length)];
         App.sessionSettings.api_key = getRandArrayItem(apiKeys);
      },

      load: callback => {
         // exclude re-receive settings
         chrome.runtime.sendMessage({
            action: 'getOptions'
         }, resp => {
            // if (callback && typeof (callback) === 'function') return callback(resp);
         });
      }
   },

   ready: {},

   reversal_plugins: st => {
      if (st && Object.keys(st).length && st['restart-app'] &&
         (App.ready.sandbox || App.ready.direct)
      ) {
         console.log('reversal setting');

         if (st['restart-app'] === 'soft') {
            console.log('soft restart');
            // Plugins.injectScript.in_direct('_plugins = []', 'script');
            // App.rerun();
            // App.run.sandbox();

         } else if (st['restart-app'] === 'full') {
            window.location.reload();
         }
      }
   },
   // reversal_plugins: e => {
   //    if (App.sessionSettings &&
   //       Object.keys(App.sessionSettings).length &&
   //       App.sessionSettings['restart-app']) {

   //       console.log('reversal setting');

   //       if (App.sessionSettings['restart-app'] === 'soft') {
   //          // Plugins.injectScript.in_direct('_plugins = []', 'script');
   //          // App.rerun();
   //          // App.run.sandbox();

   //       } else if (App.sessionSettings['restart-app'] === 'full') {
   //          window.location.reload();
   //       }
   //    }
   // },

   rerun: () => {
      // skip first run on page load
      // if (App.ready.sandbox && App.ready.direct) {
      App.log('page transition');
      // setTimeout(() => {
      App.run.sandbox();
      // App.run.direct();
      // }, 500);
      // }
   },

   this_url: location.href,

   init: () => {
      App.log('init');
      App.storage.load();

      //sandbox
      Plugins.load.sandbox();
      let sandbox_wait_loaded = setInterval(() => {
         // wait load sandbox plugins
         if (App.sandbox_loaded && _plugins.length) {
            App.log("sandbox_wait_loaded load %s %s", App.sandbox_loaded, _plugins.length);
            // wait load setting
            if (App.sessionSettings && Object.keys(App.sessionSettings).length) {
               clearInterval(sandbox_wait_loaded);
               App.run.sandbox();

               // // access to rerun
               App.ready.sandbox = true;
            }
         }
      }, 50);

      //direct
      PolymerYoutube.waitFor('head', function (element) { // wait head tag
         Plugins.load.direct_init();
         Plugins.load.direct();

         let waitYT = setInterval(() => {
            App.log('waitYT');
            // wait load setting
            if (App.sessionSettings && Object.keys(App.sessionSettings).length) {
               clearInterval(waitYT);

               Plugins.injectScript.in_direct("plugins_run = " + Plugins.run, 'script');
               App.run.direct();

               // // access to rerun
               App.ready.direct = true;
            }
         }, 50);
      });
   },

   run: {
      sandbox: () => {
         App.log('run sandbox');
         // sandbox
         Plugins.run(App.getPageType(), App.sessionSettings);
      },

      direct: () => {
         App.log('run direct');
         let plugins_execute = function (a, x) {
            return "_plugins_run = setInterval(() => {\
               if (_plugins.length) {\
               clearInterval(_plugins_run);\
               plugins_run(" + a + ',' + x + ");\
               }\
            }, 100)";
         };

         // run in new setting
         Plugins.injectScript.in_direct(
            plugins_execute(
               JSON.stringify(App.getPageType()),
               JSON.stringify(App.sessionSettings)
            ), 'script');
      },
   },

   log: function (msg) {
      if (this.DEBUG) {
         for (let i = 1; i < arguments.length; i++) {
            msg = msg.replace(/%s/, arguments[i].toString().trim());
         }
         console.log('App:', msg);
      }
   },
}

App.init();












// elm.addEventListener("click auxclick contextmenu", function (e) {
//    e.preventDefault();
//    console.log(e.which);
//    console.log(e.type);

//    if (e.type == "contextmenu") {
//       console.log("Context menu prevented.");
//       return;
//    }

//    switch (e.which) {
//       case 1:
//          //window.location = $(this).attr('href');
//          console.log("ONE");
//          break;
//       case 2:
//          //window.open($(this).attr('href'));
//          console.log("TWO");
//          break;
//       case 3:
//          console.log("THREE");
//          break;
//    }
//    window.scrollTo(0, 0);
// });


// playerId.pauseVideo();
// if (playerId.getPlayerState() != 1) {
//    playerId.playVideo();
//  } else {
//    playerId.pauseVideo();
//  }


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
