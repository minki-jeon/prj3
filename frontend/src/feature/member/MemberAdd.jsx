import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
  Spinner,
} from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export function MemberAdd() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [nickName, setNickName] = useState("");
  const [info, setInfo] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  function handleSaveClick() {
    // post /api/member/add, {email, password, nickName, info}
    setIsProcessing(true);

    axios
      .post("/api/member/add", {
        email: email,
        password: password,
        nickName: nickName,
        info: info,
      })
      .then((res) => {
        console.log("success");
        const message = res.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
        navigate("/");
      })
      .catch((err) => {
        console.log("error");
        const message = err.response.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
      })
      .finally(() => {
        console.log("finally");
        setIsProcessing(false);
      });
  }

  let disabled = false;
  if (email === "" || nickName === "" || password === "") {
    disabled = true;
  }

  let passwordConfirm = true;
  if (password !== password2) {
    disabled = true;
    passwordConfirm = false;
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <h2 className="mb-4">회원 가입</h2>
        <div>
          <FormGroup className="mb-3" controlId="email1">
            <FormLabel>이메일</FormLabel>
            <FormControl
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="password1">
            <FormLabel>암호</FormLabel>
            {/* TODO: type="password" */}
            <FormControl
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="password2">
            <FormLabel>암호 확인</FormLabel>
            <FormControl
              type="text"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            {passwordConfirm || (
              <FormText className="text-danger">
                패스워드가 일치하지 않습니다.
              </FormText>
            )}
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="nickName1">
            <FormLabel>별명</FormLabel>
            <FormControl
              type="text"
              value={nickName}
              onChange={(e) => setNickName(e.target.value.trim())}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="info">
            <FormLabel>자기소개</FormLabel>
            <FormControl
              type="textarea"
              rows={6}
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            />
          </FormGroup>
        </div>
        <div>
          <Button onClick={handleSaveClick} disabled={isProcessing || disabled}>
            {isProcessing && <Spinner size="sm" />}
            가입
          </Button>
        </div>
      </Col>
    </Row>
  );
}
