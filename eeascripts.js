// eeascripts.js
document.addEventListener('DOMContentLoaded', () => {
  const EEA_COUNTRIES = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE', 'US'];
  const REDIRECT_URL = '/sorry-no-cookies.html';

  function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
      const [k, v2] = v.split('=');
      return k === name ? decodeURIComponent(v2) : r;
    }, '');
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days*864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  function showModal() {
    const overlay = document.getElementById('cookie-consent-overlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    document.getElementById('cc-accept').onclick = () => {
      setCookie('cookie_consent', 'accepted', 365);
      closeModal();
      onConsent(true);
    };

    document.getElementById('cc-decline').onclick = () => {
      setCookie('cookie_consent', 'declined', 365);
      window.location.href = REDIRECT_URL;
    };
  }

  function closeModal() {
    const overlay = document.getElementById('cookie-consent-overlay');
    overlay.remove();
    document.body.style.overflow = '';
  }

  function onConsent(accepted) {
    if (accepted) {
      // load your analytics/tracking scripts here
    }
  }

  if (!getCookie('cookie_consent')) {
    fetch('https://ipapi.co/json')
      .then(r => r.json())
      .then(data => {
        if (EEA_COUNTRIES.includes(data.country_code)) {
          showModal();
        } else {
          setCookie('cookie_consent', 'non-eea', 365);
        }
      })
      .catch(() => showModal());
  }
});
