package com.example.backend.board.service;

import com.example.backend.board.dto.BoardListInfo;
import com.example.backend.board.repository.BoardRepository;
import com.example.backend.board.dto.BoardDto;
import com.example.backend.board.entity.Board;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {

    private final BoardRepository boardRepository;

    public void add(BoardDto dto) {
        // Entity에 DTO의 값들을 저장하고
        Board board = new Board();
        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());
        board.setAuthor(dto.getAuthor());

        // Repository에서 Save 실행
        boardRepository.save(board);


    }

    public boolean validate(BoardDto dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isBlank()) {
            return false;
        }
        if (dto.getContent() == null || dto.getContent().trim().isBlank()) {
            return false;
        }
        if (dto.getAuthor() == null || dto.getAuthor().trim().isBlank()) {
            return false;
        }

        return true;
    }

    public List<BoardListInfo> list() {
        return boardRepository.findAllByOrderByIdDesc();
    }

    public BoardDto getBoardById(Integer id) {
        Board board = boardRepository.findById(id).get();
        BoardDto boardDto = new BoardDto();
        boardDto.setId(board.getId());
        boardDto.setTitle(board.getTitle());
        boardDto.setContent(board.getContent());
        boardDto.setAuthor(board.getAuthor());
        boardDto.setInsertedAt(board.getInsertedAt());

        return boardDto;
    }

    public void deleteById(Integer id) {
        boardRepository.deleteById(id);
    }
}
