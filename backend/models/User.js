const  mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role : { type: String, enum: ['user', 'admin'], default: 'user' },
    verified: { type: Boolean, default: false },
    phone: { type: String },
    isBanned: { type: Boolean, default: false },
    },
    { timestamps: true },
);

userSchema.index({ role: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

module.exports = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);