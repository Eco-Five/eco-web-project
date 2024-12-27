// .env 파일의 환경 변수 로드
// npm install dotenv
// dotenv 패키지는 NodeJS 환경에서 환경변수를 관리할 수 있도록 도와주는 패키지 입니다.
// config() 메서드는 .env 파일을 읽고, 정의된 환경변수를 process.env 객체에 추가합니다. 
require('dotenv').config();

// mysql2 패키지의 promise 기반 API를 사용하겠다는 의미
const mysql = require('mysql2/promise');

// Connection Pool
// 데이터베이스 커넥션풀 생성
const pool = mysql.createPool({
    host: process.env.DB_HOST,         // 연결할 DB 서버의 주소 (localhost or IP Address)
    port: process.env.DB_PORT,         // 연결할 DB 포트번호
    user: process.env.DB_USER,         // DB USER NAME
    password: process.env.DB_PASSWORD, // DB PASSWORD
    database: process.env.DB_NAME,     // 연결할 데이터베이스 이름

    //Connection pool settings
    connectionLimit: 100,       // 동시에 활성화 가능한 최대 커넥션 수
    maxIdle: 100,               // 유휴상태의 커넥션 최대 수 (주로 connectionLimit과 같은값 사용)
    idleTimeout: 60000,         // 유휴상태의 커넥션의 대기시간 (대기시간 동안 연결이 없으면 자동종료)
    // enableKeepAlive: true,      // 유휴상태의 커넥션 대기상태 최적화 여부 (TCP연결에서 Keep-Alive 패킷 사용) 
    // keepAliveInitialDelay: 0,   // Keep-Alive 패킷 전송 주기
    waitForConnections: true,   // 최대 연결 수를 초과하는 요청을 대기시킬지에 대한 여부
    queueLimit: 0               // 대기 중인 연결 요청의 최대 수 (0은 무제한)
})

module.exports = pool