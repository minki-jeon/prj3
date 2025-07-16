package com.example.backend.board.service;

import com.example.backend.board.dto.BoardAddForm;
import com.example.backend.board.entity.BoardFile;
import com.example.backend.board.entity.BoardFileId;
import com.example.backend.board.repository.BoardFileRepository;
import com.example.backend.board.repository.BoardRepository;
import com.example.backend.board.dto.BoardDto;
import com.example.backend.board.entity.Board;
import com.example.backend.comment.repository.CommentRepository;
import com.example.backend.member.dto.BoardListDto;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;
    private final BoardFileRepository boardFileRepository;

    public void add(BoardAddForm dto, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // Entity에 DTO의 값들을 저장하고
        Board board = new Board();
        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());
//        board.setAuthor(dto.getAuthor());
//        board.setAuthor(authentication.getName());
        Member author = memberRepository.findById(authentication.getName()).get();
        board.setAuthor(author);

        // Repository에서 Save 실행
        boardRepository.save(board);

        // files save
        saveFiles(board, dto);

    }

    private void saveFiles(Board board, BoardAddForm dto) {
        List<MultipartFile> files = dto.getFiles();
        if (files != null && files.size() > 0) {
            for (MultipartFile file : files) {
                if (file != null && file.getSize() > 0) {
                    // board_file 테이블 새 레코드 입력
                    BoardFile boardFile = new BoardFile();
                    // entity set
                    BoardFileId id = new BoardFileId();
                    id.setBoardId(board.getId());
                    id.setName(file.getOriginalFilename());
                    boardFile.setBoard(board);
                    boardFile.setId(id);

                    // repository
                    boardFileRepository.save(boardFile);

                    // 실제 파일 server(local) disk 저장
                    // TODO : AWS S3 에 파일 저장
                    // 1) ../Temp/prj3/boardFile 에서 '게시물 번호'이름의 폴더 생성
                    File folder = new File("D:/01.private_work/Choongang/workspaces/Temp/prj3/boardFile/" + board.getId());
                    if (!folder.exists()) {
                        folder.mkdirs();
                    }

                    // 2) 폴더에 파일 저장
                    try {
                        BufferedInputStream bi = new BufferedInputStream(file.getInputStream());
                        BufferedOutputStream bo = new BufferedOutputStream(new FileOutputStream(new File(folder, file.getOriginalFilename())));
                        try (bi; bo) {
                            byte[] b = new byte[1024];
                            int len;
                            while ((len = bi.read(b)) != -1) {
                                bo.write(b, 0, len);
                            }
                            bo.flush();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        throw new RuntimeException(e);
                    }


                }
            }


        }
    }

    public boolean validate(BoardDto dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isBlank()) {
            return false;
        }
        if (dto.getContent() == null || dto.getContent().trim().isBlank()) {
            return false;
        }
//        if (dto.getAuthor() == null || dto.getAuthor().trim().isBlank()) {
//            return false;
//        }

        return true;
    }

    //    public List<BoardListDto> list(String keyword, Integer pageNumber) {
    public Map<String, Object> list(String keyword, Integer pageNumber) {
//        return boardRepository.findAllByOrderByIdDesc();
//        return boardRepository.findAllBy(keyword);

        Page<BoardListDto> boardListDtoPage = boardRepository.findAllBy(keyword, PageRequest.of(pageNumber - 1, 10));
        int totalPages = boardListDtoPage.getTotalPages();
        int rightPageNumber = ((pageNumber - 1) / 10 + 1) * 10;
        int leftPageNumber = rightPageNumber - 9;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);
        var pageInfo = Map.of("totalPages", totalPages,
                "rightPageNumber", rightPageNumber,
                "leftPageNumber", leftPageNumber,
                "currentPageNumber", pageNumber);

        return Map.of("pageInfo", pageInfo, "boardList", boardListDtoPage.getContent());
    }

    public BoardDto getBoardById(Integer id) {
        /*
        Board board = boardRepository.findById(id).get();
        BoardDto boardDto = new BoardDto();
        boardDto.setId(board.getId());
        boardDto.setTitle(board.getTitle());
        boardDto.setContent(board.getContent());
        boardDto.setAuthor(board.getAuthor());
        boardDto.setInsertedAt(board.getInsertedAt());
        */
        BoardDto boardDto = boardRepository.findBoardById(id);
        return boardDto;
    }

    public void deleteById(Integer id, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("권한이 없습니다.");
        }
        Board dbData = boardRepository.findById(id).get();
        if (dbData.getAuthor().getEmail().equals(authentication.getName())) {
            commentRepository.deleteByBoardId(id);
            boardRepository.deleteById(id);
        } else {
            throw new RuntimeException("권한이 없습니다.");
        }
    }

    public void update(BoardDto boardDto, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("권한이 없습니다.");
        }

        // 조회
        Board dbData = boardRepository.findById(boardDto.getId()).get();
        if (dbData.getAuthor().getEmail().equals(authentication.getName())) {
            // 변경
            dbData.setTitle(boardDto.getTitle());
            dbData.setContent(boardDto.getContent());
//            dbData.setAuthor(boardDto.getAuthor());

            // 저장
            boardRepository.save(dbData);
        } else {
            throw new RuntimeException("권한이 없습니다.");
        }

    }

    public boolean validateForAdd(BoardAddForm dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isBlank()) {
            return false;
        }
        if (dto.getContent() == null || dto.getContent().trim().isBlank()) {
            return false;
        }

        return true;
    }
}
