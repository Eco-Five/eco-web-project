
## 프로젝트 시작
1. git clone [레포지토리 URL]  -> 프로젝트 폴더 생성
2. git checkout develop  -> develop 브랜치로 이동
3. git branch feature/[페이지명]  -> 브랜치 생성
ex) git branch feature/main, git branch feature/payment
4. git checkout feature/[페이지명] -> 담당 브랜치로 이동
5. npm install
6. 프로젝트 시작

<br />

## 프로젝트 관리
1. 페이지 구현 시, 지정 폴더에서만 작업
2. 단위 테스트를 위해 **index.ejs 파일은 수정 가능**
3. 이미지, CSS 파일은 images, styles 폴더에 지정폴더 생성하여 관리
4. 지정폴더 외 파일 수정이 필요할 경우, 꼭 사전 논의 필요
5. 1개의 브랜치에서 1개의 페이지(담당파트)만 작업
(담당하는 파트가 2개이면 2개 브랜치 생성하여 별도 작업)
6. commit -m "진행한 작업 간략히 명시" -> 작업 진행 상황 확인 목적

<br />

## mkcert & SSL 인증서 설치
1. 로컬 환경에서 HTTPS 프로토콜과 API 테스트를 진행
2. `mkcert`를 사용하여 로컬에 신뢰할 수 있는 SSL 인증서 생성 가능
3. 도메인이 불필요하므로 무료로 프로젝트 테스트가 가능

<br/>

## **https 환경 설정을 위한 mkcert 설치**
Chocolatey나 Scoop 같은 패키지 매니저를 통해 손쉽게 설치 가능합니다.
- PowerShell 관리자 권한 실행
- mkcert Window 설치 : `choco install mkcert`
- 로컬인증서 설치 : `mkcert -install` (보안 경고창이 나타나면 예를 클릭)
- SSL 인증서 및 개인키 생성 : `mkcert -key-file key.pem -cert-file cert.pem localhost`
- `key.pem`과 `cert.pem`이라는 이름으로 저장됨