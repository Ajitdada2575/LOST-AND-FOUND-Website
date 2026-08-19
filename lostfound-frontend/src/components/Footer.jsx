export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Lost & Found</h3>
            <p>Help reunite lost items with their owners. Your community needs you.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/lost-items">Lost Items</a></li>
              <li><a href="/found-items">Found Items</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Developer</h4>
            <p>Built with ❤️ by Ajit Gharge</p>
            <a href="https://github.com/Ajitdada2575" target="_blank" rel="noopener noreferrer" className="github-link">
              🔗 GitHub: Ajitdada2575
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Ajitdada Gharge. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
