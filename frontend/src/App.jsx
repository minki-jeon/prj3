import { BrowserRouter, Route, Routes, useParams } from "react-router";
import { MainLayout } from "./common/MainLayout.jsx";
import { BoardList } from "./feature/board/BoardList.jsx";
import { BoardAdd } from "./feature/board/BoardAdd.jsx";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function BoardDetail() {
  const { id } = useParams();

  useEffect(() => {
    // axios로 해당 게시물 가져오기
    axios
      .get(`/api/boards/${id}`)
      .then((res) => {
        console.log("동작 성공");
      })
      .catch((err) => {
        console.log("동작 오류");
        toast("해당 게시물이 존재하지 않습니다.", { type: "warning" });
      })
      .finally(() => {
        console.log("항상 실행");
      });
  }, []);

  return <h1>게시물 보기</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<BoardList />} />
          <Route path="board/add" element={<BoardAdd />} />
          <Route path="board/:id" element={<BoardDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
