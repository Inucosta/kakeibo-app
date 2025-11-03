import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">ホーム</Link></li>
        <li><Link to="/input">取引入力</Link></li>
        <li><Link to="/history">履歴</Link></li>
        <li><Link to="/items">項目追加</Link></li>
      </ul>
    </nav>
  );
};
