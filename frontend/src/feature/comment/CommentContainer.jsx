import { CommentAdd } from "./CommentAdd.jsx";
import { CommentList } from "./CommentList.jsx";

export function CommentContainer({ boardId }) {
  return (
    <div>
      <h3>COMMENT</h3>
      <CommentAdd boardId={boardId} />
      <hr />
      <CommentList boardId={boardId} />
    </div>
  );
}
