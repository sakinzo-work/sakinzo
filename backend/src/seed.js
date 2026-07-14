require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Section = require('./models/Section');

const sectionKeys = ['hero','why','clients','whatwedo','projects','services','cases','map','feedback','insights'];
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = (process.env.ADMIN_EMAIL || 'admin@sakinzo.local').toLowerCase();
  const existing = await Admin.findOne({ email });
  if (!existing) {
    await Admin.create({ name: process.env.ADMIN_NAME || 'Admin', email, password: process.env.ADMIN_PASSWORD || 'ChangeMe@123', role: 'owner', active: true });
    console.log('Admin user created:', email);
  } else {
    if (!existing.role) { existing.role = 'owner'; await existing.save(); }
    console.log('Admin user already exists:', email);
  }
  for (const key of sectionKeys) await Section.findOneAndUpdate({ key }, { enabled: true }, { upsert: true });
  console.log('Sections ready. No fake projects/clients/testimonials were seeded. Add real data from admin panel.');
  await mongoose.disconnect();
})();
