
// for testing
// https://www.youtube.com/watch?v=LhKT9NTH9HA - don't have 480p
// https://www.youtube.com/watch?v=FZovbrEP53o - don't have 480p
// https://www.youtube.com/watch?v=E480DjY6ve8 - only 360p

window.nova_plugins.push({
   id: 'video-quality',
   title: 'Video quality',
   'title:zh': '视频质量',
   'title:ja': 'ビデオ品質',
   'title:ko': '비디오 품질',
   'title:id': 'Kualitas video',
   'title:es': 'Calidad de video',
   'title:pt': 'Qualidade de vídeo',
   'title:fr': 'Qualité vidéo',
   'title:it': 'Qualità video',
   // 'title:tr': 'Video kalitesi',
   'title:de': 'Videoqualität',
   'title:pl': 'Jakość wideo',
   'title:ua': 'Якість відео',
   run_on_pages: 'watch, embed',
   section: 'player',
   // desc: '',
   _runtime: user_settings => {

      // alt1 - https://greasyfork.org/en/scripts/6034-youtube-hd-override
      // alt2 - https://greasyfork.org/en/scripts/23661-youtube-hd
      // alt3 - https://greasyfork.org/en/scripts/379822-youtube-video-quality

      const qualityFormatListWidth = {
         highres: 4320,
         hd2880: 2880,
         hd2160: 2160,
         hd1440: 1440,
         hd1080: 1080,
         hd720: 720,
         large: 480,
         medium: 360,
         small: 240,
         tiny: 144,
         // auto: 0, ???
      };

      let selectedQuality = user_settings.video_quality;

      NOVA.waitSelector('#movie_player')
         .then(movie_player => {
            // keep save manual quality in the session
            if (user_settings.video_quality_manual_save_in_tab
               && NOVA.currentPage == 'watch' // no sense if in the embed
            ) {
               movie_player.addEventListener('onPlaybackQualityChange', quality => {
                  // console.debug('document.activeElement,',document.activeElement);
                  if (document.activeElement.getAttribute('role') == 'menuitemradio' // focuse on setting menu
                     && quality !== selectedQuality // the new quality
                  ) {
                     console.info(`keep quality "${quality}" in the session`);
                     selectedQuality = quality;
                     user_settings.video_quality_in_music_playlist = false; // overwrite for music
                  }
               });
            }

            // custom volume from [save-channel-state] plugin
            if (user_settings['save-channel-state']) {
               NOVA.runOnPageInitOrTransition(async () => {
                  if ((NOVA.currentPage == 'watch' || NOVA.currentPage == 'embed')
                     && (userQuality = await NOVA.storage_obj_manager.getParam('quality'))
                  ) {
                     selectedQuality = userQuality; // rewrite
                  }
               });
            }

            setQuality(); // init

            movie_player.addEventListener('onStateChange', setQuality); // update
         });

      async function setQuality(state) {
         if (!selectedQuality) return console.error('selectedQuality unavailable', selectedQuality);
         // console.debug('playerState', NOVA.getPlayerState(state));

         // checkMusicType
         if (user_settings.video_quality_in_music_playlist
            && location.search.includes('list=')
            // && (NOVA.queryURL.has('list')/* || movie_player?.getPlaylistId()*/)
            && NOVA.isMusic()
         ) {
            selectedQuality = user_settings.video_quality_in_music_quality;
         }

         // if (['PLAYING', 'BUFFERING'].includes(NOVA.getPlayerState(state))) {
         if (1 == state || 3 == state) {
            let availableQualityLevels;
            await NOVA.waitUntil(() => (availableQualityLevels = movie_player.getAvailableQualityLevels()) && availableQualityLevels?.length, 50) // 500ms
            // incorrect window size definition in embed
            // set max quality limit (screen resolution (not viewport) + 30%)
            const maxWidth = (NOVA.currentPage == 'watch') ? window.screen.width : window.innerWidth;
            const maxQualityIdx = availableQualityLevels.findIndex(i => qualityFormatListWidth[i] <= (maxWidth * 1.3));
            availableQualityLevels = availableQualityLevels.slice(maxQualityIdx);

            const maxAvailableQualityIdx = Math.max(availableQualityLevels.indexOf(selectedQuality), 0);
            const newQuality = availableQualityLevels[maxAvailableQualityIdx];

            // if (!newQuality || movie_player.getPlaybackQuality() == selectedQuality) {
            //    return console.debug('skip set quality');
            // }

            // if (!availableQualityLevels.includes(selectedQuality)) {
            //    console.info(`no has selectedQuality: "${selectedQuality}". Choosing instead the top-most quality available "${newQuality}" of ${JSON.stringify(availableQualityLevels)}`);
            // }

            if (movie_player.hasOwnProperty('setPlaybackQuality')) {
               // console.debug('use setPlaybackQuality');
               movie_player.setPlaybackQuality(newQuality);
            }

            // set QualityRange
            if (movie_player.hasOwnProperty('setPlaybackQualityRange')) {
               // console.debug('use setPlaybackQualityRange');
               movie_player.setPlaybackQualityRange(newQuality, newQuality);
            }

            // console.debug('availableQualityLevels:', availableQualityLevels);
            // console.debug("try set quality:", newQuality);
            // console.debug('current quality:', movie_player.getPlaybackQuality());
         }
      }

      // error detector
      NOVA.waitSelector('.ytp-error [class*="reason"]', { destroy_if_url_changes: true })
         .then(error_reason_el => {
            if (alertText = error_reason_el.textContent) {
               // err ex:
               // This video isn't available at the selected quality. Please try again later.
               // An error occurred. Please try again later. (Playback ID: Ame9qzOk-p5tXqLS) Learn More
               // alert(alertText);
               throw alertText; // send to _pluginsCaptureException
            }
         });

   },
   options: {
      video_quality: {
         _tagName: 'select',
         label: 'Default quality',
         'label:zh': '默认视频质量',
         'label:ja': 'デフォルトのビデオ品質',
         'label:ko': '기본 비디오 품질',
         'label:id': 'Kualitas bawaan',
         'label:es': 'Calidad predeterminada',
         'label:pt': 'Qualidade padrão',
         'label:fr': 'Qualité par défaut',
         'label:it': 'Qualità predefinita',
         // 'label:tr': 'Varsayılan kalite',
         'label:de': 'Standardvideoqualität',
         'label:pl': 'Domyślna jakość',
         'label:ua': 'Звичайна якість',
         title: 'If unavailable, set max available quality',
         'title:zh': '如果不可用，将选择可用的最高质量。',
         'title:ja': '利用できない場合は、利用可能な最高の品質が選択されます。',
         'title:ko': '사용할 수 없는 경우 사용 가능한 최대 품질을 설정합니다.',
         'title:id': 'Jika tidak tersedia, atur kualitas maksimal yang tersedia',
         'title:es': 'Si no está disponible, establezca la calidad máxima disponible',
         'title:pt': 'Se não estiver disponível, defina a qualidade máxima disponível',
         'title:fr': 'Si non disponible, définissez la qualité maximale disponible',
         'title:it': 'Se non disponibile, imposta la massima qualità disponibile',
         // 'title:tr': 'Mevcut değilse, maksimum kullanılabilir kaliteyi ayarlayın',
         // 'title:de': 'Wenn nicht verfügbar, stellen Sie die maximal verfügbare Qualität ein',
         'title:pl': 'Jeśli nie dostępna, ustaw maksymalną dostępną jakość',
         'title:ua': 'Якщо недоступно, обрати максимальну доступну якість',
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
      video_quality_manual_save_in_tab: {
         _tagName: 'input',
         // label: 'Manually selected qualities are saved in the current tab' // too much long
         label: 'Save manually selected for the same tab',
         'label:zh': '手动选择的质量保存在当前选项卡中',
         'label:ja': '手動で選択した品質が現在のタブに保存されます',
         'label:ko': '동일한 탭에 대해 수동으로 선택한 저장',
         'label:id': 'Simpan dipilih secara manual untuk tab yang sama',
         'label:es': 'Guardar seleccionado manualmente para la misma pestaña',
         'label:pt': 'Salvar selecionado manualmente para a mesma guia',
         'label:fr': 'Enregistrer sélectionné manuellement pour le même onglet',
         'label:it': 'Salva selezionato manualmente per la stessa scheda',
         // 'label:tr': 'Aynı sekme için manuel olarak seçili kaydet',
         'label:de': 'Manuell für dieselbe Registerkarte ausgewählt speichern',
         'label:pl': 'Właściwości dla obecnej karty',
         'label:ua': 'Зберігати власноруч обрану якість для вкладки',
         type: 'checkbox',
         title: 'Affects to next videos',
         'title:zh': '对下一个视频的影响',
         'title:ja': '次の動画への影響',
         'title:ko': '다음 동영상에 영향',
         'title:id': 'Mempengaruhi video berikutnya',
         'title:es': 'Afecta a los siguientes videos',
         'title:pt': 'Afeta para os próximos vídeos',
         'title:fr': 'Affecte aux prochaines vidéos',
         'title:it': 'Influisce sui prossimi video',
         // 'title:tr': 'Sonraki videoları etkiler',
         'title:de': 'Beeinflusst die nächsten Videos',
         'title:pl': 'Zmiany w następnych filmach',
         'title:ua': 'Впливає на наступні відео',
      },
      video_quality_in_music_playlist: {
         _tagName: 'input',
         label: 'Diff quality for music in playlists',
         // 'label:zh': '',
         // 'label:ja': '',
         // 'label:ko': '',
         // 'label:id': '',
         // 'label:es': '',
         // 'label:pt': '',
         // 'label:fr': '',
         // 'label:it': '',
         // 'label:tr': '',
         // 'label:de': '',
         // 'label:pl': '',
         'label:ua': 'Змінити якість музики у списках відтворення',
         type: 'checkbox',
         title: 'to save traffic / increase speed',
         'title:zh': '节省流量/提高速度',
         'title:ja': 'トラフィックを節約/速度を上げる',
         'title:ko': '트래픽 절약 / 속도 향상',
         'title:id': 'untuk menghemat lalu lintas / meningkatkan kecepatan',
         'title:es': 'para ahorrar tráfico / aumentar la velocidad',
         'title:pt': 'para economizar tráfego / aumentar a velocidade',
         'title:fr': 'économiser du trafic / augmenter la vitesse',
         'title:it': 'per risparmiare traffico / aumentare la velocità',
         // 'title:tr': '',
         'title:de': 'um Verkehr zu sparen / Geschwindigkeit zu erhöhen',
         'title:pl': 'aby zaoszczędzić ruch / zwiększyć prędkość',
         'title:ua': 'для економії трафіку / збільшення швидкості',
      },
      video_quality_in_music_quality: {
         _tagName: 'select',
         label: 'Quality for music',
         'label:zh': '音乐品质',
         'label:ja': '音楽の品質',
         'label:ko': '음악 품질',
         'label:id': 'Kualitas untuk musik',
         'label:es': 'calidad para la musica',
         'label:pt': 'Qualidade para música',
         'label:fr': 'Qualité pour la musique',
         'label:it': 'Qualità per la musica',
         // 'label:tr': '',
         'label:de': 'Qualität für Musik',
         'label:pl': 'Jakość dla muzyki',
         'label:ua': 'Якість для музики',
         // multiple: null,
         options: [
            // Available ['highres','hd2880','hd2160','hd1440','hd1080','hd720','large','medium','small','tiny']
            { label: '8K/4320p', value: 'highres' },
            // { label: '5K/2880p', value: 'hd2880' }, // missing like https://www.youtube.com/watch?v=Hbj3z8Db4Rk
            { label: '4K/2160p', value: 'hd2160' },
            { label: 'QHD/1440p', value: 'hd1440' },
            { label: 'FHD/1080p', value: 'hd1080' },
            { label: 'HD/720p', value: 'hd720' },
            { label: 'SD/480p', value: 'large', selected: true },
            { label: 'SD/360p', value: 'medium' },
            { label: 'SD/240p', value: 'small' },
            { label: 'SD/144p', value: 'tiny' },
            // { label: 'Auto', value: 'auto' }, // no sense, deactivation does too
         ],
         'data-dependent': { 'video_quality_in_music_playlist': true },
      },
   }
});
