(function () {
  document.querySelectorAll('.post-body a[href]').forEach(function (link) {
    var url;
    try {
      url = new URL(link.getAttribute('href'), window.location.href);
    } catch (_) {
      return;
    }
    if (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      url.origin !== window.location.origin
    ) {
      link.target = '_blank';
      link.relList.add('noopener', 'noreferrer');
    }
  });

  var btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener(
    'scroll',
    function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    },
    { passive: true },
  );
})();
