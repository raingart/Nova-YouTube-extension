// for test
// https://www.youtube.com/watch?v=XKa6TpPM70E

// https://www.youtube.com/watch?v=jx9LC2kyfcQ - ad rent block

window.nova_plugins.push({
   id: 'player-control-autohide',
   title: 'Hides the player control panel',
   'title:zh': '隱藏進度條(滑鼠移入才會顯示',
   'title:ja': 'プレーヤーのコントロールパネルを非表示にします',
   'title:ko': '플레이어 제어판을 숨깁니다',
   'title:es': 'Oculta el panel de control del reproductor',
   'title:pt': 'Esconde o painel de controle do player',
   'title:fr': 'Masque le panneau de contrôle du lecteur',
   'title:de': 'Blendet das Player-Bedienfeld aus',
   run_on_pages: 'watch, -mobile',
   section: 'player',
   desc: 'Hover over it to display it',
   'desc:zh': '将鼠标悬停在它上面以显示它',
   'desc:ja': 'カーソルを合わせると表示されます',
   'desc:ko': '그것을 표시하려면 그 위로 마우스를 가져갑니다',
   'desc:es': 'Coloca el cursor sobre él para mostrarlo',
   'desc:pt': 'Passe o mouse sobre ele para exibi-lo',
   'desc:fr': "Survolez-le pour l'afficher",
   'desc:de': 'Bewegen Sie den Mauszeiger darüber, um es anzuzeigen',
   _runtime: user_settings => {

      NOVA.css.push(
         `.ytp-chrome-bottom {
            opacity: 0;
         }
         .ytp-chrome-bottom:hover {
            opacity: 1;
         }`);

   },
});
