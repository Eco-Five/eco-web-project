class modelFunc {
    /*********************************  구독상품종류  *************************************/
    subsInfo = {
        "기본형" : 2,
        "프리미엄" : 3,
        "기업형" : 4
    }
    /*********************************  구독상품종류  *************************************/

    /*********************************  SessionAuth  *************************************/
    sessionAuth = (req, res) => {
        if(req.session?.user?.isAuthenticated) {
            return req.session.user
        } else {
            return res.redirect('/?message=로그인이 필요합니다!')
        }
    }
    /*********************************  SessionAuth  *************************************/
}

module.exports = modelFunc