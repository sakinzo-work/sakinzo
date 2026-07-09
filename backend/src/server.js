require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const Project = require('./models/Project');
const Client = require('./models/Client');
const TeamMember = require('./models/TeamMember');
const Testimonial = require('./models/Testimonial');
const Stat = require('./models/Stat');
const MapLocation = require('./models/MapLocation');
const crudRouter = require('./utils/crudRouter');

const app = express();
const PORT = process.env.PORT || 5000;
const origins = (process.env.CLIENT_ORIGIN || '').split(',').map(x => x.trim()).filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: origins.length ? origins : true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'sakinzo-api' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/public', require('./routes/public'));
app.use('/api/projects', crudRouter(Project));
app.use('/api/clients', crudRouter(Client));
app.use('/api/team', crudRouter(TeamMember));
app.use('/api/testimonials', crudRouter(Testimonial));
app.use('/api/stats', crudRouter(Stat));
app.use('/api/map-locations', crudRouter(MapLocation));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/upload', require('./routes/upload'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
});
