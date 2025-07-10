import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

export function MemberAdd() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [info, setInfo] = useState("");

  function handleSaveClick() {
    // post /api/member/add, {email, password, nickName, info}
    axios
      .post("/api/member/add", {
        email: email,
        password: password,
        nickName: nickName,
        info: info,
      })
      .then((res) => {
        console.log("success");
      })
      .catch((err) => {
        console.log("error");
      })
      .finally(() => {
        console.log("finally");
      });
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <h2 className="mb-4">회원 가입</h2>
        <div>
          <FormGroup className="mb-3" controlId="email1">
            <FormLabel>이메일</FormLabel>
            <FormControl
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {/* TODO: 나중에 적용 */}
            <FormLabel>암호 확인</FormLabel>
            <FormControl type="text" />
          </FormGroup>
        </div>
        <div>
          <FormGroup className="mb-3" controlId="nickName1">
            <FormLabel>별명</FormLabel>
            <FormControl
              type="text"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="info">
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
          <Button onClick={handleSaveClick}>가입</Button>
        </div>
      </Col>
    </Row>
  );
}
