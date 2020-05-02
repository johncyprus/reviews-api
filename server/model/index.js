const {
  sequelize,
  Reviews,
  ReviewsPhotos,
  CharacteristicReview,
} = require("../sequelize/sequelize");

const { redisGet, redisSet } = require("../cache/redis");

// Should interact with Postgres and pass the data back to controller.
module.exports = {
  fetchReviewList: (req) => {
    let product_id = req.params.product_id;
    let page = req.query.page || 1;
    let count = Number(req.query.count) || 5;
    let sort = req.query.sort;
    let orderBy;
    if (sort === "newest") {
      orderBy = [["id", "DESC"]];
    } else if (sort === "helpful") {
      orderBy = [["helpfulness", "DESC"]];
    } else if (sort === "relevant") {
      orderBy = [
        ["id", "DESC"],
        ["helpfulness", "DESC"],
      ];
    }

    return redisGet(req.url).then((reply) => {
      if (reply) {
        return JSON.parse(reply);
      } else {
        let reply = {
          product: product_id,
          page: page - 1,
          count: count,
        };

        return Reviews.findAll({
          where: {
            product_id: product_id,
            reported: false,
          },
          order: orderBy,
          attributes: [
            ["id", "review_id"],
            "rating",
            "summary",
            "body",
            "reviewer_name",
            "helpfulness",
            "date",
            "product_id",
            "response",
            "recommend",
          ],
          limit: count,
          offset: count * (page - 1),
          include: [
            {
              model: ReviewsPhotos,
              as: "photos",
            },
          ],
        }).then((response) => {
          let results = JSON.parse(JSON.stringify(response));
          reply["results"] = results;
          redisSet(req.url, JSON.stringify(reply));
          return reply;
        });
      }
    });
  },
  fetchReviewMeta: (req) => {
    let product_id = req.params.product_id;
    let ratingsQuery = `SELECT rating, COUNT(*) FROM reviews WHERE id IN (SELECT id FROM reviews WHERE reviews.product_id = ${product_id}) GROUP BY rating `;
    let ratingsPromise = sequelize.query(ratingsQuery).then(([results]) => {
      if (results.length === 0) {
        return {};
      }
      let ratings = {};
      results.forEach((item) => {
        ratings[item.rating] = Number(item.count);
      });
      return ratings;
    });

    let recommendedQuery = `SELECT recommend, COUNT(*) FROM reviews WHERE id IN (SELECT id FROM reviews WHERE reviews.product_id = ${product_id}) GROUP BY recommend ORDER BY recommend ASC`;
    let recommendedPromise = sequelize
      .query(recommendedQuery)
      .then(([results]) => {
        if (results.length === 0) {
          return { 0: 0, 1: 0 };
        }
        let recommended = { 0: 0, 1: 0 };
        results.forEach((item) => {
          if (item.recommend === false) {
            recommended[0] = Number(item.count);
          } else {
            recommended[1] = Number(item.count);
          }
        });
        return recommended;
      });

    let characteristicsQuery = `SELECT c1.id, c1.name, avg(cr."value") FROM characteristics c1 INNER JOIN characteristic_review cr ON (c1.id = cr.characteristic_id) WHERE c1.product_id = ${product_id} GROUP BY c1.id`;
    let characteristicsPromise = sequelize
      .query(characteristicsQuery)
      .then(([results]) => {
        let characteristics = {};
        results.forEach((item) => {
          characteristics[item.name] = {
            id: item.id,
            value: Number(item.avg).toFixed(4),
          };
        });
        return characteristics;
      });

    return Promise.all([
      ratingsPromise,
      recommendedPromise,
      characteristicsPromise,
    ]);
  },
  addReview: (req) => {
    let product_id = req.params.product_id;
    let {
      characteristics,
      photos,
      rating,
      summary,
      body,
      name,
      email,
      recommend,
    } = req.body;

    return Reviews.create({
      rating,
      summary,
      body,
      reviewer_name: name,
      product_id,
      reviewer_email: email,
      recommend,
    }).then((response) => {
      let reviewInsertId = JSON.parse(JSON.stringify(response.id));
      for (let charId in characteristics) {
        CharacteristicReview.create({
          characteristic_id: Number(charId),
          review_id: reviewInsertId,
          value: characteristics[charId],
        }).catch((error) => {
          console.log("ERROR POSTING CHARACTER REVIEW:", error);
        });
      }

      if (photos.length !== 0 || photos !== undefined) {
        photos.forEach((url) => {
          ReviewsPhotos.create({
            review_id: reviewInsertId,
            url: url,
          }).catch((error) => {
            console.log("ERROR POSTING PHOTOS:", error);
          });
        });
      }
    });
  },
  updateReviewHelpfulness: (req) => {
    let { review_id } = req.params;
    return Reviews.increment("helpfulness", {
      by: 1,
      where: { id: review_id },
    });
  },
  updateReviewReportedStatus: (req) => {
    let { review_id } = req.params;
    return Reviews.update({ reported: true }, { where: { id: review_id } });
  },
};
