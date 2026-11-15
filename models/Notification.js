import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'meeting_request',
        'meeting_accepted',
        'meeting_rejected',
        'meeting_reminder',
        'message',
        'feedback',
        'verification',
        'recommendation',
      ],
      default: 'meeting_request',
    },
    link: {
      type: String,
      default: '/dashboard',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

