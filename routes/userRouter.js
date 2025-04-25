const userRouter=require('express').Router();
const userController=require('../controllers/userController');

userRouter.post('/register',userController.userRegister);
userRouter.post('/login',userController.userLogin);
userRouter.patch('/:username/forgot',userController.updatePassword);
userRouter.post('/admin/login',userController.adminLogin);
module.exports=userRouter;