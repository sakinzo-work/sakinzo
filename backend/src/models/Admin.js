const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminSchema = new mongoose.Schema({
  name: { type: String, default: 'Admin' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['owner', 'admin'], default: 'admin' },
  active: { type: Boolean, default: true }
}, { timestamps: true });
AdminSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
AdminSchema.methods.comparePassword = function(password){ return bcrypt.compare(password, this.password); };
module.exports = mongoose.model('Admin', AdminSchema);
