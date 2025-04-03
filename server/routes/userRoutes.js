import express from 'express';
import { 
    addUserInfo, 
    checkUserPhone, 
    editProfile ,
    updateUserInfo,
    deleteUserInfo
} from '../controllers/userController.js';

const router = express.Router();

router.post("/add_user_info", addUserInfo);
router.get("/check_user_phone", checkUserPhone);
router.post("/edit_profile", editProfile);
router.post("/updateUserInfo", updateUserInfo);
router.post("/deleteUserInfo", deleteUserInfo);

export default router;
