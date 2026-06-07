import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        MonsterDex
      </Link>

      <p className="header-subtitle">
        Catálogo acadêmico de criaturas usando PokéAPI
      </p>
    </header>
  );
}

export default Header;
