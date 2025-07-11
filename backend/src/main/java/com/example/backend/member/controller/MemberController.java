package com.example.backend.member.controller;

import com.example.backend.member.dto.*;
import com.example.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController     // = @Controller + @ResponseBody
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("login")
    public String login(@RequestBody MemberLoginForm loginForm) {
        System.out.println(loginForm);

        return null;
    }

    @PutMapping("changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordForm data) {
        System.out.println("data = " + data);
        try {
            memberService.changePassword(data);
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            return ResponseEntity.status(403).body(Map.of("message",
                    Map.of("type", "error", "text", message)));
        }
        return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "success", "text", "암호가 변경되었습니다.")));
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody MemberForm memberForm) {
//        System.out.println(memberForm);
        try {
            memberService.update(memberForm);
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            return ResponseEntity.status(403).body(Map.of("message",
                    Map.of("type", "error", "text", message)));
        }

        return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "success", "text", "회원 정보가 수정되었습니다.")));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteMember(@RequestBody MemberForm memberForm) {
        System.out.println(memberForm);
        try {
            memberService.delete(memberForm);
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            // 403 : 권한 없음
            // 401 : 로그인 실패
            return ResponseEntity.status(403).body(Map.of("message",
                    Map.of("type", "error", "text", message))
            );
        }
        return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "success", "text", "회원 정보가 삭제되었습니다."))
        );
    }

    @GetMapping(params = "email")
    public MemberDto getMember(String email) {
        return memberService.get(email);
    }

    @GetMapping("list")
    public List<MemberListInfo> list() {
        return memberService.list();
    }

    @PostMapping("add")
    public ResponseEntity<?> add(@RequestBody MemberForm memberForm) {
//        System.out.println("memberForm = " + memberForm);
        try {
            memberService.add(memberForm);

        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage();
            return ResponseEntity.badRequest().body(Map.of("message",
                    Map.of("type", "error", "text", message)));
        }

        return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "success", "text", "회원가입이 완료되었습니다."))
        );
    }
}
