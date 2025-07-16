import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";

export function LikeContainer() {
  return (
    <div className="d-flex gap-2 h2">
      <div>
        <FaRegThumbsUp />
        <FaThumbsUp />
      </div>
      <div>00</div>
    </div>
  );
}
