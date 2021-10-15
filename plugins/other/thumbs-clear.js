window.nova_plugins.push({
   id: 'thumbnails-clear',
   title: 'Clear thumbnails',
   'title:zh': '清除缩略图',
   'title:ja': 'サムネイルをクリアする',
   run_on_pages: 'all, -embed',
   section: 'other',
   desc: 'Replaces the predefined thumbnail',
   'desc:zh': '替换预定义的缩略图',
   'desc:ja': '事前定義されたサムネイルを置き換えます',
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
         title: 'Show thumbnail from video time',
         'title:zh': 'ビデオ時間のサムネイルを表示 display video timestamps',
         'title:ja': 'ビデオ時間のサムネイルを表示 display video timestamps',
         options: [
            { label: 'start', value: 'hq1', 'label:zh': '开始', 'label:ja': '始まり' }, // often shows intro
            { label: 'middle', value: 'hq2', selected: true, 'label:zh': '中间', 'label:ja': '真ん中' },
            { label: 'end', value: 'hq3', 'label:zh': '结尾', 'label:ja': '終わり' }
         ],
      },
      thumbnails_clear_overlay: {
         _tagName: 'input',
         label: 'Hide overlay buttons on a thumbnail',
         'label:zh': '隐藏覆盖在缩略图上的按钮',
         'label:ja': 'サムネイルにオーバーレイされたボタンを非表示にする',
         type: 'checkbox',
         title: 'Hide [ADD TO QUEUE] [WATCH LATER]',
      },
   },
});
