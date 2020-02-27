const {
    sequelize,
    Reviews, 
    ReviewsPhotos, 
    Products, 
    Characteristics, 
    CharacteristicReviews
} = require('../sequelize/sequelize');

// Should interact with Postgres and pass the data back to controller.
module.exports = {
    fetchReviewList: (req) => {
        let product_id = req.params.product_id;
        let page = req.query.page;
        let count = Number(req.query.count);
        // let sort = req.query.sort; 

        let reply = {
            product: product_id,
            page: page - 1,
            count: count
        };

        return Reviews.findAll({
            where: {
                product_id: product_id
            },
            attributes: [
                ['id', 'review_id'],
                'rating',
                'summary',
                'body',
                'reviewer_name',
                'helpfulness',
                'date',
                'product_id',
                'response',
                'recommend'
            ], 
            limit: count,
            order: sequelize.col('id'),
            include: [
                {
                    model: ReviewsPhotos,
                    as: 'photos'
                }
            ] 
        })
        .then(response => {
            let results = JSON.parse(JSON.stringify(response));
            reply["results"] = results;
            return reply;
        });
    },
    fetchReviewMeta: (req) => {
        let product_id = req.params.product_id;

        let ratingsQuery = `SELECT rating, COUNT(*) FROM reviews WHERE id IN (SELECT id FROM reviews WHERE reviews.product_id = ${product_id}) GROUP BY rating `
        let ratingsPromise = sequelize.query(ratingsQuery)
            .then(([results]) => {
                if (results.length === 0) {
                    return {};
                }
                let ratings = {};
                results.forEach((item) => {
                    ratings[item.rating] = Number(item.count);
                });
                return ratings;
            });
        
        let recommendedQuery = `SELECT recommend, COUNT(*) FROM reviews WHERE id IN (SELECT id FROM reviews WHERE reviews.product_id = ${product_id}) GROUP BY recommend ORDER BY recommend ASC`
        let recommendedPromise = sequelize.query(recommendedQuery)
            .then(([results]) => {
                if (results.length === 0) {
                    return {0: 0, 1: 0};
                }
                let recommended = {
                    0: Number(results[0].count),
                    1: Number(results[1].count)
                };
                return recommended;
            });
        
        let characteristicsQuery = `SELECT c1.id, c1.name, avg(cr."value") FROM characteristics c1 INNER JOIN characteristic_review cr ON (c1.id = cr.characteristic_id) WHERE c1.product_id = ${product_id} GROUP BY c1.id`
        let characteristicsPromise = sequelize.query(characteristicsQuery)
            .then(([results]) => {
                let characteristics = {};
                results.forEach(item => {
                    characteristics[item.name] = {
                        id: item.id,
                        value: Number(item.avg).toFixed(4)
                    };
                });
                return characteristics;
            });
        
        return Promise.all([ratingsPromise, recommendedPromise, characteristicsPromise]);
    },
    addReview: (req, res) => {
        let url = req.url;
        let product_id = req.params.product_id;

        Reviews.create({
            rating: req.body.rating,
            summary: req.body.summary,
            body: req.body.body,
            reviewer_name: req.body.name,
            product_id: product_id,
            reviewer_email: req.body.email,
            recommend: req.body.recommend
        })
        .then((response) => {
            console.log('testing Review Create:', response);
        })
        // console.log('testing url:', url);
        // console.log('testing id:', product_id);
        // console.log('testing body:', body);

        res.send('Testing Model POST REVIEW');
    }
}