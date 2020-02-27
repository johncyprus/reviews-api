const model = require('../model/index');

// Should handle the requests and respond to the clients with data.
module.exports = {
    getReviewList: (req, res) => {
        model.fetchReviewList(req, res)
            .then(reply => {
                res.send(reply);
            })
            .catch(error => {
                console.log('Error fetching Review List:', error);
            })
    },
    getReviewMeta: (req, res) => {
        model.fetchReviewMeta(req, res)
            .then(reply => {
                let product_id = req.params.product_id;
                let finalObj = {
                    product_id: product_id,
                    ratings: reply[0],
                    recommended: reply[1],
                    characteristics: reply[2]
                };
                res.send(finalObj);
            })
            .catch(error => {
                console.log('Error fetching Metadata:', error);
            })
    },
    postReview: (req, res) => {
        model.addReview(req, res)
    }
}