import { CommentAdd } from "./CommentAdd.jsx";
import { CommentList } from "./CommentList.jsx";
import { useState } from "react";

export function CommentContainer({ boardId }) {
  const [addComment, setAddComment] = useState("");

  const changeAddComment = (data) => {
    setAddComment(data);
  };

  return (
    <div>
      <h3>COMMENT</h3>
      <CommentAdd boardId={boardId} changeAddComment={changeAddComment} />
      <hr />
      <CommentList boardId={boardId} addComment={addComment} />
    </div>
  );
}
