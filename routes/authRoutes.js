
const AuthController = require('../controllers/AuthController');
const { userSignUpValidation, userLoginValidation, validate } = require('../middlewares/validator')

class AuthRoutes {
    loadRoutes(app) {
        app.post('/signup', userSignUpValidation(), validate, (req, res) => {
            console.log('/signup')
            this.authCtrl = new AuthController();
            this.authCtrl.signUp(req, res)
        });
        app.post('/login', userLoginValidation(), validate, (req, res) => {
            this.authCtrl = new AuthController();
            this.authCtrl.login(req, res)
        });
    }

}

module.exports = AuthRoutes;