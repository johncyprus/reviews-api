const express = require('express');
const router = express.Router();

const controller = require('./controller/index');

// router.get('/', (req, res) => res.send('Hello World!'));
router.get('/reviews/:product_id/list', (req, res) => {
    // res.send('Testing Router Get Reviews');
    // console.log('What is the url?:', req.originalUrl);
    // console.log('What is Req Params?:', req.params);
    // console.log('What is the Req Query?', req.query);
    // console.log('What is the other url?:', req.url);
    controller.getReviewList(req, res);
});

router.get('/reviews/:product_id/meta', (req, res) => {
    controller.getReviewMeta(req, res);
});

router.post('/reviews/:product_id', (req, res) => {
    controller.postReview(req, res);
})


module.exports = router;