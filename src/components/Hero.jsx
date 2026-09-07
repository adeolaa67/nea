export default function Hero() {
  function scrollToCrops() {
    document.getElementById('my-crops')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="cc-hero">
      <div className="cc-hero__inner">
        <h1 className="cc-hero__title">Grow smarter, harvest better.</h1>
        <p className="cc-hero__subtitle">
          Track every crop from seed to harvest with live weather alerts,
          personalised planting windows and a garden that remembers what you
          planted, so you don't have to.
        </p>
        <button className="cc-hero__cta" onClick={scrollToCrops}>
          🌱 View My Crops
        </button>
      </div>
    </section>
  );
}
