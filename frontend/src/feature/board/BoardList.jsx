import { useEffect, useState } from "react";
import axios from "axios";
import { Badge, Col, Pagination, Row, Spinner, Table } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router";
import { GrNext, GrPrevious } from "react-icons/gr";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
import { TfiCommentAlt } from "react-icons/tfi";
import { FaRegComments, FaRegImages, FaThumbsUp } from "react-icons/fa6";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 마운트될 때 (initial render 시) 실행되는 코드
    axios
      .get(`/api/board/list?${searchParams}`)
      .then((res) => {
        console.log("동작 성공");
        setBoardList(res.data.boardList);
        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => {
        console.log("오류 발생");
      })
      .finally(() => {
        console.log("항상 실행");
      });
  }, [searchParams]);

  if (!boardList) {
    return <Spinner />;
  }

  function handleTableRowClick(id) {
    // 게시물 상세 보기 이동
    navigate(`/board/${id}`);
  }

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handlePageNumberClick(pageNumber) {
    // console.log(pageNumber + "페이지로 이동");
    // navigate(`/?p=${pageNumber}`);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("p", pageNumber);
    setSearchParams(nextSearchParams);
  }

  return (
    <>
      <Row>
        <Col>
          <h2 className="mb-4">글 목록</h2>
          {boardList.length > 0 ? (
            <Table striped={true} hover={true}>
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>번호</th>
                  <th style={{ width: "70px" }}>
                    <FaThumbsUp />
                  </th>
                  <th>제목</th>
                  <th
                    className="d-none d-md-table-cell"
                    style={{ width: "200px" }}
                  >
                    작성자
                  </th>
                  <th
                    className="d-none d-lg-table-cell"
                    style={{ width: "200px" }}
                  >
                    작성일시
                  </th>
                </tr>
              </thead>
              <tbody>
                {boardList.map((board) => (
                  <tr
                    key={board.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTableRowClick(board.id)}
                  >
                    <td>{board.id}</td>
                    <td>{board.countLike > 0 ? board.countLike : ""}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <span>{board.title}</span>
                        {/* 댓글 갯수 */}
                        <span>
                          {board.countComment > 0 && (
                            <Badge bg="light" text="dark">
                              <div className="d-flex gap-1">
                                <FaRegComments />
                                <span>{board.countComment}</span>
                              </div>
                            </Badge>
                          )}
                        </span>

                        {/*  파일 갯수 */}
                        <span>
                          {board.countFile > 0 && (
                            <Badge bg="info">
                              <div className="d-flex gap-1">
                                <FaRegImages />
                                <span>{board.countFile}</span>
                              </div>
                            </Badge>
                          )}
                        </span>
                      </div>
                    </td>
                    {/*<td className="d-none d-md-table-cell">{board.author}</td>*/}
                    <td className="d-none d-md-table-cell">{board.nickName}</td>
                    <td className="d-none d-lg-table-cell">{board.timesAgo}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>
              작성된 글이 존재하지 않습니다. <br /> 새 글을 작성해 보세요.
            </p>
          )}
        </Col>
      </Row>

      {/* PageNation */}
      <Row className={"my-3"}>
        <Col>
          <Pagination className="justify-content-center">
            <Pagination.First
              disabled={pageInfo.currentPageNumber === 1}
              onClick={() => handlePageNumberClick(1)}
            >
              <TbPlayerTrackPrev />
            </Pagination.First>
            <Pagination.Prev
              disabled={pageInfo.leftPageNumber <= 1}
              onClick={() =>
                handlePageNumberClick(pageInfo.leftPageNumber - 10)
              }
            >
              <GrPrevious />
            </Pagination.Prev>
            {pageNumbers.map((pageNumber) => (
              <Pagination.Item
                key={pageNumber}
                onClick={() => handlePageNumberClick(pageNumber)}
                active={pageInfo.currentPageNumber === pageNumber}
              >
                {pageNumber}
              </Pagination.Item>
            ))}
            <Pagination.Next
              diabled={pageInfo.rightPageNumber >= pageInfo.totalPages}
              onClick={() =>
                handlePageNumberClick(pageInfo.rightPageNumber + 1)
              }
            >
              <GrNext />
            </Pagination.Next>
            <Pagination.Last
              disabled={pageInfo.currentPageNumber === pageInfo.totalPages}
              onClick={() => handlePageNumberClick(pageInfo.totalPages)}
            >
              <TbPlayerTrackNext />
            </Pagination.Last>
          </Pagination>
        </Col>
      </Row>
    </>
  );
}
