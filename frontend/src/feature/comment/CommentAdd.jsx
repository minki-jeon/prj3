import { Button, FormControl } from "react-bootstrap";
import { CommentList } from "./CommentList.jsx";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function CommentAdd({ boardId }) {
  const [comment, setComment] = useState("");

  function handleCommentSaveClick() {
    axios
      .post("/api/comment", { boardId: boardId, comment: comment })
      .then((res) => {
        const message = res.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
      })
      .catch((err) => {
        const message = err.response.data.message;
        if (message) {
          toast(message, { type: "danger" });
        }
      })
      .finally(() => {});
  }

  let saveButtonDisabled = false;
  if (comment.trim().length === 0) {
    saveButtonDisabled = true;
  }

  return (
    <div>
      <FormControl
        className="mb-3"
        as="textarea"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button disabled={saveButtonDisabled} onClick={handleCommentSaveClick}>
        댓글 등록
      </Button>
    </div>
  );
}
