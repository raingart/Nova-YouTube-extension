window.nova_plugins.push({
   id: 'thumbnails-clear',
   title: 'Clear thumbnails',
   'title:zh': '清除缩略图',
   'title:ja': 'サムネイルをクリアする',
   'title:es': 'Miniaturas claras',
   'title:pt': 'Limpar miniaturas',
   'title:de': 'Miniaturansichten löschen',
   run_on_pages: 'all, -embed',
   section: 'other',
   desc: 'Replaces the predefined thumbnail',
   'desc:zh': '替换预定义的缩略图',
   'desc:ja': '事前定義されたサムネイルを置き換えます',
   'desc:es': 'Reemplaza la miniatura predefinida',
   'desc:pt': 'Substitui a miniatura predefinida',
   'desc:de': 'Ersetzt das vordefinierte Thumbnail',
   _runtime: user_settings => {

      NOVA.watchElement({
         selector: '#thumbnail #img[src]',
         attr_mark: 'preview-cleared',
         callback: img => {
            // hq1,hq2,hq3,hq720,default,sddefault,mqdefault,hqdefault excluding - maxresdefault
            if ((re = /(\w{1}qdefault|hq\d+).jpg/i) && re.test(img.src)) {
               img.src = img.src.replace(re, (user_settings.thumbnails_clear_timestamps || 'hq2') + '.jpg');
            }
         },
      });

      if (user_settings.thumbnails_clear_overlay) {
         NOVA.css.push(
            `#hover-overlays {
               visibility: hidden !important;
            }`);
      }

   },
   options: {
      thumbnails_clear_preview_timestamps: {
         _tagName: 'select',
         label: 'Thumbnail timestamps',
         'label:zh': '缩略图时间戳',
         'label:ja': 'サムネイルのタイムスタンプ',
         'label:es': 'Marcas de tiempo en miniatura',
         'label:pt': 'Carimbos de data e hora em miniatura',
         'label:de': 'Thumbnail-Zeitstempel',
         title: 'Show thumbnail from video time position',
         'title:zh': '从视频时间位置显示缩略图',
         'title:ja': 'ビデオの時間位置からサムネイルを表示',
         // 'title:es': 'Mostrar miniatura de la posición de tiempo del video',
         'title:pt': 'Mostrar miniatura da posição no tempo do vídeo',
         // 'title:de': 'Miniaturansicht von der Videozeitposition anzeigen',
         options: [
            { label: 'start', value: 'hq1', 'label:zh': '开始', 'label:ja': '始まり', 'label:es': 'comienzo', 'label:pt': 'começar', 'label:de': 'anfang' }, // often shows intro
            { label: 'middle', value: 'hq2', selected: true, 'label:zh': '中间', 'label:ja': '真ん中', 'label:es': 'medio', 'label:pt': 'meio', 'label:de': 'mitte' },
            { label: 'end', value: 'hq3', 'label:zh': '结尾', 'label:ja': '終わり', 'label:es': 'fin', 'label:pt': 'fim', 'label:de': 'ende' }
         ],
      },
      thumbnails_clear_overlay: {
         _tagName: 'input',
         label: 'Hide overlay buttons on a thumbnail',
         'label:zh': '隐藏覆盖在缩略图上的按钮',
         'label:ja': 'サムネイルにオーバーレイされたボタンを非表示にする',
         'label:es': 'Ocultar botones superpuestos en una miniatura',
         'label:pt': 'Ocultar botões de sobreposição em uma miniatura',
         'label:de': 'Überlagerungsschaltflächen auf einer Miniaturansicht ausblenden',
         type: 'checkbox',
         title: 'Hide [ADD TO QUEUE] [WATCH LATER]',
      },
   },
});
