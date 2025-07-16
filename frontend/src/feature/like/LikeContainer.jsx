import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import axios from "axios";
import { useState } from "react";

export function LikeContainer({ boardId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  function handleLikeClick() {
    setIsProcessing(true);
    axios
      .put("/api/like", { boardId: boardId })
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setIsProcessing(false);
      });
  }

  return (
    <div className="d-flex gap-2 h2">
      <div onClick={handleLikeClick}>
        <FaRegThumbsUp />
        <FaThumbsUp />
      </div>
      <div>00</div>
    </div>
  );
}
