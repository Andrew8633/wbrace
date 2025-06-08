// eeascripts.js
document.addEventListener('DOMContentLoaded', () => {
  const EEA_COUNTRIES = [
    'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR',
    'HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL',
    'PT','RO','SK','SI','ES','SE', 'US'
  ];
  const COOKIE_NAME = 'cookie_consent';
  const COOKIE_EXPIRES_DAYS = 365;

  // Read a cookie value by name
  function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
      const [k, v2] = v.split('=');
      return k === name ? decodeURIComponent(v2) : r;
    }, '');
  }

  // Write a cookie
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  // Dynamically load and initialize Google Analytics
  function injectGtag() {
    // 1) Load the gtag.js library
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-S2G3J82KWQ';
    document.head.appendChild(gaScript);

    // 2) Insert inline config to ensure gtag is initialized
    const inlineScript = document.createElement('script');
    inlineScript.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-S2G3J82KWQ');
    `;
    document.head.appendChild(inlineScript);
  }

  // Show the consent modal
  function showModal() {
    const overlay = document.getElementById('cookie-consent-overlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    document.getElementById('cc-accept').onclick = () => {
      setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRES_DAYS);
      closeModal();
      injectGtag();
    };

    document.getElementById('cc-decline').onclick = () => {
      setCookie(COOKIE_NAME, 'declined', COOKIE_EXPIRES_DAYS);
      closeModal();
    };
  }

  // Remove the modal and restore scrolling
  function closeModal() {
    const overlay = document.getElementById('cookie-consent-overlay');
    overlay.remove();
    document.body.style.overflow = '';
  }

  // Main consent logic
  const consent = getCookie(COOKIE_NAME);
  if (consent === 'accepted') {
    // If already accepted, load GA immediately
    injectGtag();
  } else if (consent === '') {
    // No choice yet: check location, then show modal if in EEA
    fetch('https://ipapi.co/json')
      .then(res => res.json())
      .then(data => {
        if (EEA_COUNTRIES.includes(data.country_code)) {
          showModal();
        } else {
          // For non-EEA, mark as "non-eea" (optional)
          setCookie(COOKIE_NAME, 'non-eea', COOKIE_EXPIRES_DAYS);
        }
      })
      .catch(() => {
        // On error, default to showing the modal
        showModal();
      });
  }
});
