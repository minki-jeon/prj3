package com.example.backend.member.service;

import com.example.backend.member.dto.MemberDto;
import com.example.backend.member.dto.MemberForm;
import com.example.backend.member.dto.MemberListInfo;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;

    public void add(MemberForm memberForm) {

        if (this.validate(memberForm)) {
            Member member = new Member();
            member.setEmail(memberForm.getEmail());
            member.setPassword(memberForm.getPassword());
            member.setNickName(memberForm.getNickName());
            member.setInfo(memberForm.getInfo());

            memberRepository.save(member);
        }

    }

    private boolean validate(MemberForm memberForm) {
        // email 중복 체크
        // nickname 중복 체크
        Optional<Member> dbDataEmail = memberRepository.findById(memberForm.getEmail());
        if (dbDataEmail.isPresent()) {
            throw new RuntimeException("이미 가입된 이메일입니다.");
        }
        Optional<Member> dbDataName = memberRepository.findByNickName(memberForm.getNickName());
        if (dbDataName.isPresent()) {
            throw new RuntimeException("이미 사용 중인 별명입니다.");
        }

        // email 입력 유무
        // email 형식 체크
        // nickname 입력 유무
        // password 입력 유무

        if (memberForm.getEmail().trim().isBlank()) {
            throw new RuntimeException("이메일을 입력해야 합니다.");
        }
        String email = memberForm.getEmail();
        String regax = "[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}";
        if (!Pattern.matches(regax, email)) {
            throw new RuntimeException("이메일 형식에 맞지 않습니다.");
        }
        if (memberForm.getPassword().isBlank()) {
            throw new RuntimeException("패스워드를 입력해야 합니다.");
        }
        if (memberForm.getNickName().isBlank()) {
            throw new RuntimeException("별명을 입력해야 합니다.");
        }

        return true;
    }

    public List<MemberListInfo> list() {
        return memberRepository.findAllBy();
    }

    public MemberDto get(String email) {
        Member dbData = memberRepository.findById(email).get();
        MemberDto memberDto = new MemberDto();
        memberDto.setEmail(dbData.getEmail());
        memberDto.setNickName(dbData.getNickName());
        memberDto.setInfo(dbData.getInfo());
        memberDto.setInsertedAt(dbData.getInsertedAt());

        return memberDto;
    }

    public void delete(MemberForm memberForm) {
        Member dbData = memberRepository.findById(memberForm.getEmail()).get();
        if (dbData.getPassword().equals(memberForm.getPassword())) {
            memberRepository.delete(dbData);
        } else {
            throw new RuntimeException("암호가 일치하지 않습니다.");
        }
    }
}
