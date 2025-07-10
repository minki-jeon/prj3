package com.example.backend.member.controller;

import com.example.backend.member.dto.MemberDto;
import com.example.backend.member.dto.MemberForm;
import com.example.backend.member.dto.MemberListInfo;
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

    @DeleteMapping("{email}")
    public ResponseEntity<?> deleteMember(@PathVariable String email) {
        memberService.deleteById(email);
        return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "success", "text", email + " 님, 정상적으로 탈퇴되었습니다.")));
    }

    @PostMapping("delete")
    public ResponseEntity<?> deleteMemberCheck(@RequestBody String email, @RequestBody String password) {
        System.out.println("email = " + email);
        System.out.println("password = " + password);
        MemberForm dbData = memberService.getMember(email);
        String dbPassword = dbData.getPassword();

        if (dbPassword.equals(password)) {
            deleteMember(email);
        }

        return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "error", "text", "입력한 암호가 일치하지 않습니다.")));
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
