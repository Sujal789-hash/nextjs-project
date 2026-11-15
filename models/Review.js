import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup',
      required: true,
      index: true,
    },
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investor',
      required: true,
      index: true,
    },
    pitchDeckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PitchDeck',
    },
    businessModelRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      default: 4,
    },
    marketOpportunityRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      default: 4,
    },
    productInnovationRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      default: 4,
    },
    financialProjectionsRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      default: 3,
    },
    overallRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      default: 4,
    },
    writtenFeedback: {
      type: String,
      required: [true, 'Written feedback is required'],
      maxlength: 2500,
    },
    interestLevel: {
      type: String,
      enum: ['High', 'Moderate', 'Need More Traction', 'Pass'],
      default: 'Moderate',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);

