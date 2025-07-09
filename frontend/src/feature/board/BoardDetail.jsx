import { useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function BoardDetail() {
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