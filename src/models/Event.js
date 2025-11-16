import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    profiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
      },
    ],

    timezone: {
      type: String,
      required: [true, 'Timezone is required'],
    },

    startDateTime: {
      type: Date,
      required: [true, 'Start date and time is required'],
    },

    endDateTime: {
      type: Date,
      required: [true, 'End date and time is required'],
    },

    createdBy: {
      type: String,
      default: 'admin',
    },

    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

// end > start


eventSchema.pre('save', function (next) {
  if (this.endDateTime <= this.startDateTime) {
    return next(new Error('End date/time must be after start date/time'));
  }
  next();
});

eventSchema.index({ profiles: 1 });
eventSchema.index({ startDateTime: 1 });
eventSchema.index({ status: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
