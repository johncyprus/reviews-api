const express = require("express");
const router = express.Router();

const controller = require("./controller/index");

router.get("/reviews/:product_id/list", controller.getReviewList);
router.get("/reviews/:product_id/meta", controller.getReviewMeta);
router.post("/reviews/:product_id", controller.postReview);
router.put("/reviews/helpful/:review_id", controller.markReviewAsHelpful);
router.put("/reviews/report/:review_id", controller.reportReview);

module.exports = router;
