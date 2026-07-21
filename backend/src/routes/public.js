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
      Project.find({ visible: { $ne: false } }).select('title category desc img tags order').sort({ order: 1 }).lean(),
      Client.find({ visible: { $ne: false } }).select('name logo website order').sort({ order: 1 }).lean(),
      TeamMember.find({ visible: { $ne: false } }).sort({ order: 1 }).lean(),
      Testimonial.find({ visible: { $ne: false } }).select('name role initials text order').sort({ order: 1 }).lean(),
      Stat.find({ visible: { $ne: false } }).select('value label order').sort({ order: 1 }).lean(),
      Section.find().select('key enabled').lean(),
      MapLocation.find({ visible: { $ne: false } }).select('name country city lat lng clientsCount order').sort({ order: 1 }).lean(),
      WhatWeDoService.find().select('key enabled').lean()
    ]);
    const sections = {};
    sectionRows.forEach(s => { sections[s.key] = s.enabled; });
    const whatWeDoServices = {};
    whatWeDoRows.forEach(service => { whatWeDoServices[service.key] = service.enabled; });
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    res.json({ projects, clients, team, testimonials, stats, sections, mapLocations, whatWeDoServices });
  } catch (err) { next(err); }
});
module.exports = router;
