package com.example.backend.member.service;

import com.example.backend.member.dto.*;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final JwtEncoder jwtEncoder;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public void add(MemberForm memberForm) {

        if (this.validate(memberForm)) {
            Member member = new Member();
            member.setEmail(memberForm.getEmail());
//            member.setPassword(memberForm.getPassword());
            member.setPassword(bCryptPasswordEncoder.encode(memberForm.getPassword()));
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

    public void update(MemberForm memberForm) {
        // 조회
        Member dbData = memberRepository.findById(memberForm.getEmail()).get();
        // 암호 확인
        if (!dbData.getPassword().equals(memberForm.getPassword())) {
            throw new RuntimeException("암호가 일치하지 않습니다.");
        }
        // 변경
        dbData.setNickName(memberForm.getNickName());
        dbData.setInfo(memberForm.getInfo());
        // 저장
        memberRepository.save(dbData);

    }

    public void changePassword(ChangePasswordForm data) {
        Member dbData = memberRepository.findById(data.getEmail()).get();

        if (dbData.getPassword().equals(data.getOldPassword())) {
            dbData.setPassword(data.getNewPassword());
            memberRepository.save(dbData);
        } else {
            throw new RuntimeException("기존 패스워드가 일치하지 않습니다.");
        }
    }

    public String getToken(MemberLoginForm loginForm) {
        // 해당 email의 데이터가 있는지
        Optional<Member> dbData = memberRepository.findById(loginForm.getEmail());
        if (dbData.isPresent()) {
            // 있으면 패스워드가 일치하는지
            if (dbData.get().getPassword().equals(loginForm.getPassword())) {
                // token 생성하여 반환
                JwtClaimsSet claim = JwtClaimsSet.builder()
                        .subject(loginForm.getEmail())
                        .issuer("self")
                        .issuedAt(Instant.now())
                        .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 365))
                        .build();

                return jwtEncoder.encode(JwtEncoderParameters.from(claim)).getTokenValue();
            }
        }

        throw new RuntimeException("이메일 또는 패스워드가 일치하지 않습니다.");
    }
}
