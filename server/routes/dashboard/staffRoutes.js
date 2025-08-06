import express from 'express';
import {
  TeamMember,
  Permission,
  Schedule,
  Availability,
  TimeOffRequest,
  Timecard,
  Announcement,
  Commission
} from '../../models/dashboard/index.js';
import { protect, admin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// TEAM MEMBER ROUTES

// @desc    Fetch all team members
// @route   GET /api/dashboard/staff
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({})
      .populate('permissions', 'name description')
      .sort({ lastName: 1, firstName: 1 });
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single team member
// @route   GET /api/dashboard/staff/:id
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id)
      .populate('permissions', 'name description')
      .populate('schedule')
      .populate('commissions');

    if (teamMember) {
      res.json(teamMember);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a team member
// @route   POST /api/dashboard/staff
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      hireDate,
      status,
      permissions,
      employmentType,
      payRate,
      payType,
      emergencyContact,
      address,
      taxInfo,
      bankInfo
    } = req.body;

    const teamMemberExists = await TeamMember.findOne({ email });

    if (teamMemberExists) {
      res.status(400).json({ message: 'Team member with this email already exists' });
      return;
    }

    const teamMember = new TeamMember({
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      hireDate: hireDate || Date.now(),
      status: status || 'active',
      permissions,
      employmentType,
      payRate,
      payType,
      emergencyContact,
      address,
      taxInfo,
      bankInfo,
      createdBy: req.user._id
    });

    const createdTeamMember = await teamMember.save();
    res.status(201).json(createdTeamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a team member
// @route   PUT /api/dashboard/staff/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      status,
      permissions,
      employmentType,
      payRate,
      payType,
      emergencyContact,
      address,
      taxInfo,
      bankInfo
    } = req.body;

    const teamMember = await TeamMember.findById(req.params.id);

    if (teamMember) {
      teamMember.firstName = firstName || teamMember.firstName;
      teamMember.lastName = lastName || teamMember.lastName;
      teamMember.email = email || teamMember.email;
      teamMember.phone = phone || teamMember.phone;
      teamMember.position = position || teamMember.position;
      teamMember.department = department || teamMember.department;
      teamMember.status = status || teamMember.status;
      teamMember.permissions = permissions || teamMember.permissions;
      teamMember.employmentType = employmentType || teamMember.employmentType;
      teamMember.payRate = payRate !== undefined ? payRate : teamMember.payRate;
      teamMember.payType = payType || teamMember.payType;
      teamMember.emergencyContact = emergencyContact || teamMember.emergencyContact;
      teamMember.address = address || teamMember.address;
      teamMember.taxInfo = taxInfo || teamMember.taxInfo;
      teamMember.bankInfo = bankInfo || teamMember.bankInfo;
      teamMember.updatedBy = req.user._id;

      const updatedTeamMember = await teamMember.save();
      res.json(updatedTeamMember);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a team member
// @route   DELETE /api/dashboard/staff/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (teamMember) {
      await teamMember.deleteOne();
      res.json({ message: 'Team member removed' });
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PERMISSION ROUTES

// @desc    Fetch all permissions
// @route   GET /api/dashboard/staff/permissions/all
// @access  Private/Admin
router.get('/permissions/all', protect, admin, async (req, res) => {
  try {
    const permissions = await Permission.find({}).sort({ name: 1 });
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a permission
// @route   POST /api/dashboard/staff/permissions
// @access  Private/Admin
router.post('/permissions', protect, admin, async (req, res) => {
  try {
    const { name, description, scope, actions } = req.body;

    const permissionExists = await Permission.findOne({ name });

    if (permissionExists) {
      res.status(400).json({ message: 'Permission with this name already exists' });
      return;
    }

    const permission = new Permission({
      name,
      description,
      scope,
      actions,
      createdBy: req.user._id
    });

    const createdPermission = await permission.save();
    res.status(201).json(createdPermission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// SCHEDULE ROUTES

// @desc    Fetch team member schedule
// @route   GET /api/dashboard/staff/:id/schedule
// @access  Private/Admin
router.get('/:id/schedule', protect, admin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate date range
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const schedule = await Schedule.find({
      teamMember: req.params.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create schedule for team member
// @route   POST /api/dashboard/staff/:id/schedule
// @access  Private/Admin
router.post('/:id/schedule', protect, admin, async (req, res) => {
  try {
    const { date, startTime, endTime, notes, location } = req.body;

    // Check if team member exists
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Check if schedule already exists for this date
    const existingSchedule = await Schedule.findOne({
      teamMember: req.params.id,
      date: new Date(date)
    });

    if (existingSchedule) {
      // Update existing schedule
      existingSchedule.startTime = startTime || existingSchedule.startTime;
      existingSchedule.endTime = endTime || existingSchedule.endTime;
      existingSchedule.notes = notes || existingSchedule.notes;
      existingSchedule.location = location || existingSchedule.location;
      existingSchedule.updatedBy = req.user._id;

      const updatedSchedule = await existingSchedule.save();
      return res.json(updatedSchedule);
    }

    // Create new schedule
    const schedule = new Schedule({
      teamMember: req.params.id,
      date: new Date(date),
      startTime,
      endTime,
      notes,
      location,
      createdBy: req.user._id
    });

    const createdSchedule = await schedule.save();
    res.status(201).json(createdSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// AVAILABILITY ROUTES

// @desc    Fetch team member availability
// @route   GET /api/dashboard/staff/:id/availability
// @access  Private/Admin
router.get('/:id/availability', protect, admin, async (req, res) => {
  try {
    const availability = await Availability.find({ teamMember: req.params.id })
      .sort({ dayOfWeek: 1 });
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update team member availability
// @route   PUT /api/dashboard/staff/:id/availability
// @access  Private/Admin
router.put('/:id/availability', protect, admin, async (req, res) => {
  try {
    const { availabilityData } = req.body;

    // Check if team member exists
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Delete existing availability
    await Availability.deleteMany({ teamMember: req.params.id });

    // Create new availability records
    const availabilityPromises = availabilityData.map(item => {
      const availability = new Availability({
        teamMember: req.params.id,
        dayOfWeek: item.dayOfWeek,
        isAvailable: item.isAvailable,
        startTime: item.startTime,
        endTime: item.endTime,
        createdBy: req.user._id
      });
      return availability.save();
    });

    const savedAvailability = await Promise.all(availabilityPromises);
    res.json(savedAvailability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// TIME OFF REQUEST ROUTES

// @desc    Fetch all time off requests
// @route   GET /api/dashboard/staff/time-off
// @access  Private/Admin
router.get('/time-off/all', protect, admin, async (req, res) => {
  try {
    const timeOffRequests = await TimeOffRequest.find({})
      .populate('teamMember', 'firstName lastName')
      .populate('approvedBy', 'name')
      .sort({ startDate: 1 });
    res.json(timeOffRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create time off request
// @route   POST /api/dashboard/staff/:id/time-off
// @access  Private
router.post('/:id/time-off', protect, async (req, res) => {
  try {
    const { startDate, endDate, reason, type, notes } = req.body;

    // Check if team member exists
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Check if user is authorized (admin or the team member themselves)
    if (!req.user.isAdmin && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to create time off request for this team member' });
    }

    const timeOffRequest = new TimeOffRequest({
      teamMember: req.params.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      type,
      notes,
      status: 'pending',
      createdBy: req.user._id
    });

    const createdTimeOffRequest = await timeOffRequest.save();
    res.status(201).json(createdTimeOffRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Approve/reject time off request
// @route   PUT /api/dashboard/staff/time-off/:id
// @access  Private/Admin
router.put('/time-off/:id', protect, admin, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const timeOffRequest = await TimeOffRequest.findById(req.params.id);

    if (timeOffRequest) {
      timeOffRequest.status = status;
      timeOffRequest.approvalNotes = notes;
      timeOffRequest.approvedBy = req.user._id;
      timeOffRequest.approvalDate = Date.now();

      const updatedTimeOffRequest = await timeOffRequest.save();
      res.json(updatedTimeOffRequest);
    } else {
      res.status(404).json({ message: 'Time off request not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// TIMECARD ROUTES

// @desc    Fetch timecards for a team member
// @route   GET /api/dashboard/staff/:id/timecards
// @access  Private/Admin
router.get('/:id/timecards', protect, admin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate date range
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const timecards = await Timecard.find({
      teamMember: req.params.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });
    
    res.json(timecards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create timecard
// @route   POST /api/dashboard/staff/:id/timecards
// @access  Private
router.post('/:id/timecards', protect, async (req, res) => {
  try {
    const { date, clockIn, clockOut, breaks, notes, location } = req.body;

    // Check if team member exists
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Check if user is authorized (admin or the team member themselves)
    if (!req.user.isAdmin && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to create timecard for this team member' });
    }

    // Check if timecard already exists for this date
    const existingTimecard = await Timecard.findOne({
      teamMember: req.params.id,
      date: new Date(date)
    });

    if (existingTimecard) {
      return res.status(400).json({ message: 'Timecard already exists for this date' });
    }

    // Calculate hours worked
    let hoursWorked = 0;
    if (clockIn && clockOut) {
      const clockInTime = new Date(clockIn);
      const clockOutTime = new Date(clockOut);
      
      // Calculate total time in milliseconds
      let totalTime = clockOutTime - clockInTime;
      
      // Subtract breaks if any
      if (breaks && breaks.length > 0) {
        breaks.forEach(breakItem => {
          const breakStart = new Date(breakItem.start);
          const breakEnd = new Date(breakItem.end);
          totalTime -= (breakEnd - breakStart);
        });
      }
      
      // Convert to hours
      hoursWorked = totalTime / (1000 * 60 * 60);
    }

    const timecard = new Timecard({
      teamMember: req.params.id,
      date: new Date(date),
      clockIn: new Date(clockIn),
      clockOut: clockOut ? new Date(clockOut) : null,
      breaks,
      hoursWorked,
      notes,
      location,
      status: clockOut ? 'completed' : 'in_progress',
      createdBy: req.user._id
    });

    const createdTimecard = await timecard.save();
    res.status(201).json(createdTimecard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update timecard (clock out)
// @route   PUT /api/dashboard/staff/:id/timecards/:timecardId
// @access  Private
router.put('/:id/timecards/:timecardId', protect, async (req, res) => {
  try {
    const { clockOut, breaks, notes } = req.body;

    // Check if user is authorized (admin or the team member themselves)
    if (!req.user.isAdmin && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update timecard for this team member' });
    }

    const timecard = await Timecard.findById(req.params.timecardId);

    if (!timecard) {
      return res.status(404).json({ message: 'Timecard not found' });
    }

    if (timecard.teamMember.toString() !== req.params.id) {
      return res.status(400).json({ message: 'Timecard does not belong to this team member' });
    }

    if (clockOut) {
      timecard.clockOut = new Date(clockOut);
      timecard.status = 'completed';
      
      // Calculate hours worked
      let totalTime = timecard.clockOut - timecard.clockIn;
      
      // Get all breaks, combining existing and new ones
      const allBreaks = [...(timecard.breaks || []), ...(breaks || [])];
      
      // Subtract breaks if any
      if (allBreaks && allBreaks.length > 0) {
        allBreaks.forEach(breakItem => {
          const breakStart = new Date(breakItem.start);
          const breakEnd = new Date(breakItem.end);
          totalTime -= (breakEnd - breakStart);
        });
      }
      
      // Convert to hours
      timecard.hoursWorked = totalTime / (1000 * 60 * 60);
    }

    if (breaks) {
      timecard.breaks = [...(timecard.breaks || []), ...breaks];
    }

    if (notes) {
      timecard.notes = notes;
    }

    timecard.updatedBy = req.user._id;

    const updatedTimecard = await timecard.save();
    res.json(updatedTimecard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ANNOUNCEMENT ROUTES

// @desc    Fetch all announcements
// @route   GET /api/dashboard/staff/announcements
// @access  Private
router.get('/announcements/all', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create announcement
// @route   POST /api/dashboard/staff/announcements
// @access  Private/Admin
router.post('/announcements', protect, admin, async (req, res) => {
  try {
    const { title, content, priority, startDate, endDate, departments, locations } = req.body;

    const announcement = new Announcement({
      title,
      content,
      priority: priority || 'normal',
      startDate: startDate || Date.now(),
      endDate,
      departments,
      locations,
      createdBy: req.user._id
    });

    const createdAnnouncement = await announcement.save();
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// COMMISSION ROUTES

// @desc    Fetch commissions for a team member
// @route   GET /api/dashboard/staff/:id/commissions
// @access  Private/Admin
router.get('/:id/commissions', protect, admin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const commissions = await Commission.find({
      teamMember: req.params.id,
      ...dateFilter
    })
      .populate('transaction')
      .populate('item')
      .populate('service')
      .sort({ date: -1 });
    
    res.json(commissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create commission
// @route   POST /api/dashboard/staff/:id/commissions
// @access  Private/Admin
router.post('/:id/commissions', protect, admin, async (req, res) => {
  try {
    const { date, amount, percentage, transaction, item, service, notes } = req.body;

    // Check if team member exists
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const commission = new Commission({
      teamMember: req.params.id,
      date: date ? new Date(date) : Date.now(),
      amount,
      percentage,
      transaction,
      item,
      service,
      notes,
      createdBy: req.user._id
    });

    const createdCommission = await commission.save();
    res.status(201).json(createdCommission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;