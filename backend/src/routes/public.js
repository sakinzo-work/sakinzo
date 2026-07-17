const express = require('express');
const Project = require('../models/Project');
const Client = require('../models/Client');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const Stat = require('../models/Stat');
const Section = require('../models/Section');
const MapLocation = require('../models/MapLocation');
const WhatWeDoService = require('../models/WhatWeDoService');
const router = express.Router();

router.get('/site-data', async (req, res, next) => {
  try {
    const [projects, clients, team, testimonials, stats, sectionRows, mapLocations, whatWeDoRows] = await Promise.all([
      Project.find({ visible: { $ne: false } }).sort({ order: 1 }),
      Client.find({ visible: { $ne: false } }).sort({ order: 1 }),
      TeamMember.find({ visible: { $ne: false } }).sort({ order: 1 }),
      Testimonial.find({ visible: { $ne: false } }).sort({ order: 1 }),
      Stat.find({ visible: { $ne: false } }).sort({ order: 1 }),
      Section.find(),
      MapLocation.find({ visible: { $ne: false } }).sort({ order: 1 }),
      WhatWeDoService.find()
    ]);
    const sections = {};
    sectionRows.forEach(s => { sections[s.key] = s.enabled; });
    const whatWeDoServices = {};
    whatWeDoRows.forEach(service => { whatWeDoServices[service.key] = service.enabled; });
    res.json({ projects, clients, team, testimonials, stats, sections, mapLocations, whatWeDoServices });
  } catch (err) { next(err); }
});
module.exports = router;
