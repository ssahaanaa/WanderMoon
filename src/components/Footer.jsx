import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} WanderMoon</p>
      <nav aria-label="Legal">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms and Conditions</Link>
      </nav>
    </footer>
  );
}

export default Footer;
