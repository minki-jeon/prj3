import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";

export function LikeContainer({ boardId }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [likeInfo, setLikeInfo] = useState(null);
  const { user } = useContext(AuthenticationContext);

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
      {user === null ? (
        <div>
          <OverlayTrigger
            placement="top"
            trigger="hover"
            overlay={<Tooltip id="tooltip1">로그인이 필요합니다.</Tooltip>}
          >
            <FaRegThumbsUp />
          </OverlayTrigger>
        </div>
      ) : isProcessing ? (
        <div>
          <Spinner animation="grow" />
        </div>
      ) : (
        <div onClick={handleLikeClick}>
          {likeInfo.liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
        </div>
      )}
      <div>{likeInfo.count}</div>
    </div>
  );
}
