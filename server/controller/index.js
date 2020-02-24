const model = require('../model/index');

// Should handle the requests and respond to the clients with data.
module.exports = {
    getReviewList: (req, res) => {
        model.fetchReviewList(req, res);
    }
}