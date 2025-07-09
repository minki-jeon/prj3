import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Spinner,
} from "react-bootstrap";

export function BoardDetail() {
  const [board, setBoard] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // axios로 해당 게시물 가져오기
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        console.log("동작 성공");
        setBoard(res.data);
      })
      .catch((err) => {
        console.log("동작 오류");
        toast("해당 게시물이 존재하지 않습니다.", { type: "warning" });
      })
      .finally(() => {
        console.log("항상 실행");
      });
  }, []);

  if (!board) {
    return <Spinner />;
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <h2 className="mb-4">{board.id} 번 게시물</h2>
        <div>
          <FormGroup className="mb-3" controlId="title1">
            <FormLabel>제목</FormLabel>
            <FormControl value={board.title} readOnly={true} />
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="content1">
            <FormLabel>본문</FormLabel>
            <FormControl
              as="textarea"
              rows={6}
              value={board.content}
              readOnly={true}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="author1">
            <FormLabel>작성자</FormLabel>
            <FormControl value={board.author} readOnly={true} />
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="insertedAt1">
            <FormLabel>작성일시</FormLabel>
            <FormControl
              type="datetime-local"
              value={board.insertedAt}
              readOnly={true}
            />
          </FormGroup>
        </div>
        <div>
          <Button className="me-2" variant="outline-danger">
            삭제
          </Button>
          <Button variant="outline-info">수정</Button>
        </div>
      </Col>
    </Row>
  );
}
