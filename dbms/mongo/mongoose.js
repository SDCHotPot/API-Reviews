const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/FECReviewAPI')
  .then(() => {
    console.log('im connected to mongo');
  })
  .catch((err) => {
    console.log(err);
  });

const ReviewPhotos = mongoose.model('ReviewPhoto', new mongoose.Schema({
  photos: {
    type: String,
  },
  review: {
    type: mongoose.Schema.ObjectId,
    ref: 'Reviews',
  },
}));

const Reviews = mongoose.model('Review', new mongoose.Schema({
  review_id: {
    type: Number,
  },
  rating: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  recommended: {
    type: Boolean,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  response: String,
  date: {
    type: Date,
    required: true,
  },
  reviewer_name: {
    type: String,
    required: true,
  },
  helpfulness: {
    type: Boolean,
    required: true,
  },
}));

module.exports = { Reviews, ReviewPhotos };
