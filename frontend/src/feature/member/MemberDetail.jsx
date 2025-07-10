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
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

export function MemberDetail() {
  const [member, setMember] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [password, setPassword] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/member?email=${params.get("email")}`)
      .then((res) => {
        setMember(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log("finally");
      });
  }, []);

  if (!member) return <Spinner />;

  function handleDeleteButtonClick() {
    axios
      .delete("/api/member", {
        data: { email: member.email, password: password },
      })
      .then((res) => {
        console.log("succeses");
        const message = res.data.message;
        toast(message.text, { type: message.type });
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        const message = err.response.data.message;
        toast(message.text, { type: message.type });
      })
      .finally(() => {
        console.log("finally");
        setModalShow(false);
        setPassword("");
      });
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <h2 className="mb-4">회원 정보</h2>
        <div>
          <FormGroup controlId="email1" className="mb-3">
            <FormLabel>이메일</FormLabel>
            <FormControl readOnly value={member.email} />
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="nickName1" className="mb-3">
            <FormLabel>닉네임</FormLabel>
            <FormControl readOnly value={member.nickName} />
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="info1" className="mb-3">
            <FormLabel>자기소개</FormLabel>
            <FormControl as="textarea" readOnly value={member.info} />
          </FormGroup>
        </div>
        <div>
          <Button
            variant="outline-danger"
            size="sm"
            className="me-2"
            onClick={() => setModalShow(true)}
          >
            회원 탈퇴
          </Button>
          <Button variant="outline-info" size="sm" className="me-2">
            회원 수정
          </Button>
        </div>
      </Col>

      {/*  삭제 확인 모달 */}
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>회원 탈퇴 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="password1">
            <FormLabel>암호</FormLabel>
            <FormControl
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setModalShow(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={handleDeleteButtonClick}>
            탈퇴
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
