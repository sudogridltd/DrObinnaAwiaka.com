export default function Head() {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Dr Obinna Awiaka" />
      <meta
        name="keywords"
        content="life coaching, personal development, transformation, mindset coaching, executive coaching, Dr Obinna Awiaka, life coach, online courses, self-improvement, workshops"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#0d9488" />

      {/* Default OG / Twitter */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Dr Obinna Awiaka" />
      <meta property="og:image" content="/og-image.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="/og-image.jpg" />

      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Prevent theme flash */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var t=localStorage.getItem('drobinna-theme')||'dark';document.documentElement.classList.add(t)})()`,
        }}
      />
    </>
  );
}
