const {
    Reviews, 
    ReviewsPhotos, 
    Products, 
    Characteristics, 
    CharacteristicReviews
} = require('../sequelize/sequelize');

// Should interact with Postgres and pass the data back to controller.
module.exports = {
    fetchReviewList: (req, res) => {
        let url = req.url;
        let product_id = req.params.product_id;
        let page = req.query.page;
        let count = Number(req.query.count);
        let sort = req.query.sort; 

        Reviews.findAll({ limit: count })
            .then(response => {
                console.log('testing query:', JSON.parse(JSON.stringify(response)));
            })

        console.log('test url:', url);
        console.log('test id:', product_id);
        console.log('test page:', page);
        console.log('test count:', count);
        console.log('test sort:', sort);

        res.send('Testing Router Get Reviews');
    }
}