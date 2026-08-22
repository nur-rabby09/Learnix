import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="footer-logo">Learnix</span>
          <p className="footer-tagline">
            Helping students find the right seat and the right study partner.
          </p>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <span>Study Spaces</span>
          <span>Study Buddy</span>
          <span>Accessories</span>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Community Guidelines</span>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <span>Contact Support</span>
          <span>hello@learnix.example.com</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Learnix. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;