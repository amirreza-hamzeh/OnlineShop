import React from 'react';
import './styles.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <section className='trustSection' id='trust-and-safety' aria-labelledby='trust-title'>
        <div className='trustIntroduction'>
          <span className='trustKicker'>Shop with confidence</span>
          <h2 id='trust-title'>Questions about shopping with us?</h2>
          <p>Clear answers about how we protect your order, payment, and peace of mind.</p>
        </div>

        <div className='trustQuestions'>
          <article className='trustAnswer'>
            <div className='trustIcon' aria-hidden='true'>✓</div>
            <div>
              <h3>Is my payment information secure?</h3>
              <p>Yes. Payments are processed through a secure payment service, and we do not store your full card details.</p>
            </div>
          </article>
          <article className='trustAnswer'>
            <div className='trustIcon' aria-hidden='true'>↩</div>
            <div>
              <h3>What if an item is not right for me?</h3>
              <p>You can return eligible items within 30 days. Our straightforward return process is designed to make shopping worry-free.</p>
            </div>
          </article>
          <article className='trustAnswer'>
            <div className='trustIcon' aria-hidden='true'>◎</div>
            <div>
              <h3>Can I trust the products shown here?</h3>
              <p>We curate practical products and display transparent descriptions and pricing, so you know what to expect before ordering.</p>
            </div>
          </article>
          <article className='trustAnswer'>
            <div className='trustIcon' aria-hidden='true'>✦</div>
            <div>
              <h3>Will I know what happens after checkout?</h3>
              <p>We provide an order confirmation after a successful purchase, giving you a clear record of your transaction.</p>
            </div>
          </article>
        </div>
      </section>
      <div className='copyright'>
        &copy; 2026 OnlineShop. Shop thoughtfully, shop confidently.
      </div>
    </footer>

  );
}

export default Footer;
