import express from 'express';
import { addBookmark, checkStatusOrder, disableBookmark, editAddress, getServiceInfo, getuserBookmarks, orderStatus } from '../controllers/customerController.js';

const router = express.Router();

router.post('/edit_address', editAddress )
router.post('/add_bookmark', addBookmark)
router.post('/disable_bookmark', disableBookmark)
router.get('/getuserbookmarks', getuserBookmarks)
router.get('/getServiceInfo', getServiceInfo)
router.get('/order_status/:user_id', orderStatus)
router.get('/checkStatusOrder/:request_id', checkStatusOrder)

export default router;
