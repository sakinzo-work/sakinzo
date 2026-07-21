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
const Insight = require('./models/Insight');
const Admin = require('./models/Admin');
const crudRouter = require('./utils/crudRouter');

const app = express();
const PORT = process.env.PORT || 5000;
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
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'sakinzo-api' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admins', require('./routes/admins'));
app.use('/api/public', require('./routes/public'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/clients', crudRouter(Client));
app.use('/api/team', crudRouter(TeamMember));
app.use('/api/testimonials', crudRouter(Testimonial));
app.use('/api/stats', crudRouter(Stat));
app.use('/api/map-locations', crudRouter(MapLocation));
app.use('/api/insights', crudRouter(Insight));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/what-we-do-services', require('./routes/whatWeDoServices'));
app.use('/api/submissions', require('./routes/submissions'));
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
  const bootstrapEmail = String(process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  if (bootstrapEmail) {
    const existing = await Admin.findOne({ email: bootstrapEmail });
    if (existing) {
      if (existing.role !== 'owner' || existing.active === false) {
        existing.role = 'owner'; existing.active = true; await existing.save();
      }
    } else if (process.env.ADMIN_PASSWORD) {
      await Admin.create({ name: process.env.ADMIN_NAME || 'Admin', email: bootstrapEmail, password: process.env.ADMIN_PASSWORD, role: 'owner', active: true });
      console.log('Bootstrap owner account created');
    }
  }
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
});
