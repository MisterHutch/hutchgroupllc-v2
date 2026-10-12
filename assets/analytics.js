(() => {
  if (!['hutchgroupllc.com', 'www.hutchgroupllc.com'].includes(location.hostname)) return;
  window.va = window.va || function (...args) { (window.vaq = window.vaq || []).push(args); };
  const analyticsUrl = value => {
    const url = new URL(value);
    const campaign = new URLSearchParams();
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const value = url.searchParams.get(key);
      if (value && /^[a-zA-Z0-9_-]{1,80}$/.test(value)) campaign.set(key, value);
    }
    url.search = campaign.toString();
    url.hash = '';
    return url.href;
  };
  window.va('beforeSend', event => ({ ...event, url: analyticsUrl(event.url) }));

  // Use the same production-only boundary as Vercel Analytics.
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-F3N1ZTF9JS', {
    page_location: analyticsUrl(location.href),
    page_referrer: document.referrer ? analyticsUrl(document.referrer) : '',
  });
  const googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=G-F3N1ZTF9JS';
  document.head.appendChild(googleTag);

  const track = (name, data) => {
    window.va('event', { name, data });
    window.gtag('event', name, data);
  };
  const names = new Set(['review_started', 'review_submitted', 'review_failed', 'contact_clicked', 'product_clicked', 'review_clicked']);
  window.hutchTrack = name => {
    if (names.has(name)) track(name, { page: location.pathname });
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (['mailto:', 'tel:'].includes(url.protocol)) window.hutchTrack('contact_clicked');
    else if (['prep.hutchgroupllc.com', 'ops.hutchgroupllc.com'].includes(url.hostname)) {
      track('product_clicked', { product: url.hostname.split('.')[0], page: location.pathname });
    } else if (url.origin === location.origin && url.pathname === '/opportunity-review/') window.hutchTrack('review_clicked');
  });
  document.querySelector('#reviewForm')?.addEventListener('input', () => window.hutchTrack('review_started'), { once: true });
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();
