const mongoose = require('mongoose');

const approvalRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  requesterName: { type: String, default: '' },
  resourceType: { type: String, required: true, trim: true },
  resourceId: { type: String, default: '' },
  action: { type: String, enum: ['create', 'update', 'delete', 'reorder', 'profile-update'], required: true },
  title: { type: String, default: '' },
  payload: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reviewedByName: { type: String, default: '' },
  reviewNote: { type: String, default: '' },
  reviewedAt: { type: Date },
  resultId: { type: String, default: '' }
}, { timestamps: true });

approvalRequestSchema.index({ status: 1, createdAt: -1 });
approvalRequestSchema.index({ requester: 1, createdAt: -1 });

module.exports = mongoose.model('ApprovalRequest', approvalRequestSchema);
