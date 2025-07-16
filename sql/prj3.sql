CREATE TABLE board
(
    id          INT AUTO_INCREMENT NOT NULL,
    title       VARCHAR(300)       NOT NULL,
    content     VARCHAR(10000)     NOT NULL,
    author      VARCHAR(255)       NOT NULL,
    inserted_at datetime           NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_board PRIMARY KEY (id),
    FOREIGN KEY (author) REFERENCES member (email)
);
DROP TABLE board;

CREATE TABLE member
(
    email       VARCHAR(255) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    nick_name   VARCHAR(255) NOT NULL UNIQUE,
    info        VARCHAR(255) NULL,
    inserted_at datetime     NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_member PRIMARY KEY (email)
);
DROP TABLE member;

CREATE TABLE auth
(
    member_email VARCHAR(255) NOT NULL,
    auth_name    VARCHAR(255) NOT NULL,
    PRIMARY KEY (member_email, auth_name),
    FOREIGN KEY (member_email) REFERENCES member (email)
);
INSERT INTO auth
    (member_email, auth_name)
VALUES ('admin@admin.com', 'admin');


# 검색 테스트용 데이터
INSERT INTO board (title, content, author)
    VALUE
    ('qwe', 'asd', '99@99.com'),
    ('zxc', 'vbn', '88@88.com'),
    ('123', '456', '99@99.com'),
    ('qaz', 'wsx', '88@88.com'),
    ('edc', 'rfv', '99@99.com'),
    ('tgb', 'yhn', '88@88.com'),
    ('ujm', 'iop', '99@99.com'),
    ('lkj', 'mnb', '88@88.com'),
    ('ghj', 'tyu', '99@99.com'),
    ('vbc', 'uyh', '88@88.com');
# 페이지 테스트용 데이터
INSERT INTO board
    (title, content, author)
SELECT title, content, author
FROM board;
SELECT COUNT(*)
FROM board;



CREATE TABLE comment
(
    id          INT AUTO_INCREMENT NOT NULL,
    board_id    INT                NOT NULL,
    author      VARCHAR(255)       NOT NULL,
    comment     VARCHAR(2000)      NOT NULL,
    inserted_at datetime           NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_comment PRIMARY KEY (id),
    FOREIGN KEY (author) REFERENCES member (email),
    FOREIGN KEY (board_id) REFERENCES board (id)
);


# 좋아요 테이블
CREATE TABLE board_like
(
    board_id     INT          NOT NULL,
    member_email VARCHAR(255) NOT NULL,
    PRIMARY KEY (board_id, member_email),
    FOREIGN KEY (board_id) REFERENCES board (id),
    FOREIGN KEY (member_email) REFERENCES member (email)
);
