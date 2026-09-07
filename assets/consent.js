(() => {
  const banner = document.querySelector('#cookie-banner');
  if (!banner) return;
  const settings = document.querySelector('#cookie-settings');
  const close = document.querySelector('#cookie-close');
  const current = document.querySelector('#cookie-current');
  const id = banner.dataset.analyticsId;
  const key = 'analytics-consent-v1';
  const lifetime = Number(banner.dataset.consentDays) * 24 * 60 * 60 * 1000;
  let loaded = false;
  let returnFocus;
  let expiryTimer;
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (
        value &&
        ['accepted', 'rejected'].includes(value.choice) &&
        Number.isFinite(value.expires) &&
        value.expires > Date.now() &&
        value.expires <= Date.now() + lifetime
      )
        return value;
    } catch (_) {
      /* Storage unavailable: leave analytics off until an explicit choice. */
    }
    return null;
  }
  let consent = read();
  function clearAnalyticsCookies() {
    const names = document.cookie
      .split(';')
      .map((c) => c.trim().split('=')[0])
      .filter((n) => n === '_ga' || n.startsWith('_ga_') || n === '_gid' || n.startsWith('_gat'));
    const parts = location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < parts.length - 1; i++) domains.push(parts.slice(i).join('.'));
    for (const name of names)
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax`;
      }
  }
  function enable() {
    if (!id || loaded) return;
    loaded = true;
    window[`ga-disable-${id}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', id, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: lifetime / 1000,
      cookie_update: false,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.append(script);
  }
  function hide() {
    banner.hidden = true;
    if (banner.contains(document.activeElement)) (returnFocus || settings).focus();
  }
  function show(manual = false) {
    returnFocus = document.activeElement;
    current.textContent = consent
      ? `Current choice: analytics ${consent.choice === 'accepted' ? 'allowed' : 'rejected'}.`
      : '';
    close.hidden = !consent;
    banner.hidden = false;
    if (manual) document.querySelector('#cookie-reject').focus();
  }
  function apply() {
    clearTimeout(expiryTimer);
    if (consent?.choice === 'accepted') enable();
    else {
      if (id) window[`ga-disable-${id}`] = true;
      clearAnalyticsCookies();
      // Unload an already-running Google tag after withdrawal, including other tabs.
      if (loaded) {
        location.reload();
        return;
      }
    }
    if (consent) {
      hide();
      // Recheck periodically because setTimeout cannot represent 180 days.
      expiryTimer = setTimeout(
        () => {
          if (Date.now() >= consent.expires) consent = null;
          apply();
        },
        Math.min(consent.expires - Date.now(), 60 * 60 * 1000),
      );
    } else show();
  }
  function choose(choice) {
    consent = { choice, expires: Date.now() + lifetime };
    try {
      localStorage.setItem(key, JSON.stringify(consent));
    } catch (_) {
      /* Choice lasts for this page only. */
    }
    apply();
  }
  document.querySelector('#cookie-accept').addEventListener('click', () => choose('accepted'));
  document.querySelector('#cookie-reject').addEventListener('click', () => choose('rejected'));
  settings.addEventListener('click', () => show(true));
  close.addEventListener('click', hide);
  banner.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && consent) hide();
  });
  window.addEventListener('storage', (event) => {
    if (event.key === key || event.key === null) {
      consent = read();
      apply();
    }
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      consent = read();
      apply();
    }
  });
  settings.hidden = false;
  apply();
})();
