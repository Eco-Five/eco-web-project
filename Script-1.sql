use eco_web_db;

select * from notice;

insert into notice
values ('3', '공지 3', '세 번째 공지사항입니다.', 

select * from notice_view;

select * from content_category;

select * from content_type;

select * from member;

select * from member_type;

        SELECT b.notice_id AS id, b.title, b.notice_date, m.name AS member_name, c.type_name AS category
        FROM notice b
        LEFT JOIN member m ON b.member_id = m.member_id
        LEFT JOIN content_type c ON b.content_type_id = c.content_type_id
        ORDER BY b.notice_id DESC
        LIMIT 10 OFFSET 0;

        
select b.*, m.name AS name
from notice b
JOIN member m ON b.member_id = m.member_id
where notice_id = ?;


      SELECT b.notice_id AS id, b.title, b.notice_date AS date, b.content, b.views, 
      m.name AS member_name, c.type_name AS category
      FROM notice b
      LEFT JOIN member m ON b.member_id = m.member_id
      LEFT JOIN content_type c ON b.content_type_id = c.content_type_id
      WHERE b.notice_id = 1;
      
      
ALTER TABLE notice 
MODIFY COLUMN views INT DEFAULT 0;

commit;

select * from notice;


UPDATE notice
SET title = '공지사항 수정1', content = '공지사항 수정되었습니다.', notice_date = NOW()
WHERE notice_id = 1;
 