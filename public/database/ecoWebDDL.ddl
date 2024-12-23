
CREATE TABLE board
(
	board_id             INTEGER UNSIGNED AUTO_INCREMENT,
	title                VARCHAR(200) NULL,
	content              VARCHAR(400) NULL,
	date                 DATETIME NULL,
	image_url            VARCHAR(200) NULL,
	member_id            INTEGER UNSIGNED NOT NULL,
	content_type_id      INTEGER UNSIGNED NOT NULL
);



ALTER TABLE board
ADD PRIMARY KEY (board_id);



CREATE INDEX board_member_id_fk ON board
(
	member_id
);



CREATE INDEX board_content_type_id_fk ON board
(
	content_type_id
);



CREATE TABLE board_view
(
	view_date            DATETIME NULL,
	heart                INTEGER NULL,
	board_id             INTEGER UNSIGNED NOT NULL,
	member_id            INTEGER UNSIGNED NOT NULL
);



ALTER TABLE board_view
ADD PRIMARY KEY (member_id,board_id);



CREATE INDEX board_view_board_id_fk ON board_view
(
	board_id
);



CREATE INDEX board_view_member_id_fk ON board_view
(
	member_id
);



CREATE TABLE content_category
(
	content_category_id  INTEGER UNSIGNED AUTO_INCREMENT,
	category_name        VARCHAR(100) NOT NULL
);



ALTER TABLE content_category
ADD PRIMARY KEY (content_category_id);



CREATE TABLE content_type
(
	content_type_id      INTEGER UNSIGNED AUTO_INCREMENT,
	type_name            VARCHAR(100) NOT NULL,
	content_category_id  INTEGER UNSIGNED NOT NULL
);



ALTER TABLE content_type
ADD PRIMARY KEY (content_type_id);



CREATE INDEX content_type_category_id_fk ON content_type
(
	content_category_id
);



CREATE TABLE eco_bag
(
	added_date           DATETIME NOT NULL,
	member_id            INTEGER UNSIGNED NOT NULL,
	product_id           INTEGER UNSIGNED NOT NULL
);



ALTER TABLE eco_bag
ADD PRIMARY KEY (member_id,product_id);



CREATE INDEX eco_member_id_fk ON eco_bag
(
	member_id
);



CREATE INDEX eco_product_id_fk ON eco_bag
(
	product_id
);



CREATE TABLE inquiry
(
	inquiry_id           INTEGER UNSIGNED AUTO_INCREMENT,
	title                VARCHAR(200) NULL,
	content              VARCHAR(400) NULL,
	date                 DATETIME NULL,
	member_id            INTEGER UNSIGNED NOT NULL,
	inquiry_status_id    INTEGER UNSIGNED NOT NULL,
	content_type_id      INTEGER UNSIGNED NOT NULL
);



ALTER TABLE inquiry
ADD PRIMARY KEY (inquiry_id);



CREATE INDEX inquiry_member_id_fk ON inquiry
(
	member_id
);



CREATE INDEX inquiry_status_id_fk ON inquiry
(
	inquiry_status_id
);



CREATE INDEX inquiry_content_type_id_fk ON inquiry
(
	content_type_id
);



CREATE TABLE inquiry_comment
(
	inquiry_comment_id   INTEGER UNSIGNED AUTO_INCREMENT,
	comment              VARCHAR(300) NULL,
	date                 DATETIME NULL,
	inquiry_id           INTEGER UNSIGNED NOT NULL
);



ALTER TABLE inquiry_comment
ADD PRIMARY KEY (inquiry_comment_id);



CREATE INDEX inquiry_comment_inquiry_id_fk ON inquiry_comment
(
	inquiry_id
);



CREATE TABLE inquiry_status
(
	inquiry_status_id    INTEGER UNSIGNED AUTO_INCREMENT,
	status_name          VARCHAR(100) NOT NULL
);



ALTER TABLE inquiry_status
ADD PRIMARY KEY (inquiry_status_id);



CREATE TABLE member
(
	member_id            INTEGER UNSIGNED AUTO_INCREMENT,
	name                 VARCHAR(100) NULL,
	email                VARCHAR(100) NULL,
	password             VARCHAR(100) NULL,
	phone                INTEGER UNSIGNED NULL,
	point                INTEGER UNSIGNED NULL,
	image_url            VARCHAR(200) NULL,
	member_type_id       INTEGER UNSIGNED NOT NULL,
	subs_id              INTEGER UNSIGNED NOT NULL
);



ALTER TABLE member
ADD PRIMARY KEY (member_id);



CREATE INDEX member_type_id_fk ON member
(
	member_type_id
);



CREATE INDEX member_subs_id_fk ON member
(
	subs_id
);



CREATE TABLE member_type
(
	member_type_id       INTEGER UNSIGNED AUTO_INCREMENT,
	type_name            VARCHAR(100) NOT NULL
);



ALTER TABLE member_type
ADD PRIMARY KEY (member_type_id);



CREATE TABLE notice
(
	notice_id            INTEGER UNSIGNED AUTO_INCREMENT,
	title                VARCHAR(200) NULL,
	content              VARCHAR(400) NULL,
	date                 DATETIME NULL,
	image_url            VARCHAR(200) NULL,
	member_id            INTEGER UNSIGNED NOT NULL,
	content_type_id      INTEGER UNSIGNED NOT NULL
);



ALTER TABLE notice
ADD PRIMARY KEY (notice_id);



CREATE INDEX notice_member_id_fk ON notice
(
	member_id
);



CREATE INDEX notice_content_type_id_fk ON notice
(
	content_type_id
);



CREATE TABLE notice_view
(
	view_date            DATETIME NULL,
	notice_id            INTEGER UNSIGNED NOT NULL,
	member_id            INTEGER UNSIGNED NOT NULL
);



ALTER TABLE notice_view
ADD PRIMARY KEY (notice_id,member_id);



CREATE INDEX notice_view_notice_id_fk ON notice_view
(
	notice_id
);



CREATE INDEX notice_view_member_id_fk ON notice_view
(
	member_id
);



CREATE TABLE payment
(
	payment_id           INTEGER UNSIGNED AUTO_INCREMENT,
	payment_date         DATE NULL,
	payment_token        VARCHAR(100) NULL,
	start_date           DATE NULL,
	end_date             DATE NULL,
	member_id            INTEGER UNSIGNED NOT NULL,
	subs_id              INTEGER UNSIGNED NOT NULL,
	payment_type_id      INTEGER UNSIGNED NOT NULL,
	subs_status_id       INTEGER UNSIGNED NOT NULL
);



ALTER TABLE payment
ADD PRIMARY KEY (payment_id);



CREATE INDEX payment_member_id_fk ON payment
(
	member_id
);



CREATE INDEX payment_subs_id_fk ON payment
(
	subs_id
);



CREATE INDEX payment_type_id_fk ON payment
(
	payment_type_id
);



CREATE INDEX payment_subs_status_id_fk ON payment
(
	subs_status_id
);



CREATE TABLE payment_type
(
	payment_type_id      INTEGER UNSIGNED AUTO_INCREMENT,
	type_name            VARCHAR(100) NOT NULL
);



ALTER TABLE payment_type
ADD PRIMARY KEY (payment_type_id);



CREATE TABLE product
(
	product_id           INTEGER UNSIGNED AUTO_INCREMENT,
	name                 VARCHAR(100) NULL,
	description          VARCHAR(400) NULL,
	price                INTEGER UNSIGNED NULL,
	product_type_id      INTEGER UNSIGNED NOT NULL
);



ALTER TABLE product
ADD PRIMARY KEY (product_id);



CREATE INDEX product_type_fk ON product
(
	product_type_id
);



CREATE TABLE product_type
(
	product_type_id      INTEGER UNSIGNED AUTO_INCREMENT,
	type_name            VARCHAR(100) NOT NULL
);



ALTER TABLE product_type
ADD PRIMARY KEY (product_type_id);



CREATE TABLE subs
(
	subs_id              INTEGER UNSIGNED AUTO_INCREMENT,
	name                 VARCHAR(100) NOT NULL,
	price                INTEGER UNSIGNED NULL
);



ALTER TABLE subs
ADD PRIMARY KEY (subs_id);



CREATE TABLE subs_status
(
	subs_status_id       INTEGER UNSIGNED AUTO_INCREMENT,
	status_name          VARCHAR(100) NOT NULL
);



ALTER TABLE subs_status
ADD PRIMARY KEY (subs_status_id);



ALTER TABLE board
ADD FOREIGN KEY R_7 (member_id) REFERENCES member (member_id);



ALTER TABLE board
ADD FOREIGN KEY R_17 (content_type_id) REFERENCES content_type (content_type_id);



ALTER TABLE board_view
ADD FOREIGN KEY R_8 (board_id) REFERENCES board (board_id);



ALTER TABLE board_view
ADD FOREIGN KEY R_9 (member_id) REFERENCES member (member_id);



ALTER TABLE content_type
ADD FOREIGN KEY R_18 (content_category_id) REFERENCES content_category (content_category_id);



ALTER TABLE eco_bag
ADD FOREIGN KEY R_24 (member_id) REFERENCES member (member_id);



ALTER TABLE eco_bag
ADD FOREIGN KEY R_25 (product_id) REFERENCES product (product_id);



ALTER TABLE inquiry
ADD FOREIGN KEY R_6 (member_id) REFERENCES member (member_id);



ALTER TABLE inquiry
ADD FOREIGN KEY R_10 (inquiry_status_id) REFERENCES inquiry_status (inquiry_status_id);



ALTER TABLE inquiry
ADD FOREIGN KEY R_14 (content_type_id) REFERENCES content_type (content_type_id);



ALTER TABLE inquiry_comment
ADD FOREIGN KEY R_12 (inquiry_id) REFERENCES inquiry (inquiry_id);



ALTER TABLE member
ADD FOREIGN KEY R_3 (member_type_id) REFERENCES member_type (member_type_id);



ALTER TABLE member
ADD FOREIGN KEY R_21 (subs_id) REFERENCES subs (subs_id);



ALTER TABLE notice
ADD FOREIGN KEY R_2 (member_id) REFERENCES member (member_id);



ALTER TABLE notice
ADD FOREIGN KEY R_15 (content_type_id) REFERENCES content_type (content_type_id);



ALTER TABLE notice_view
ADD FOREIGN KEY R_4 (notice_id) REFERENCES notice (notice_id);



ALTER TABLE notice_view
ADD FOREIGN KEY R_5 (member_id) REFERENCES member (member_id);



ALTER TABLE payment
ADD FOREIGN KEY R_13 (member_id) REFERENCES member (member_id);



ALTER TABLE payment
ADD FOREIGN KEY R_19 (subs_id) REFERENCES subs (subs_id);



ALTER TABLE payment
ADD FOREIGN KEY R_22 (payment_type_id) REFERENCES payment_type (payment_type_id);



ALTER TABLE payment
ADD FOREIGN KEY R_23 (subs_status_id) REFERENCES subs_status (subs_status_id);



ALTER TABLE product
ADD FOREIGN KEY R_1 (product_type_id) REFERENCES product_type (product_type_id);


