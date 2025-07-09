package com.example.backend;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("add")
    @ResponseBody
    public ResponseEntity<Object> add(@RequestBody BoardDto dto) {
        // service
        boardService.add(dto);

        return ResponseEntity.ok().body(Map.of("message",
                Map.of("code", "success", "text", "새 글이 등록되었습니다.")));
    }
}
