import { useEffect } from "react";
import axios from "axios";

export function BoardList() {
  useEffect(() => {
    // 마운트될 때 (initial render 시) 실행되는 코드
    axios
      .get("/api/board/list")
      .then((res) => {
        console.log("동작 성공");
      })
      .catch((err) => {
        console.log("오류 발생");
      })
      .finally(() => {
        console.log("항상 실행");
      });
  }, []);
  return (
    <div>
      <h3>글 목록</h3>
    </div>
  );
}
