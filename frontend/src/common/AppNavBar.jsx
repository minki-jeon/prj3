import { Link } from "react-router";

export function AppNavBar() {
  return (
    <div>
      navbar
      <Link to="/">HOME</Link>
      <Link to="/board/add">글쓰기</Link>
    </div>
  );
}