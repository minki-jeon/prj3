package com.example.backend.board.controller;

import com.example.backend.board.dto.BoardDto;
import com.example.backend.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

//@Controller
//@ResponseBody
@RestController     // = @Controller + @ResponseBody
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("list")
    public ResponseEntity<List<BoardDto>> getAllBoards() {
        System.out.println("BoardController.getAllBoards");
        return null;
    }

    @PostMapping("add")
    public ResponseEntity<Object> add(@RequestBody BoardDto dto) {
        // 값들이 유효한지 확인
        boolean result = boardService.validate(dto);

        if (result) {
            // service
            boardService.add(dto);

            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "success", "text", "새 글이 등록되었습니다.")));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message",
                    Map.of("type", "error", "text", "입력한 내용이 유효하지 않습니다.")));

        }

    }
}
