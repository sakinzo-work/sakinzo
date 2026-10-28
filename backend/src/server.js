require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const Client = require('./models/Client');
const TeamMember = require('./models/TeamMember');
const Testimonial = require('./models/Testimonial');
const Stat = require('./models/Stat');
const MapLocation = require('./models/MapLocation');
const ContactOffice = require('./models/ContactOffice');
const Insight = require('./models/Insight');
const Blog = require('./models/Blog');
const Admin = require('./models/Admin');
const crudRouter = require('./utils/crudRouter');
const siteCors = require('./utils/siteCors');

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_OWNER_EMAIL = 'alishafaq@gmail.com';
const LEGACY_OWNER_EMAIL = 'alishafaq782@gmail.com';
const defaultOrigins = [
  'https://sakinzo-work.github.io',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3000'
];
const origins = [...new Set([
  ...defaultOrigins,
  ...(process.env.CLIENT_ORIGIN || '').split(',').map(x => x.trim()).filter(Boolean)
])];

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors(siteCors(origins)));
app.use(morgan('dev'));
app.use(express.json({ limit: '8mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  immutable: true,
  maxAge: '30d',
  setHeaders: res => {
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
  }
}));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'sakinzo-api' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admins', require('./routes/admins'));
app.use('/api/public', require('./routes/public'));
app.use('/api/i18n', require('./routes/i18n'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/clients', crudRouter(Client, { resource: 'clients' }));
app.use('/api/team', crudRouter(TeamMember, { resource: 'team' }));
app.use('/api/testimonials', crudRouter(Testimonial, { resource: 'testimonials' }));
app.use('/api/stats', crudRouter(Stat, { resource: 'stats' }));
app.use('/api/map-locations', crudRouter(MapLocation, { resource: 'mapLocations' }));
app.use('/api/contact-offices', crudRouter(ContactOffice, { resource: 'contactOffices' }));
app.use('/api/contact-page', require('./routes/contactPage').router);
app.use('/api/insights', crudRouter(Insight, { resource: 'insights' }));
app.use('/api/blogs', crudRouter(Blog, { resource: 'blogs' }));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/what-we-do-services', require('./routes/whatWeDoServices'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/approvals', require('./routes/approvals'));
app.use('/api/upload/videos', require('./routes/projectVideos'));
app.use('/api/upload', require('./routes/upload'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : err.code === 11000 ? 409 : 500);
  const validationMessage = err.name === 'ValidationError'
    ? Object.values(err.errors || {}).map(item => item.message).join(', ')
    : '';
  res.status(status).json({ message: validationMessage || err.message || 'Server error' });
});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('MongoDB connected');
  const defaultOwner = await Admin.findOne({ email: DEFAULT_OWNER_EMAIL });
  const legacyOwner = await Admin.findOne({ email: LEGACY_OWNER_EMAIL });
  if (legacyOwner && !defaultOwner) {
    legacyOwner.email = DEFAULT_OWNER_EMAIL;
    legacyOwner.role = 'owner';
    legacyOwner.active = true;
    await legacyOwner.save();
    console.log('Default owner email migrated');
  }
  const envAdminEmail = String(process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const bootstrapEmails = [...new Set([DEFAULT_OWNER_EMAIL, envAdminEmail].map(email => String(email || '').toLowerCase().trim()).filter(Boolean))];
  for (const bootstrapEmail of bootstrapEmails) {
    const existing = await Admin.findOne({ email: bootstrapEmail });
    if (existing) {
      if (existing.role !== 'owner' || existing.active === false) {
        existing.role = 'owner'; existing.active = true; await existing.save();
      }
    } else if (process.env.ADMIN_PASSWORD && [DEFAULT_OWNER_EMAIL, envAdminEmail].includes(bootstrapEmail)) {
      await Admin.create({ name: process.env.ADMIN_NAME || 'Admin', email: bootstrapEmail, password: process.env.ADMIN_PASSWORD, role: 'owner', active: true });
      console.log('Bootstrap owner account created');
    }
  }
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
});
