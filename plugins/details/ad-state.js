window.nova_plugins.push({
   id: 'ad-state',
   title: 'Show Ads info',
   // 'title:zh': '',
   // 'title:ja': '',
   // 'title:ko': '',
   // 'title:vi': '',
   // 'title:id': '',
   // 'title:es': '',
   // 'title:pt': '',
   // 'title:fr': '',
   // 'title:it': '',
   // 'title:tr': '',
   // 'title:de': '',
   // 'title:pl': '',
   // 'title:ua': '',
   run_on_pages: 'watch, -mobile',
   restart_on_location_change: true,
   section: 'details',
   // desc: ',
   _runtime: user_settings => {

      const SELECTOR_ID = 'nova-monetization';

      // update state on url change
      // NOVA.runOnPageLoad(async () => {
      //    if (NOVA.currentPage != 'watch') return;

      // });

      // NOVA.waitSelector('.ytp-paid-content-overlay, ytm-paid-content-overlay-renderer', { destroy_after_page_leaving: true })
      //    .then(el => {
      //       insertToHTML({ 'text': `【Monetized (${adCount} ads)】`, 'container': el });
      //    });

      NOVA.waitSelector('#title h1', { destroy_after_page_leaving: true })
         .then(el => {
            if (playerResponse = document.body.querySelector('ytd-page-manager')?.getCurrentData?.()?.playerResponse) {
               let text = [];
               if (playerResponse?.paidContentOverlay) text.push('Sponsored');
               // if (adSlots = playerResponse?.adSlots?.length) text.push('adSlots: ' + adSlots);
               if (adCount = playerResponse?.adPlacements?.length) text.push(`Ads count ${adCount}`);

               if (text.length) insertToHTML({ 'text': `「${text.join(', ')}」`, 'container': el });
               // insertToHTML({ 'text': `【${text.join(', ')}】`, 'container': el });
            }
         });

      function insertToHTML({ text = '', container = required() }) {
         // console.debug('insertToHTML', ...arguments);
         if (!(container instanceof HTMLElement)) return console.error('container not HTMLElement:', container);

         (document.getElementById(SELECTOR_ID) || (() => {
            const el = document.createElement('span');
            el.id = SELECTOR_ID;
            el.className = 'style-scope yt-formatted-string bold';
            // el.style.cssText = 'font-size: 1.35rem; line-height: 2rem; font-weight:400;';
            Object.assign(el.style, {
               'font-size': '1.35rem',
               'line-height': '2rem',
               margin: '10px',
            });
            container.after(el);
            // container.insertAdjacentElement('afterend', el);
            return el;
            // 62.88 % slower
            // container.insertAdjacentHTML('afterend',
            //    `<span id="${SELECTOR_ID}" class="style-scope yt-formatted-string bold" style="font-size: 1.35rem; line-height: 2rem; font-weight:400;">${text}</span>`);
            // return document.getElementById(SELECTOR_ID);
         })())
            .textContent = text;
      }

   },
});
