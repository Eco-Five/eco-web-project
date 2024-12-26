CREATE TABLE board (
    board_id             INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    title                VARCHAR(200) NULL,
    content              VARCHAR(400) NULL,
    board_date           DATETIME NULL,
    image_url            VARCHAR(200) NULL,
    member_id            INTEGER UNSIGNED NOT NULL,
    content_type_id      INTEGER UNSIGNED NOT NULL
);

CREATE INDEX board_member_id_fk ON board (member_id);
CREATE INDEX board_content_type_id_fk ON board (content_type_id);


CREATE TABLE board_view (
    view_date            DATETIME NULL,
    heart                INTEGER NULL,
    board_id             INTEGER UNSIGNED NOT NULL,
    member_id            INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (member_id, board_id)  -- 기본 키로 설정
);

CREATE INDEX board_view_board_id_fk ON board_view (board_id);
CREATE INDEX board_view_member_id_fk ON board_view (member_id);


CREATE TABLE content_category (
    content_category_id  INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    category_name        VARCHAR(100) NOT NULL
);


CREATE TABLE content_type (
    content_type_id      INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    type_name            VARCHAR(100) NOT NULL,
    content_category_id  INTEGER UNSIGNED NOT NULL
);

CREATE INDEX content_type_category_id_fk ON content_type (content_category_id);


CREATE TABLE eco_bag (
    added_date           DATETIME NOT NULL,
    member_id            INTEGER UNSIGNED NOT NULL,
    product_id           INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (member_id, product_id)  -- 기본 키로 설정
);

CREATE INDEX eco_member_id_fk ON eco_bag (member_id);
CREATE INDEX eco_product_id_fk ON eco_bag (product_id);


CREATE TABLE inquiry (
    inquiry_id           INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    title                VARCHAR(200) NULL,
    content              VARCHAR(400) NULL,
    inquiry_date         DATETIME NULL,
    member_id            INTEGER UNSIGNED NOT NULL,
    inquiry_status_id    INTEGER UNSIGNED NOT NULL,
    content_type_id      INTEGER UNSIGNED NOT NULL
);

CREATE INDEX inquiry_member_id_fk ON inquiry (member_id);
CREATE INDEX inquiry_status_id_fk ON inquiry (inquiry_status_id);
CREATE INDEX inquiry_content_type_id_fk ON inquiry (content_type_id);


CREATE TABLE inquiry_comment (
    inquiry_comment_id   INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    comment              VARCHAR(300) NULL,
    comment_date         DATETIME NULL,
    inquiry_id           INTEGER UNSIGNED NOT NULL
);

CREATE INDEX inquiry_comment_inquiry_id_fk ON inquiry_comment (inquiry_id);


CREATE TABLE inquiry_status (
    inquiry_status_id    INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    status_name          VARCHAR(100) NOT NULL
);


CREATE TABLE member (
    member_id            INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    name                 VARCHAR(100) NULL,
    email                VARCHAR(100) NULL,
    pwd             	 VARCHAR(100) NULL,
    phone                VARCHAR(20) NULL,
    address				 VARCHAR(200) NULL,
    eco_point            INTEGER UNSIGNED NULL,
    image_url            VARCHAR(200) NULL,
    member_type_id       INTEGER UNSIGNED NOT NULL,
    subs_id              INTEGER UNSIGNED NOT NULL,
);

CREATE INDEX member_type_id_fk ON member (member_type_id);
CREATE INDEX member_subs_id_fk ON member (subs_id);


CREATE TABLE member_type (
    member_type_id       INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    type_name            VARCHAR(100) NOT NULL
);


CREATE TABLE notice (
    notice_id            INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    title                VARCHAR(200) NULL,
    content              VARCHAR(400) NULL,
    notice_date          DATETIME NULL,
    image_url            VARCHAR(200) NULL,
    member_id            INTEGER UNSIGNED NOT NULL,
    content_type_id      INTEGER UNSIGNED NOT NULL
);

CREATE INDEX notice_member_id_fk ON notice (member_id);
CREATE INDEX notice_content_type_id_fk ON notice (content_type_id);


CREATE TABLE notice_view (
    view_date            DATETIME NULL,
    notice_id            INTEGER UNSIGNED NOT NULL,
    member_id            INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (notice_id, member_id)  -- 기본 키로 설정
);

CREATE INDEX notice_view_notice_id_fk ON notice_view (notice_id);
CREATE INDEX notice_view_member_id_fk ON notice_view (member_id);


CREATE TABLE payment (
    payment_id           INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    payment_date         DATE NULL,
    payment_token        VARCHAR(100) NULL,
    start_date           DATE NULL,
    end_date             DATE NULL,
    member_id            INTEGER UNSIGNED NOT NULL,
    subs_id              INTEGER UNSIGNED NOT NULL,
    payment_type_id      INTEGER UNSIGNED NOT NULL,
    subs_status_id       INTEGER UNSIGNED NOT NULL
);

CREATE INDEX payment_member_id_fk ON payment (member_id);
CREATE INDEX payment_subs_id_fk ON payment (subs_id);
CREATE INDEX payment_type_id_fk ON payment (payment_type_id);
CREATE INDEX payment_subs_status_id_fk ON payment (subs_status_id);


CREATE TABLE payment_type (
    payment_type_id      INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    type_name            VARCHAR(100) NOT NULL
);


CREATE TABLE product (
    product_id           INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    name                 VARCHAR(100) NULL,
    description          VARCHAR(400) NULL,
    price                INTEGER UNSIGNED NULL,
    product_type_id      INTEGER UNSIGNED NOT NULL
);

CREATE INDEX product_type_fk ON product (product_type_id);


CREATE TABLE product_type (
    product_type_id      INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    type_name            VARCHAR(100) NOT NULL
);


CREATE TABLE subs (
    subs_id              INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    name                 VARCHAR(100) NOT NULL,
    price                INTEGER UNSIGNED NULL
);


CREATE TABLE subs_status (
    subs_status_id       INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- 기본 키로 설정
    status_name          VARCHAR(100) NOT NULL
);


-- 외래 키 설정
ALTER TABLE board
ADD FOREIGN KEY (member_id) REFERENCES member (member_id);

ALTER TABLE board
ADD FOREIGN KEY (content_type_id) REFERENCES content_type (content_type_id);

ALTER TABLE board_view
ADD FOREIGN KEY (board_id) REFERENCES board (board_id);

ALTER TABLE board_view
ADD FOREIGN KEY (member_id) REFERENCES member (member_id);

ALTER TABLE content_type
ADD FOREIGN KEY (content_category_id) REFERENCES content_category (content_category_id);

ALTER TABLE eco_bag
ADD FOREIGN KEY (member_id) REFERENCES member (member_id);

ALTER TABLE eco_bag
ADD FOREIGN KEY (product_id) REFERENCES product (product_id);

ALTER TABLE inquiry
ADD FOREIGN KEY (member_id) REFERENCES member (member_id);

ALTER TABLE inquiry
ADD FOREIGN KEY (inquiry_status_id) REFERENCES inquiry_status (inquiry_status_id);

ALTER TABLE inquiry
ADD FOREIGN KEY (content_type_id) REFERENCES content_type (content_type_id);

ALTER TABLE inquiry_comment
ADD FOREIGN KEY (inquiry_id) REFERENCES inquiry (inquiry_id);

ALTER TABLE member
ADD FOREIGN KEY (member_type_id) REFERENCES member_type (member_type_id);

ALTER TABLE member
ADD FOREIGN KEY (subs_id) REFERENCES subs (subs_id);

ALTER TABLE notice
ADD FOREIGN KEY (member_id) REFERENCES member (member_id);

ALTER TABLE notice
ADD FOREIGN KEY (content_type_id) REFERENCES content_type (content_type_id);

ALTER TABLE notice_view
ADD FOREIGN KEY (notice_id) REFERENCES notice (notice_id);

ALTER TABLE notice_view
ADD FOREIGN KEY (member_id) REFERENCES member (member_id);

ALTER TABLE payment
ADD FOREIGN KEY (member_id) REFERENCES member (member_id);

ALTER TABLE payment
ADD FOREIGN KEY (subs_id) REFERENCES subs (subs_id);

ALTER TABLE payment
ADD FOREIGN KEY (payment_type_id) REFERENCES payment_type (payment_type_id);

ALTER TABLE payment
ADD FOREIGN KEY (subs_status_id) REFERENCES subs_status (subs_status_id);

ALTER TABLE product
ADD FOREIGN KEY (product_type_id) REFERENCES product_type (product_type_id);
