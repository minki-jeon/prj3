import { CommentAdd } from "./CommentAdd.jsx";
import { CommentList } from "./CommentList.jsx";
import { useState } from "react";

export function CommentContainer({ boardId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div>
      <h3>COMMENT</h3>
      <CommentAdd
        boardId={boardId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
      <hr />
      <CommentList
        boardId={boardId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </div>
  );
}
