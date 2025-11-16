import Profile from '../models/Profile.js';
import Event from '../models/Event.js';

export const createProfile = async (req, res, next) => {
  try {
    const { name, timezone } = req.body;

    const profile = await Profile.create({
      name,
      timezone: timezone || 'America/New_York',
    });

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { timezone, name } = req.body;

    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      { timezone, name },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfileEvents = async (req, res, next) => {
  try {
    const profileId = req.params.id;

    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const events = await Event.find({ profiles: profileId })
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
