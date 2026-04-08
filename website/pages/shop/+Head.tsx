export default function Head() {
  const title = 'Shop | Courses, Ebooks & Resources — Dr Obinna Awiaka'
  const description = 'Browse Dr Obinna Awiaka\'s self-paced courses, ebooks, journals, and coaching toolkits. Invest in your personal growth and transformation.'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://drobinnaawiaka.com/shop" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
