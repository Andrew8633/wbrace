// eeascripts.js
(function() {
  const EEA_COUNTRIES = [
    'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS',
    'IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','US'
  ];

  function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days*864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  function showBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    banner.style.display = 'flex';

    document.getElementById('cc-accept').addEventListener('click', () => {
      setCookie('cookie_consent', 'accepted', 365);
      banner.remove();
      onConsent(true);
    });

    document.getElementById('cc-decline').addEventListener('click', () => {
      setCookie('cookie_consent', 'declined', 365);
      banner.remove();
      onConsent(false);
    });
  }

  // Override this to load or block your own scripts based on consent
  function onConsent(accepted) {
    if (accepted) {
      // e.g. dynamically load analytics here
    }
  }

  const consent = getCookie('cookie_consent');
  if (!consent) {
    fetch('https://ipapi.co/json')
      .then(r => r.json())
      .then(data => {
        if (EEA_COUNTRIES.includes(data.country_code)) {
          showBanner();
        } else {
          setCookie('cookie_consent', 'non-eea', 365);
        }
      })
      .catch(() => showBanner());
  }
})();