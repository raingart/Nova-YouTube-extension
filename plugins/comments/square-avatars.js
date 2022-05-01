window.nova_plugins.push({
   id: 'square-avatars',
   title: 'Square avatars',
   'title:zh': '方形头像',
   'title:ja': '正方形のアバター',
   'title:ko': '정사각형 아바타',
   'title:es': 'Avatares cuadrados',
   'title:pt': 'Avatares quadrados',
   'title:fr': 'Avatars carrés',
   // 'title:tr': 'Kare avatarlar',
   'title:de': 'Quadratische Avatare',
   run_on_pages: 'all',
   section: 'comments',
   desc: 'Make user images squared',
   'desc:zh': '方形用户形象',
   'desc:ja': 'ユーザー画像を二乗する',
   'desc:ko': '사용자 이미지를 정사각형으로 만들기',
   // 'desc:es': 'Haz que las imágenes de los usuarios sean cuadradas',
   'desc:pt': 'Torne as imagens do usuário quadradas',
   // 'desc:fr': 'Rendre les images utilisateur au carré',
   'desc:tr': 'Kullanıcı resimlerini kare haline getirin',
   'desc:de': 'Machen Sie Benutzerbilder quadriert',
   _runtime: user_settings => {

      NOVA.css.push(
         `yt-img-shadow,
         .ytp-title-channel-logo,
         #player .ytp-title-channel,
         ytm-profile-icon {
            border-radius: 0 !important;
         }`);

   },
});
