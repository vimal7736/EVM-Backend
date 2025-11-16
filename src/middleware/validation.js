import dayjs from "dayjs";

export const validateProfile = (req, res, next) => {
  const { name, timezone } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Profile name is required' 
    });
  }
  
  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name must be between 2 and 50 characters' 
    });
  }
  
  next();
};

export const validateEvent = (req, res, next) => {
  const { title, profiles, timezone, startDateTime, endDateTime } = req.body;
  
  
  if (!profiles || profiles.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'At least one profile must be selected' 
    });
  }
  
  if (!timezone) {
    return res.status(400).json({ 
      success: false, 
      message: 'Timezone is required' 
    });
  }
  
  if (!startDateTime || !endDateTime) {
    return res.status(400).json({ 
      success: false, 
      message: 'Start and end date/time are required' 
    });
  }
  
  const start = dayjs(startDateTime);
  const end = dayjs(endDateTime);
  
  if (!start.isValid() || !end.isValid()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid date format' 
    });
  }
  
  if (end.isBefore(start) || end.isSame(start)) {
    return res.status(400).json({ 
      success: false, 
      message: 'End date/time must be after start date/time' 
    });
  }
  
  next();
};