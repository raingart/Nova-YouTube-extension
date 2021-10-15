window.nova_plugins.push({
   id: 'video-quality',
   title: 'Video quality',
   'title:zh': '视频质量',
   'title:ja': 'ビデオ品質',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      let selectedQuality = user_settings.video_quality;

      NOVA.waitElement('#movie_player')
         .then(player => {
            // keep save manual quality in the session
            if (user_settings.video_quality_manual_save_tab && NOVA.currentPageName() == 'watch') { // no sense if in the embed
               player.addEventListener('onPlaybackQualityChange', quality => {
                  // console.debug('document.activeElement,',document.activeElement);
                  if (document.activeElement.getAttribute('role') == 'menuitemradio' // focuse on setting menu
                     && quality !== selectedQuality // the new quality
                  ) {
                     console.info(`keep quality "${quality}" in the session`);
                     selectedQuality = quality;
                  }
               });
            }
            player.addEventListener('onStateChange', setQuality.bind(player));
         });

      function setQuality(state) {
         if (!selectedQuality) return console.error('selectedQuality unavailable', selectedQuality);
         // console.debug('playerState', NOVA.PLAYERSTATE[state]);

         // if ((1 == state || 3 == state) && !setQuality.quality_busy) {
         if (('PLAYING' == NOVA.PLAYERSTATE[state] || 'BUFFERING' == NOVA.PLAYERSTATE[state]) && !setQuality.quality_busy) {
            setQuality.quality_busy = true;

            const waitQuality = setInterval(() => {
               const availableQualityLevels = this.getAvailableQualityLevels();

               if (availableQualityLevels?.length) {
                  clearInterval(waitQuality);

                  const maxAvailableQuality = Math.max(availableQualityLevels.indexOf(selectedQuality), 0);
                  const newQuality = availableQualityLevels[maxAvailableQuality];

                  // if (!newQuality || this.getPlaybackQuality() == selectedQuality) {
                  //    return console.debug('skip set quality');
                  // }

                  // if (!availableQualityLevels.includes(selectedQuality)) {
                  //    console.info(`no has selectedQuality: "${selectedQuality}". Choosing instead the top-most quality available "${newQuality}" of ${JSON.stringify(availableQualityLevels)}`);
                  // }

                  if (this.hasOwnProperty('setPlaybackQuality')) {
                     // console.debug('use setPlaybackQuality');
                     this.setPlaybackQuality(newQuality);
                  }

                  // set QualityRange
                  if (this.hasOwnProperty('setPlaybackQualityRange')) {
                     // console.debug('use setPlaybackQualityRange');
                     this.setPlaybackQualityRange(newQuality, newQuality);
                  }

                  // console.debug('availableQualityLevels:', availableQualityLevels);
                  // console.debug("try set quality:", newQuality);
                  // console.debug('current quality:', this.getPlaybackQuality());
               }
            }, 50); // 50ms

            // } else if ('UNSTARTED' == NOVA.PLAYERSTATE[state] || 'ENDED' == NOVA.PLAYERSTATE[state]) {
         } else if (state <= 0) {
            setQuality.quality_busy = false;
         }
      }

   },
   options: {
      video_quality: {
         _tagName: 'select',
         label: 'Default video quality',
         'label:zh': '默认视频质量',
         'label:ja': 'デフォルトのビデオ品質',
         title: 'If unavailable, set max available quality',
         'title:zh': '如果不可用，将选择可用的最高质量。',
         'title:ja': '利用できない場合は、利用可能な最高の品質が選択されます。',
         // multiple: null,
         options: [
            // Available ['highres','hd2880','hd2160','hd1440','hd1080','hd720','large','medium','small','tiny']
            { label: '8K/4320p', value: 'highres' },
            // { label: '5K/2880p', value: 'hd2880' }, // missing like https://www.youtube.com/watch?v=Hbj3z8Db4Rk
            { label: '4K/2160p', value: 'hd2160' },
            { label: 'QHD/1440p', value: 'hd1440' },
            { label: 'FHD/1080p', value: 'hd1080', selected: true },
            { label: 'HD/720p', value: 'hd720' },
            { label: 'SD/480p', value: 'large' },
            { label: 'SD/360p', value: 'medium' },
            { label: 'SD/240p', value: 'small' },
            { label: 'SD/144p', value: 'tiny' },
            // { label: 'Auto', value: 'auto' }, // no sense, deactivation does too
         ],
      },
      video_quality_manual_save_tab: {
         _tagName: 'input',
         // label: 'Manually selected qualities are saved in the current tab' // too much long
         label: 'Save manually selected for the same tab',
         'label:zh': '手动选择的质量保存在当前选项卡中',
         'label:ja': '手動で選択した品質が現在のタブに保存されます',
         type: 'checkbox',
         title: 'Affects to next videos',
         'title:zh': '对下一个视频的影响',
         'title:ja': '次の動画への影響',
      },
   },
});
