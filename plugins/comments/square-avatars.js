window.nova_plugins.push({
   id: 'square-avatars',
   title: 'Square avatars',
   'title:zh': '方形头像',
   'title:ja': '正方形のアバター',
   'title:ko': '정사각형 아바타',
   'title:id': 'Avatar persegi',
   'title:es': 'Avatares cuadrados',
   'title:pt': 'Avatares quadrados',
   'title:fr': 'Avatars carrés',
   'title:it': 'Avatar quadrati',
   // 'title:tr': 'Kare avatarlar',
   'title:de': 'Quadratische Avatare',
   'title:pl': 'Kwadratowe awatary',
   'title:ua': 'Квадратні аватарки',
   run_on_pages: 'all',
   section: 'comments',
   desc: 'Make user images squared',
   'desc:zh': '方形用户形象',
   'desc:ja': 'ユーザー画像を二乗する',
   'desc:ko': '사용자 이미지를 정사각형으로 만들기',
   'desc:id': 'Buat gambar pengguna menjadi persegi',
   // 'desc:es': 'Haz que las imágenes de los usuarios sean cuadradas',
   'desc:pt': 'Torne as imagens do usuário quadradas',
   'desc:fr': 'Rendre les images utilisateur au carré',
   'desc:it': 'Rendi le immagini degli utenti quadrate',
   // 'desc:tr': 'Kullanıcı resimlerini kare haline getirin',
   'desc:de': 'Machen Sie Benutzerbilder quadriert',
   'desc:pl': 'Awatary użytkowniów będą kwadratowe',
   'desc:ua': 'Зробіть зображення користувачів квадратними',
   _runtime: user_settings => {

      NOVA.css.push(
         [
            'yt-img-shadow',
            '.ytp-title-channel-logo',
            '#player .ytp-title-channel',
            'ytm-profile-icon',

            // after 10.27.22
            'a.ytd-thumbnail',
            // '#description',
            // '.ytd-searchbox', // searchbox
            // '.yt-spec-button-shape-next--size-m', // comment replay, subscribe like , , etc btn

         ]
            .join(',\n') + ` {
               border-radius: 0 !important;
            }`);

   },
});
