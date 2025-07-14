import { useContext, useState } from "react";
import { useNavigate } from "react-router";
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
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";

export function BoardAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [author, setAuthor] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useContext(AuthenticationContext);

  const navigate = useNavigate();

  function handleSaveButtonClick() {
    setIsProcessing(true);
    axios
      .post("/api/board/add", {
        title: title,
        content: content,
        // author: author
      })
      .then((res) => {
        const message = res.data.message;
        if (message) {
          // toast 띄우기
          toast(message.text, { type: message.type });
        }
        // "/"로 이동
        navigate("/");
      })
      .catch((err) => {
        console.log("잘 안되면 실행되는 코드");
        const message = err.response.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
      })
      .finally(() => {
        console.log("항상 실행되는 코드");
        setIsProcessing(false);
      });
  }

  // 제목, 본문, 작성자 입력 여부 확인
  let validate = true;
  if (title.trim() === "") {
    validate = false;
  }
  if (content.trim() === "") {
    validate = false;
  }
  // if (author.trim() === "") {
  //   validate = false;
  // }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <h2 className="mb-4">글 작성</h2>
        <div>
          <FormGroup className="mb-3" controlId="title1">
            <FormLabel>제목</FormLabel>
            <FormControl
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></FormControl>
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="content1">
            <FormLabel>본문</FormLabel>
            <FormControl
              as="textarea"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="author1">
            <FormLabel>작성자</FormLabel>
            <FormControl value={user.nickName} disabled></FormControl>
          </FormGroup>
        </div>
        <div className="mb-3">
          <Button
            onClick={handleSaveButtonClick}
            disabled={isProcessing || !validate}
          >
            {/* isProcessing = true 이면 Spinner */}
            {isProcessing && <Spinner size="sm" />}
            {/* isProcessing = false 이면 "저장" */}
            {isProcessing || "저장"}
          </Button>
        </div>
      </Col>
    </Row>
  );
}
