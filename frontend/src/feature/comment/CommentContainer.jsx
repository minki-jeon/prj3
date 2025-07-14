import { Button, FormControl } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

export function CommentContainer({ boardId }) {
  const [comment, setComment] = useState("");

  function handleCommentSaveClick() {
    axios
      .post("/api/comment", { boardId: boardId, comment: comment })
      .then((res) => {})
      .catch((err) => console.log(err))
      .finally(() => {});
  }

  return (
    <div>
      <h3>COMMENT</h3>
      <FormControl
        as="textarea"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={handleCommentSaveClick}>댓글 등록</Button>
    </div>
  );
}
