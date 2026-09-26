const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminSchema = new mongoose.Schema({
  name: { type: String, default: 'Admin' },
  employeeId: { type: String, trim: true, unique: true, sparse: true },
  position: { type: String, default: 'Employee', trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['owner', 'admin', 'employee'], default: 'employee' },
  active: { type: Boolean, default: true }
}, { timestamps: true });
AdminSchema.pre('validate', function(next) {
  if (!this.employeeId) this.employeeId = `EMP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  next();
});
AdminSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
AdminSchema.methods.comparePassword = function(password){ return bcrypt.compare(password, this.password); };
module.exports = mongoose.model('Admin', AdminSchema);
