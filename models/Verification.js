import mongoose from 'mongoose';

const VerificationSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ['startup', 'investor'],
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        docType: { type: String, default: 'Registration/Accreditation Proof' },
      },
    ],
    adminNotes: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Verification || mongoose.model('Verification', VerificationSchema);

