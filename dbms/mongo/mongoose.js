const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/FECReviewAPI')
  .then(() => {
    // console.log('im connected to mongo');
  })
  .catch(() => {
    // console.log(err);
  });

const Products = mongoose.model('Product', new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    primaryKey: true,
  },
  name: {
    type: String,
    required: true,
  },
  slogan: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  default_price: {
    type: Number,
    required: true,
  },
}));

const Reviews = mongoose.model('Review', new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    primaryKey: true,
  },
  product_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }],
  rating: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  summary: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  recommended: {
    type: Boolean,
    required: true,
  },
  reported: {
    type: Boolean,
  },
  reviewer_name: {
    type: String,
  },
  reviewer_email: {
    type: String,
  },
  response: {
    type: String,
  },
  helpfulness: {
    type: Number,
  },
}));

const Photos = mongoose.model('Photo', new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    primaryKey: true,
  },
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reviews' }],
  url: {
    type: String,
  },
}));

const Characteristics = mongoose.model('Characteristic', new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    primaryKey: true,
  },
  product_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }],
  name: {
    type: String,
    required: true,
  },
}));

const CharacteristicsReview = mongoose.model('Characteristic_Reviews', new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    primaryKey: true,
  },
  characteristic_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Characteristics' }],
  },
  review_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reviews' }],
  },
  value: {
    type: Number,
    required: true,
  },
}));

module.exports = {
  Products, Reviews, Photos, Characteristics, CharacteristicsReview,
};
