// for test - https://www.youtube.com/c/miyanomamoru/featured

window.nova_plugins.push({
   id: 'channel-trailer-stop-preload',
   // title: 'Stop channel trailer playback',
   title: 'Stop play channel trailer',
   'title:zh': '停止频道预告片',
   'title:ja': 'チャンネルの予告編を停止する',
   'title:ko': '채널 예고편 중지',
   'title:id': 'Hentikan cuplikan saluran',
   'title:es': 'Detener el tráiler del canal',
   'title:pt': 'Parar o trailer do canal',
   'title:fr': 'Arrêter la bande-annonce de la chaîne',
   'title:it': 'Interrompi il trailer del canale',
   // 'title:tr': 'Kanal fragmanını durdur',
   'title:de': 'Kanaltrailer stoppen',
   'title:pl': 'Zatrzymaj zwiastun kanału',
   'title:ua': 'Не відтворювати трейлер каналу',
   run_on_pages: 'channel, -mobile',
   restart_on_location_change: true,
   section: 'channel',
   // desc: '',
   _runtime: user_settings => {

      NOVA.waitElement('#c4-player')
         .then(player => player.stopVideo());

   },
});
