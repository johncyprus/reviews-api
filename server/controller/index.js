const model = require("../model/index");
const { redisGet, redisSet } = require("../cache/redis");

module.exports = {
  getReviewList: (req, res) => {
    model
      .fetchReviewList(req)
      .then((reply) => {
        res.send(reply);
      })
      .catch((error) => {
        res.sendStatus(500);
        console.log("Error fetching Review List:", error);
      });
  },
  getReviewMeta: (req, res) => {
    redisGet(req.url).then((cached) => {
      if (cached) {
        res.send(JSON.parse(cached));
      } else {
        model
          .fetchReviewMeta(req)
          .then((reply) => {
            let product_id = req.params.product_id;
            let finalObj = {
              product_id: product_id,
              ratings: reply[0],
              recommended: reply[1],
              characteristics: reply[2],
            };
            redisSet(req.url, JSON.stringify(finalObj));
            res.send(finalObj);
          })
          .catch((error) => {
            res.sendStatus(500);
            console.log("Error fetching Metadata:", error);
          });
      }
    });
  },
  postReview: (req, res) => {
    model
      .addReview(req)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((error) => {
        res.sendStatus(500);
        console.log("Error posting review:", error);
      });
  },
  markReviewAsHelpful: (req, res) => {
    model
      .updateReviewHelpfulness(req)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((error) => {
        res.sendStatus(500);
        console.log("Error marking review as helpful:", error);
      });
  },
  reportReview: (req, res) => {
    model
      .updateReviewReportedStatus(req)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((error) => {
        res.sendStatus(500);
        console.log("Error reporting review:", error);
      });
  },
};
