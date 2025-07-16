import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

export function LikeContainer({ boardId }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [likeInfo, setLikeInfo] = useState(null);

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/like/board/${boardId}`)
        .then((res) => {
          setLikeInfo(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => {});
    }
  }, [isProcessing]);

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

  if (!likeInfo) {
    return <Spinner />;
  }

  return (
    <div className="d-flex gap-2 h2">
      <div onClick={handleLikeClick}>
        {likeInfo.liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
      </div>
      <div>{likeInfo.count}</div>
    </div>
  );
}
