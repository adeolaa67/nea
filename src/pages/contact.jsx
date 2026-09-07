import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/contact.css';

const FAQS = [
  {
    q: 'Is Crop Companion free to use?',
    a: 'Yes - creating an account, tracking crops, and getting weather alerts are all free.'
  },
  {
    q: 'How accurate are the harvest predictions?',
    a: 'We combine each plant\'s typical days-to-maturity with recent weather conditions ' +
       'at your location to estimate a harvest window - it\'s a strong guide, but always ' +
       'keep an eye on your actual plants too.'
  },
  {
    q: 'Do I need to allow location access?',
    a: 'It helps! Location lets us show accurate local weather and a planting hardiness ' +
       'zone automatically. You can also type in a town or city manually from the dashboard ' +
       'if you\'d rather not share GPS location.'
  },
  {
    q: 'Can I track more than one crop?',
    a: 'Yes - add as many crops as you like from "Your Crops" on the dashboard, each with ' +
       'its own growth progress, harvest date and care details.'
  },
  {
    q: 'How do I get notified about frost or storms?',
    a: 'Enable push alerts from the Weather & Alerts section of your dashboard - we\'ll ' +
       'notify you when severe conditions could affect your tracked crops.'
  }
];

export default function Contact() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="cc-contact">
      <div className="cc-contact__dim" />

      <header className="cc-contact__nav">
        <Link to="/" className="cc-contact__brand">
          <span aria-hidden="true">🌿</span>
          <span>Crop Companion</span>
        </Link>
        <Link to="/" className="cc-contact__back">← Back home</Link>
      </header>

      <main className="cc-contact__main">
        <section className="cc-contact__card cc-contact__email-card">
          <p className="cc-section__eyebrow">Get in touch</p>
          <h1>We&apos;d love to hear from you</h1>
          <p className="cc-contact__lede">
            Questions, feedback, or something not working quite right? Send us an email
            and we&apos;ll get back to you.
          </p>
          <a className="cc-contact__email" href="mailto:cropcompanion@gmail.com">
            cropcompanion@gmail.com
          </a>
        </section>

        <section className="cc-contact__card cc-contact__faq-card">
          <p className="cc-section__eyebrow">Frequently asked</p>
          <h2>Questions &amp; Answers</h2>

          <div className="cc-faq">
            {FAQS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div className={`cc-faq__item ${isOpen ? 'cc-faq__item--open' : ''}`} key={item.q}>
                  <button
                    type="button"
                    className="cc-faq__question"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <span className="cc-faq__chevron" aria-hidden="true">⌄</span>
                  </button>
                  <div className="cc-faq__answer-wrap">
                    <p className="cc-faq__answer">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
