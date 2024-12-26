-- member_type 테이블에 데이터 삽입
INSERT INTO member_type (type_name) VALUES
('일반회원'),
('프리미엄회원');

-- subs 테이블에 데이터 삽입
INSERT INTO subs (name, price) VALUES
('구독 A', 5000),
('구독 B', 10000);

-- member 테이블에 데이터 삽입
INSERT INTO member (name, email, pwd, phone, eco_point, image_url, member_type_id, subs_id, address) VALUES
('홍길동', 'hong@example.com', 'password123', '010-1234-5678', 100, 'https://placehold.co/250x200', 1, 1, '서울시 동작구 상도동'),
('김철수', 'kim@example.com', 'password456', '010-9876-5432', 150, 'https://placehold.co/250x200', 2, 1, '서울시 금천구 가산디지털단지'),
('이영희', 'lee@example.com', 'password789', '010-5555-5555', 200, 'https://placehold.co/250x200', 1, 2, '경기도 시흥시 롯데아울렛');


-- content_category 테이블에 데이터 삽입
INSERT INTO content_category (category_name) VALUES
('공지사항'),
('이벤트');

-- content_type 테이블에 데이터 삽입
INSERT INTO content_type (type_name, content_category_id) VALUES
('게시글', 1),
('댓글', 1),
('질문', 2);

-- board 테이블에 데이터 삽입
INSERT INTO board (title, content, board_date, image_url, member_id, content_type_id) VALUES
('첫 번째 게시글', '안녕하세요, 첫 번째 게시글입니다.', NOW(), 'https://placehold.co/250x200', 1, 1),
('두 번째 게시글', '이것은 두 번째 게시글입니다.', NOW(), 'https://placehold.co/250x200', 2, 1);

-- inquiry_status 테이블에 데이터 삽입
INSERT INTO inquiry_status (status_name) VALUES
('처리 중'),
('완료');

-- inquiry 테이블에 데이터 삽입
INSERT INTO inquiry (title, content, inquiry_date, member_id, inquiry_status_id, content_type_id) VALUES
('문의 1', '첫 번째 문의입니다.', NOW(), 1, 1, 1),
('문의 2', '두 번째 문의입니다.', NOW(), 2, 2, 1);

-- inquiry_comment 테이블에 데이터 삽입
INSERT INTO inquiry_comment (comment, comment_date, inquiry_id) VALUES
('첫 번째 댓글입니다.', NOW(), 1),
('두 번째 댓글입니다.', NOW(), 2);

-- product_type 테이블에 데이터 삽입
INSERT INTO product_type (type_name) VALUES
('타입 A'),
('타입 B');

-- product 테이블에 데이터 삽입
INSERT INTO product (name, description, price, product_type_id) VALUES
('제품 A', '제품 A의 설명입니다.', 10000, 1),
('제품 B', '제품 B의 설명입니다.', 20000, 2);

-- eco_bag 테이블에 데이터 삽입
INSERT INTO eco_bag (added_date, member_id, product_id) VALUES
(NOW(), 1, 1),
(NOW(), 2, 2);

-- notice 테이블에 데이터 삽입
INSERT INTO notice (title, content, notice_date, image_url, member_id, content_type_id) VALUES
('공지 1', '첫 번째 공지사항입니다.', NOW(), 'https://placehold.co/250x200', 1, 1),
('공지 2', '두 번째 공지사항입니다.', NOW(), 'https://placehold.co/250x200', 2, 1);

-- subs_status 테이블에 데이터 삽입
INSERT INTO subs_status (status_name) VALUES
('활성'),
('비활성');

-- payment_type 테이블에 데이터 삽입
INSERT INTO payment_type (type_name) VALUES
('신용카드'),
('체크카드'),
('계좌이체'),
('휴대폰 결제'),
('가상계좌');

-- payment 테이블에 데이터 삽입
INSERT INTO payment (payment_date, payment_token, start_date, end_date, member_id, subs_id, payment_type_id, subs_status_id) VALUES
(NOW(), 'token1', NOW(), NOW() + INTERVAL 1 MONTH, 1, 1, 1, 1),
(NOW(), 'token2', NOW(), NOW() + INTERVAL 1 MONTH, 2, 1, 1, 1);
