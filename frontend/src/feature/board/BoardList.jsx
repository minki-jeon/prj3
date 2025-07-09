import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Table } from "react-bootstrap";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);

  useEffect(() => {
    // 마운트될 때 (initial render 시) 실행되는 코드
    axios
      .get("/api/board/list")
      .then((res) => {
        console.log("동작 성공");
        setBoardList(res.data);
      })
      .catch((err) => {
        console.log("오류 발생");
      })
      .finally(() => {
        console.log("항상 실행");
      });
  }, []);

  if (!boardList) {
    return <Spinner />;
  }

  return (
    <div>
      <h2 className="mb-4">글 목록</h2>
      {boardList.length > 0 ? (
        <Table striped={true} hover={true}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일시</th>
            </tr>
          </thead>
          <tbody>
            {boardList.map((board) => (
              <tr key={board.id}>
                <td>{board.id}</td>
                <td>{board.title}</td>
                <td>{board.author}</td>
                <td>{board.insertedAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>
          작성된 글이 존재하지 않습니다. <br /> 새 글을 작성해 보세요.
        </p>
      )}
    </div>
  );
}
