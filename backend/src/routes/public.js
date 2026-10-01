const express = require('express');
const Project = require('../models/Project');
const Client = require('../models/Client');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const Stat = require('../models/Stat');
const Section = require('../models/Section');
const MapLocation = require('../models/MapLocation');
const ContactOffice = require('../models/ContactOffice');
const { getSettings: getContactPageSettings } = require('./contactPage');
const WhatWeDoService = require('../models/WhatWeDoService');
const Insight = require('../models/Insight');
const Blog = require('../models/Blog');
const router = express.Router();

router.get('/site-data', async (req, res, next) => {
  try {
    const [projects, clients, team, testimonials, stats, sectionRows, mapLocations, contactOffices, contactPage, whatWeDoRows, insights, blogs] = await Promise.all([
      Project.find({ visible: { $ne: false } }).select('title category desc img images tags order createdAt').sort({ order: 1, createdAt: -1 }).lean(),
      Client.find({ visible: { $ne: false } }).select('name logo website order').sort({ order: 1 }).lean(),
      TeamMember.find({ visible: { $ne: false } }).sort({ order: 1 }).lean(),
      Testimonial.find({ visible: { $ne: false } }).select('name role initials text order').sort({ order: 1 }).lean(),
      Stat.find({ visible: { $ne: false } }).select('value label order').sort({ order: 1 }).lean(),
      Section.find().select('key enabled').lean(),
      MapLocation.find({ visible: { $ne: false } }).select('name country city lat lng clientsCount order').sort({ order: 1 }).lean(),
      ContactOffice.find({ visible: { $ne: false } }).select('name country address mapUrl email phone order').sort({ order: 1 }).lean(),
      getContactPageSettings(),
      WhatWeDoService.find().select('key enabled').lean(),
      Insight.find({ visible: { $ne: false } }).select('title desc category author image articleUrl publishedAt rating readTime order').sort({ order: 1, publishedAt: -1 }).lean(),
      Blog.find({ visible: { $ne: false } }).select('title slug excerpt body category author coverImage tags publishedAt readTime order').sort({ order: 1, publishedAt: -1 }).lean()
    ]);
    const sections = {};
    sectionRows.forEach(s => { sections[s.key] = s.enabled; });
    const whatWeDoServices = {};
    whatWeDoRows.forEach(service => { whatWeDoServices[service.key] = service.enabled; });
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    res.json({ projects, clients, team, testimonials, stats, sections, mapLocations, contactOffices, contactPage, whatWeDoServices, insights, blogs });
  } catch (err) { next(err); }
});
module.exports = router;
