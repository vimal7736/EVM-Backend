import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema(
{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    action: {
      type: String,
      enum: ['created', 'updated', 'deleted'],
      required: true,
    },

    changes: {
      type: mongoose.Schema.Types.Mixed,
    },

    performedBy: {
      type: String,
      default: 'admin',
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    userTimezone: {
      type: String,
      required: true,
    }
},
{ timestamps: false }
);

eventLogSchema.index({ eventId: 1, timestamp: -1 });

const EventLog = mongoose.model('EventLog', eventLogSchema);

export default EventLog;
