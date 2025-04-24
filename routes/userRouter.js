const userRouter=require('express').Router();
const userController=require('../controllers/userController');

userRouter.post('/register',userController.userRegister);
userRouter.post('/login',userController.userLogin);
module.exports=userRouter;