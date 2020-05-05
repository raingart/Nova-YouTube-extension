_plugins.push({
   name: 'Filter comments',
   id: 'filter-comments',
   section: 'comments',
   depends_page: 'watch',
   // desc: '',
   _runtime: user_settings => {

      // if "disable-comments" is enabled - exit
      if (user_settings['disable-comments']) return;

      // const getLikes = elm => elm && Number(elm.textContent);
      const markAttrName = 'comments-filter';

      // init style
      YDOM.injectStyle((function () {
         let initStyle;
         switch (user_settings.comments_filter_style) {
            case 'hide':
               initStyle = `{
                  outline: 1px dashed red;
                  opacity: .2;
               } [${markAttrName}]:hover { opacity: 1 }`;
               break;
            case 'remove':
               initStyle = '{ display: none }';
            // default:
         }
         return `[${markAttrName}] ` + initStyle;
      }()));

      function callback(comment) {

      }

      YDOM.waitHTMLElement({
         selector: '#comment:not([' + markAttrName + '])',
         cleaning_resistant: true,
         callback: comment => {
            const commentConteiner = comment.parentNode;
            // if (commentConteiner.hasAttribute(markAttrName)) return;
            // commentConteiner.setAttribute(markAttrName, true); // mark

            // // has heart-button
            // if (user_settings.comments_hide_heart && comment.querySelector('#creator-heart-button')) {
            //    commentConteiner.setAttribute(markAttrName, 'hide_heart'); // add css
            //    return;
            // }
            // // no replies
            // else if (user_settings.comments_no_replies && !comment.querySelector('#replies')) {
            //    commentConteiner.setAttribute(markAttrName, 'no_replies'); // add css
            //    console.log('>>', commentConteiner, comment.querySelector('#replies'));
            //    return;
            // }
            // min likes
            // else if (user_settings.comments_min_likes) {
            //    const likesCount = getLikes(comment.querySelector('#vote-count-middle'));

            //    if (likesCount < user_settings.comments_min_likes) {
            //       commentConteiner.setAttribute(markAttrName, 'min_likes:' + likesCount); // add css
            //       return;
            //    }
            // }
            // comments length
            if (user_settings.comments_min_length) {
               const getLength = elm => elm?.textContent?.length;
               const commentLength = getLength(comment.querySelector('#content-text'));

               if (commentLength < user_settings.comments_min_length) {
                  commentConteiner.setAttribute(markAttrName, 'min_length: ' + commentLength); // add css
                  return;
               }
            }
         },
      });

      // [...document.querySelectorAll('[${markAttrName}]')]
      //    .forEach(el => el.parentNode.removeChild(bezel))
      //    // .forEach(el => el.style.display = 'none');

      // commentConteiner.removeChild(comment) // remove
      // comment.style.outline = '1px dashed red';
      // bezel.style.display = 'none'

   },
   export_opt: {
      'comments_filter_style': {
         _elementType: 'select',
         label: 'Hiding action',
         // title: '',
         options: [
            { label: 'transparent', value: 'hide' },
            { label: 'remove', value: 'remove', selected: true },
         ]
      },
      // 'comments_hide_heart': {
      //    _elementType: 'input',
      //    label: 'Creator "heart"',
      //    type: 'checkbox',
      //    // checked: false,
      // },
      // 'comments_no_replies': {
      //    _elementType: 'input',
      //    label: 'no replies',
      //    type: 'checkbox',
      //    // checked: false,
      // },
      // 'comments_min_likes': {
      //    _elementType: 'input',
      //    label: 'Min Likes Count',
      //    title: '0 - disable',
      //    type: 'number',
      //    // placeholder: '',
      //    step: 1,
      //    min: 0,
      //    max: 9999,
      //    value: 1,
      // },
      'comments_min_length': {
         _elementType: 'input',
         label: 'Min length',
         title: '0 - disable',
         type: 'number',
         // placeholder: '',
         step: 1,
         min: 0,
         max: 100,
         value: 15,
      },
   },
});
