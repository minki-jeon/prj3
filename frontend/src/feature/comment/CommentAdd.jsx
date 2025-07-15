import { Button, FloatingLabel, FormControl, Spinner } from "react-bootstrap";
import { CommentList } from "./CommentList.jsx";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";

export function CommentAdd({ boardId, isProcessing, setIsProcessing }) {
  const [comment, setComment] = useState("");
  // const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useContext(AuthenticationContext);

  function handleCommentSaveClick() {
    setIsProcessing(true);
    axios
      .post("/api/comment", { boardId: boardId, comment: comment })
      .then((res) => {
        const message = res.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
        setComment("");
      })
      .catch((err) => {
        const message = err.response.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }

  let saveButtonDisabled = false;
  if (comment.trim().length === 0) {
    saveButtonDisabled = true;
  }

  return (
    <div>
      <FloatingLabel
        label={user === null ? "로그인이 필요합니다." : "댓글을 작성하세요."}
        controlId="commentTextarea1"
      >
        <FormControl
          placeholder={
            user === null ? "로그인이 필요합니다." : "댓글을 작성하세요."
          }
          className="mb-3"
          as="textarea"
          style={{ height: "150px" }}
          value={comment}
          disabled={user === null}
          onChange={(e) => setComment(e.target.value)}
        />
      </FloatingLabel>
      <Button disabled={saveButtonDisabled} onClick={handleCommentSaveClick}>
        {isProcessing && <Spinner size="sm" />}
        댓글 등록
      </Button>
    </div>
  );
}
