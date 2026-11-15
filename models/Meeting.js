import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup',
      required: true,
      index: true,
    },
    founderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investor',
      required: true,
      index: true,
    },
    investorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    startTime: {
      type: String, // HH:mm (24h)
      required: true,
    },
    endTime: {
      type: String, // HH:mm (24h)
      required: true,
    },
    duration: {
      type: Number,
      default: 30, // in minutes
    },
    agenda: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'],
      default: 'Pending',
      index: true,
    },
    meetingLink: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound index to help check double booking per investor per date + time
MeetingSchema.index({ investorId: 1, date: 1, startTime: 1 });

export default mongoose.models.Meeting || mongoose.model('Meeting', MeetingSchema);

