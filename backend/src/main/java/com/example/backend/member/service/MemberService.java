package com.example.backend.member.service;

import com.example.backend.board.entity.Board;
import com.example.backend.board.repository.BoardRepository;
import com.example.backend.board.service.BoardService;
import com.example.backend.comment.repository.CommentRepository;
import com.example.backend.like.repository.BoardLikeRepository;
import com.example.backend.member.dto.*;
import com.example.backend.member.entity.Auth;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.AuthRepository;
import com.example.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final AuthRepository authRepository;
    private final MemberRepository memberRepository;
    private final JwtEncoder jwtEncoder;
    private final BCryptPasswordEncoder passwordEncoder;
    private final BoardRepository boardRepository;
    private final CommentRepository commentRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final BoardService boardService;

    public void add(MemberForm memberForm) {

        if (this.validate(memberForm)) {
            Member member = new Member();
            member.setEmail(memberForm.getEmail());
//            member.setPassword(memberForm.getPassword());
            member.setPassword(passwordEncoder.encode(memberForm.getPassword()));
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

    public void delete(MemberForm memberForm, Authentication authentication) {
        Member dbData = memberRepository.findById(memberForm.getEmail()).get();
//        if (dbData.getPassword().equals(memberForm.getPassword())) {
        if (passwordEncoder.matches(memberForm.getPassword(), dbData.getPassword())) {
            // 회원이 쓴 댓글 지우기
            commentRepository.deleteByAuthor(dbData);
            // 회원이 쓴 게시물에 달린 댓글 지우기
            // 회원이 쓴 게시물 얻고
            List<Board> byAuthor = boardRepository.findByAuthor(dbData);
            // 그 게시물의 번호로 댓글 지우기
            for (Board board : byAuthor) {
                commentRepository.deleteByBoard(board);
            }
            // 회원이 쓴 게시물 지우기
//            boardRepository.deleteByAuthor(dbData);
            ///  1. 회원이 작성한 게시물 번호 목록을 얻고
            ///  2. 번호 목록 탐색해서 boardService의 deleteById 메소드 호출
            List<Integer> boardIdList = boardRepository.listBoardIdByAuthor(dbData);
            for (Integer boardId : boardIdList) {
                boardService.deleteById(boardId, authentication);
            }

            // 좋아요 지우기
            boardLikeRepository.deleteByMember(dbData);
            // 회원 정보 지우기
            memberRepository.delete(dbData);
        } else {
            throw new RuntimeException("암호가 일치하지 않습니다.");
        }
    }

    public void update(MemberForm memberForm) {
        // 조회
        Member dbData = memberRepository.findById(memberForm.getEmail()).get();
        // 암호 확인
//        if (!dbData.getPassword().equals(memberForm.getPassword())) {
        if (!passwordEncoder.matches(memberForm.getPassword(), dbData.getPassword())) {
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

//        if (dbData.getPassword().equals(data.getOldPassword())) {
        if (passwordEncoder.matches(data.getOldPassword(), dbData.getPassword())) {
//            dbData.setPassword(data.getNewPassword());
            dbData.setPassword(passwordEncoder.encode(data.getNewPassword()));
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
//            if (dbData.get().getPassword().equals(loginForm.getPassword())) {
            if (passwordEncoder.matches(loginForm.getPassword(), dbData.get().getPassword())) {
                List<Auth> authList = authRepository.findByMember(dbData.get());

                // * 고전적 방법
                /*
                String authListString = "";
                for (Auth auth : authList) {
                    authListString = authListString + " " + auth.getId().getAuthName();
                }
                authListString = authListString.trim();
                */
                // 권한 조회 - stream 사용
                String authListString = authList.stream()
                        .map(auth -> auth.getId().getAuthName())
                        .collect(Collectors.joining(" "));

                // token 생성하여 반환
                JwtClaimsSet claim = JwtClaimsSet.builder()
                        .subject(loginForm.getEmail())
                        .issuer("self")
                        .issuedAt(Instant.now())
                        .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 365))
                        .claim("scp", authListString)
                        .build();

                return jwtEncoder.encode(JwtEncoderParameters.from(claim)).getTokenValue();
            }
        }

        throw new RuntimeException("이메일 또는 패스워드가 일치하지 않습니다.");
    }
}
