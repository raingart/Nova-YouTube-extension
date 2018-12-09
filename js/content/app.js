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
               // console.log('setOptions', JSON.stringify(request));

               App.storage.set(request.options);
               App.reversal_plugins(request.options);

               sendResponse({
                  reaction: "setOptions gotMessage"
               });
               break;

               case 'tabUpdated':
                  // console.log('request.url', JSON.stringify(request.url));
                  // App.rerun();
                  break;

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

      // document.addEventListener('yt-preconnect-urls', function () {
      //    console.log('yt-preconnect-urls');
      //    // if (App.rerun && typeof (App.rerun) === 'function') return App.rerun();
      //    App.rerun();
      // });
      // document.addEventListener('yt-action', function (a) {
      //    console.log('yt-action', JSON.stringify(a));
      //    // if (App.rerun && typeof (App.rerun) === 'function') return App.rerun();
      // });

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

      document.addEventListener('yt-navigate-start', function () {
         // console.log('yt-navigate-start');
         // skip first run on page load
         if (location.href != App.this_url) {
            App.this_url = location.href;
            App.rerun();
         }
      });

      // document.addEventListener('yt-navigate-finish', function () {
      // console.log('yt-navigate-finish');
      // });
   }()),

   this_url: location.href,

   // new_url: () => {
   //    App.this_url = App.this_url == location.href ? App.this_url : location.href;
   //    return 
   // },

   getPageType: () => {
      // "*://www.youtube.com/watch?v=*",
      // "*://www.youtube.com/user/*",
      // "*://www.youtube.com/channel/*"
      // "*://www.youtube.com/results?search_query=*"
      // "*://www.youtube.com/playlist?list=PL*"
      let page = location.pathname.split('/')[1];
      App.log('page type', page);
      return (page == 'channel' || page == 'user') ? 'channel' : page || null;
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

   reversal_plugins: sessionSettings => {
      if (sessionSettings && Object.keys(sessionSettings).length && sessionSettings['restart-app']) {
         console.log('reversal setting');

         if (sessionSettings['restart-app'] === 'soft') {
            console.log('soft restart');
            // Plugins.injectScript.in_direct('_plugins = []', 'script');
            // App.rerun();

         } else if (sessionSettings['restart-app'] === 'full') {
            window.location.reload();
         }
      }
   },

   rerun: () => {
      console.log('page transition');
      // App.log('page transition');

      Plugins.injectScript("_plugins = [];");
      Plugins.load(
         Plugins_list.one_off_dependent
         .concat(Plugins_list.one_off)
         .concat(Plugins_list.plugins_end)
      );

      setTimeout(() => {
         App.run();
      }, 500);
   },

   init: () => {
      App.log('init');
      App.storage.load();

      // load all Plugins
      Plugins.load((() => {
         let pl = [];
         for (i in Plugins_list) {
            for (p of Plugins_list[i]) pl.push(p);
         }
         return pl;
      })());

      let sandbox_wait_loaded = setInterval(() => {
         // wait load setting
         if (App.sessionSettings && Object.keys(App.sessionSettings).length) {
            clearInterval(sandbox_wait_loaded);
            App.run();
         }
      }, 50);
   },

   run: () => {
      App.log('run');

      // if onYouTubePlayerReady is ready before init = ALL BROKEN
      // let plugins_execute = function (a, x) {
      //    return "//window.onYouTubePlayerReady = function (player) {\
      //          //console.log('onYouTubePlayerReady');\
      //          //if (!player) return;\
      //          _plugins_run = setInterval(() => {\
      //             if (_plugins.length) {\
      //                clearInterval(_plugins_run);\
      //                plugins_run(" + a + ',' + x + ");\
      //             }\
      //          }, 50)\
      //       //}";
      // };

      let preparation_for_execute = function (a, x) {
         // return "var plugins_run=" + Plugins.run + ";\
         return "plugins_run=" + Plugins.run + ";\
               _plugins_run = setInterval(() => {\
                  if (_plugins.length && plugins_loading) {\
                     clearInterval(_plugins_run);\
                     plugins_run(" + a + "," + x + ");\
                     plugins_loading = false;\
                  }\
               }, 100)";
      };

      Plugins.injectScript(
         preparation_for_execute(
            JSON.stringify(App.getPageType()),
            JSON.stringify(App.sessionSettings)
         )
      );
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




// https://developers.google.com/youtube/iframe_api_reference

// try {
//    let a = PolymerYoutube.search_xpath(".//*[@id='toggleButton']")
//    console.log('a', JSON.stringify(a.snapshotItem(0)));
//    console.log('a', a.snapshotItem(0));
// } catch (error) {
//    console.log('error search_xpath', error);
// }



// function is_fullscreen() {
//    return !!document.getElementById('movie_player').classList.contains('ytp-fullscreen');
// }



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


// var a1 = function (e) {
//    var isUnMuted = true;

//    player.addEventListener("onStateChange", function(event) {
//       console.log('onStateChange');
//         if( player.isMuted() && player.getPlayerState() == 2 && isUnMuted ) {
//              console.log('2');
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
