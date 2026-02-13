// analytics.ts
// GA4 Configuration
export function initGA4() {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-H44R8N7W32';
    script.async = true;
    document.head.appendChild(script);

    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    function gtag(...args: any[]) { window.dataLayer.push(arguments); }
    // @ts-ignore
    gtag('js', new Date());
    // @ts-ignore
    gtag('config', 'G-H44R8N7W32');
}
