const router = require('express').Router();
const HomeController = require("../controllers/HomeController");
const auth = require('../middlewares/auth')


router.get('/', HomeController.index);
router.get('/user/id/:id', HomeController.searchByid);
router.get('/user/email/:email', HomeController.searchByemail);
router.put('/edit/user/:id', auth, HomeController.editUser);
router.post('/user', auth, HomeController.create);
router.delete('/user/:id', auth, HomeController.deleteUser);
router.post('/recoverpassword/:email', HomeController.recoverPassword);
router.post('/changepassword', HomeController.changePassword);
router.post('/login', HomeController.login);


module.exports = router;