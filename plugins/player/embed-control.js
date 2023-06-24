// for test
// https://www.youtube.com/embed/u3JP5UzZbiI?enablejsapi=1&playerapiid=pljs_yt_YouTube10069&html5=1&start=0&disablekb=1&autohide=1&playsinline=1&iv_load_policy=3&controls=0&showinfo=0&modestbranding=1&rel=0&autoplay=0&loop=0&origin=https%3A%2F%2Fsmall-games.info&widgetid=1

window.nova_plugins.push({
   id: 'embed-show-control-force',
   title: 'Force enable control panel in embed',
   'title:zh': '埋め込みでコントロール パネルを強制的に有効にする',
   'title:ja': '强制启用嵌入的控制面板',
   'title:ko': '임베디드에서 강제 활성화 제어판',
   'title:id': 'Paksa aktifkan panel kontrol di sematan',
   'title:es': 'Forzar habilitar el panel de control en incrustar',
   'title:pt': 'Forçar ativação do painel de controle na incorporação',
   'title:fr': "Forcer l'activation du panneau de contrôle dans l'intégration",
   'title:it': "Forza l'abilitazione del pannello di controllo nell'incorporamento",
   // 'title:tr': '',
   'title:de': 'Erzwingen Sie die Aktivierung des Bedienfelds in der Einbettung',
   'title:pl': 'Wymuś włączenie panelu sterowania w osadzeniu',
   'title:ua': 'Примусово показувати панель керування у вбудованому відео',
   run_on_pages: 'embed',
   section: 'player',
   _runtime: user_settings => {

      // if (NOVA.queryURL.has('controls'))
      if (['0', 'false'].includes(NOVA.queryURL.get('controls'))) {
         NOVA.updateUrl(NOVA.queryURL.remove('controls')); // clear and update
      }

   },
});
