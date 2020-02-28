# sdc-ratings-and-reviews

```python
['id', 'product_id', 'rating', 'date', 'summary', 'body', 'recommend', 'reported', 'reviewer_name', 'reviewer_email', 'response', 'helpfulness']
```

********** Load PRODUCTS CSV first. Most tables depend on this table.
 - COPY 1000011

copy products
from '/Users/johnlee/Desktop/sdc - ratings and reviews/CSV Files/product.csv'
delimiter ','
csv header;

********** Load REVIEWS CSV next. Foreign key constraints on the Reviews Model will be acknowledged if Products was loaded in first.
 - COPY 5777922

copy reviews
from '/Users/johnlee/Desktop/sdc - ratings and reviews/CSV Files/reviews.csv'
delimiter ','
csv header;

********** Load REVIEWS PHOTOS CSV next
 - COPY 2742832



copy reviews_photos
from '/Users/johnlee/Desktop/sdc - ratings and reviews/CSV Files/reviews_photos.csv'
delimiter ','
csv header;

********** There are 1,121,262 reviews that have summaries exceeding 60 chars. Run the following to delete all of these entries from the review list db.

DELETE from reviews where id in (SELECT id from reviews where length(summary) > 60);

********** Foreign key constraints and associations should be OFF before you were importing Photos. You add these back in AFTER loading photos and you should expect some errors. You need to identify which entries in photos relied on the now-deleted reviews and delete those as well. THEN you can add the constraints back on.

********** Load CHARACTERISTICS CSV next
 - COPY 3347478

copy characteristics
from '/Users/johnlee/Desktop/sdc - ratings and reviews/CSV Files/characteristics.csv'
delimiter ','
csv header;

********** Load CHARACTERISTICS REVIEWS CSV next

copy characteristic_review
from '/Users/johnlee/Desktop/sdc - ratings and reviews/CSV Files/characteristic_reviews.csv'
delimiter ','
csv header;

*********** Identify which rows in Characteristic_Reviews to delete. Find which rows rely on missing id's in Reviews and delete them using the following sql:

select review_id from characteristic_review where not exists (select id from reviews where id = characteristic_review.review_id) ORDER BY review_id asc;
 review_id 

delete from characteristic_review where not exists (select id from reviews where id = characteristic_review.review_id);

---
