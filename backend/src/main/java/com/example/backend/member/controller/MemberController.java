package com.example.backend.member.controller;

import com.example.backend.member.dto.MemberForm;
import com.example.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("add")
    public String add(@RequestBody MemberForm memberForm) {
        System.out.println("memberForm = " + memberForm);
        memberService.add(memberForm);


        return null;
    }
}
