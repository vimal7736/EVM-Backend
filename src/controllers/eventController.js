import Event from '../models/Event.js';
import EventLog from '../models/EventLog.js';
import Profile from '../models/Profile.js';

import {formatForUser} from '../utils/timezoneHelper.js';

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, profiles, timezone, startDateTime, endDateTime } = req.body;

    const validProfiles = await Profile.find({ _id: { $in: profiles } });
    if (validProfiles.length !== profiles.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more profiles not found',
      });
    }

   const event = await Event.create({
      title,
      description,
      profiles,
      timezone,
      startDateTime,
      endDateTime,
    });

    await EventLog.create({
      eventId: event._id,
      action: 'created',
      changes: { event: { old: null, new: event } },
      userTimezone: timezone,
    });

    const populatedEvent = await Event.findById(event._id).populate(
      'profiles',
      'name timezone'
    );

    res.status(201).json({
      success: true,
      data: populatedEvent,
    });

  } catch (error) {
    next(error);
  }

};

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate('profiles', 'name timezone')
      .sort({ startDateTime: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'profiles',
      'name timezone'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;
    const { userTimezone } = updates;

    const originalEvent = await Event.findById(eventId);
    if (!originalEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const changes = {};
    const trackedFields = [
      'title',
      'description',
      'startDateTime',
      'endDateTime',
      'timezone',
      'profiles',
    ];

    trackedFields.forEach((field) => {
      if (updates[field] && JSON.stringify(originalEvent[field]) !== JSON.stringify(updates[field])) {
        changes[field] = {
          old: originalEvent[field],
          new: updates[field],
        };
      }
    });

    if (updates.profiles) {
      const validProfiles = await Profile.find({ _id: { $in: updates.profiles } });
      if (validProfiles.length !== updates.profiles.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more profiles not found',
        });
      }
    }

    const event = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
      runValidators: true,
    }).populate('profiles', 'name timezone');

    if (Object.keys(changes).length > 0) {
      await EventLog.create({
        eventId: event._id,
        action: 'updated',
        changes,
        userTimezone: userTimezone || event.timezone,
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    await EventLog.create({
      eventId: event._id,
      action: 'deleted',
      changes: { event: { old: event, new: null } },
      userTimezone: event.timezone,
    });

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const getEventLogs = async (req, res, next) => {
  try {
    const { userTimezone } = req.query;

    const logs = await EventLog.find({ eventId: req.params.id }).sort({
      timestamp: -1,
    });

    if (userTimezone) {
      logs.forEach((log) => {
        log.timestamp = formatForUser(log.timestamp, userTimezone);
      });
    }

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
