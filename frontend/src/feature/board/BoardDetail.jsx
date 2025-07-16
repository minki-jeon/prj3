import { useNavigate, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";
import { CommentContainer } from "../comment/CommentContainer.jsx";
import { LikeContainer } from "../like/LikeContainer.jsx";

export function BoardDetail() {
  const [board, setBoard] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const { hasAccess } = useContext(AuthenticationContext);

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

  function handleDeleteButtonClick() {
    axios
      .delete(`/api/board/${id}`)
      .then((res) => {
        console.log("동작 성공");
        const message = res.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
        navigate("/");
      })
      .catch((err) => {
        console.log("동작 오류");
        toast("게시물이 삭제되지 않았습니다.", { type: "warning" });
      })
      .finally(() => {
        console.log("항상 실행");
      });
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <div className="d-flex justify-content-between">
          <h2 className="mb-4">{board.id} 번 게시물</h2>
          <LikeContainer boardId={board.id} />
        </div>
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
            <FormControl value={board.authorNickName} readOnly={true} />
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

        {hasAccess(board.authorEmail) && (
          <div>
            <Button
              className="me-2"
              variant="outline-danger"
              onClick={() => setModalShow(true)}
            >
              삭제
            </Button>
            <Button
              variant="outline-info"
              onClick={() => navigate(`/board/edit?id=${board.id}`)}
            >
              수정
            </Button>
          </div>
        )}

        <div className="my-5">
          <hr />
        </div>
        {/* 댓글 컴포넌트 */}
        <CommentContainer boardId={board.id} />
      </Col>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>게시물 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>{board.id} 번 게시물을 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setModalShow(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={handleDeleteButtonClick}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
