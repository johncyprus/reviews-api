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
        primaryKey: true,
        as: 'review_id',
        autoIncrement: true
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id"
      }
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
    },
    date: {
      type: Sequelize.DATEONLY,
      defaultValue: Date.now
    },
    summary: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        len: [1, 60]
      }
    },
    body: {
      type: Sequelize.STRING(1000),
      allowNull: false,
      validate: {
        len: [1, 1000]
      }
    },
    recommend: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('recommend');
        return rawValue ? 1 : 0;
      }
    },
    reported: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    reviewer_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    reviewer_email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    response: {
      type: Sequelize.STRING,
      allowNull: true
    },
    helpfulness: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
}, {
    timestamps: false,
    underscored: true
});

const ReviewsPhotos = sequelize.define('reviews_photos', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    review_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Reviews,
        key: 'id'
      }
    },
    url: {
      type: Sequelize.STRING(280),
      allowNull: false
    }
}, {
    timestamps: false,
    underscored: true
});

const Products = sequelize.define('products', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  category: {
    type: Sequelize.STRING(280),
    allowNull: false
  },
  default_price: {
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
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "products",
      key: "id"
    }
  },
  name: {
    type: Sequelize.STRING(280),
    allowNull: false
  }
}, {
  timestamps: false
});

const CharacteristicReview = sequelize.define('characteristic_review', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  characteristic_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "characteristics",
      key: "id"
    }
  },
  review_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "reviews",
      key: "id"
    }
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
  as: 'photos',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});

Reviews.hasMany(CharacteristicReview, {
  foreignKey: 'review_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});

Products.hasMany(Reviews, {
  foreignKey: 'product_id'
});

sequelize.sync({alter: true})
  .then(() => {})
  .catch(error => {
    console.log('ERROR SYNCING:', error)
  })

module.exports = {
  sequelize: sequelize,
  Reviews: Reviews,
  ReviewsPhotos: ReviewsPhotos,
  Products: Products,
  Characteristics: Characteristics,
  CharacteristicReview: CharacteristicReview
};