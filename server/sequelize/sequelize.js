const Sequelize = require('sequelize');
const {database, username, password, host} = require('../../config.js');

const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: 'postgres'
  });

sequelize.authenticate()
  .then(() => {
    console.log('DB connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Reviews = sequelize.define('reviews', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        as: 'review_id'
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    summary: {
      type: Sequelize.STRING,
      allowNull: false
    },
    body: {
      type: Sequelize.STRING(1000),
      allowNull: false
    },
    reviewer_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    helpfulness: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    response: {
      type: Sequelize.STRING,
      allowNull: true
    },
    reported: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    reviewer_email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    recommend: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('recommend');
        return rawValue ? 1 : 0;
      }
    }
}, {
    timestamps: false,
    underscored: true
});

const ReviewsPhotos = sequelize.define('reviews_photos', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    url: {
      type: Sequelize.STRING(280),
      allowNull: false
    },
    review_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Reviews,
        key: 'id'
      }
    }
}, {
    timestamps: false,
    underscored: true
});

const Products = sequelize.define('products', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(280),
    allowNull: false
  },
  slogan: {
    type: Sequelize.STRING(280),
    allowNull: false
  },
  description: {
    type: Sequelize.STRING(1000),
    allowNull: false
  },
  default_price: {
    type: Sequelize.STRING(280),
    allowNull: false
  },
  category: {
    type: Sequelize.STRING(280),
    allowNull: false
  }
}, {
  timestamps: false,
  underscored: true
});

const Characteristics = sequelize.define('characteristics', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(280),
    allowNull: false
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

const CharacteristicReview = sequelize.define('characteristic_review', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  characteristic_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  review_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  value: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true,
  tableName: 'characteristic_review'
});

Reviews.hasMany(ReviewsPhotos, {
  foreignKey: 'review_id',
  as: 'photos'
});

Products.hasMany(Reviews, {
  foreignKey: 'product_id'
});

sequelize.sync({force: false});

module.exports = {
  sequelize: sequelize,
  Reviews: Reviews,
  ReviewsPhotos: ReviewsPhotos,
  Products: Products,
  Characteristics: Characteristics,
  CharacteristicReview: CharacteristicReview
};