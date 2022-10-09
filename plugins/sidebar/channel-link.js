window.nova_plugins.push({
   id: 'sidebar-channel-links-patch',
   title: 'Fix channel links in sidebar',
   'title:zh': '修复侧边栏中的频道链接',
   'title:ja': 'サイドバーのチャネルリンクを修正',
   'title:ko': '사이드바에서 채널 링크 수정',
   'title:id': 'Perbaiki tautan saluran di bilah sisi',
   'title:es': 'Arreglar enlaces de canales en la barra lateral',
   'title:pt': 'Corrigir links de canais na barra lateral',
   'title:fr': 'Correction des liens de chaîne dans la barre latérale',
   'title:it': 'Correggi i collegamenti ai canali nella barra laterale',
   'title:tr': 'Kenar çubuğunda kanal bağlantılarını düzeltin',
   'title:de': 'Korrigieren Sie die Kanallinks in der Seitenleiste',
   'title:pl': 'Napraw linki do kanałów na pasku bocznym',
   run_on_pages: 'watch, -mobile',
   section: 'sidebar',
   // desc: '',
   _runtime: user_settings => {

      document.addEventListener('mouseover', ({ target }) => {
         //console.debug('>', target);

         if (!target.matches('.ytd-channel-name')) return;

         if ((link = target.closest('a'))
            && target.__data?.text?.runs.length
            && target.__data?.text?.runs[0].navigationEndpoint?.commandMetadata?.webCommandMetadata?.webPageType == 'WEB_PAGE_TYPE_CHANNEL'
         ) {
            // Doesn't work
            // target.addEventListener('click', ({ target }) => target.preventDefault());

            //const urlOrig = '/watch?v=' + link.data.watchEndpoint.videoId;
            const urlOrig = link.href;
            const url = target.__data.text.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url + '/videos';

            // patch
            link.href = url;
            link.data.commandMetadata.webCommandMetadata.url = url;
            link.data.commandMetadata.webCommandMetadata.webPageType = 'WEB_PAGE_TYPE_CHANNEL';
            link.data.browseEndpoint = target.__data.text.runs[0].navigationEndpoint.browseEndpoint;
            link.data.browseEndpoint.params = encodeURIComponent(btoa(String.fromCharCode(0x12, 0x06) + 'videos'));
            //console.debug('patch link:', 1);

            // restore
            target.addEventListener('mouseout', ({ target }) => {
               link.href = urlOrig;
               link.data.commandMetadata.webCommandMetadata.url = urlOrig;
               link.data.commandMetadata.webCommandMetadata.webPageType = 'WEB_PAGE_TYPE_WATCH';
               //console.debug('restore link:', 2);
            }, { capture: true, once: true });
         }
      })

   },
});
