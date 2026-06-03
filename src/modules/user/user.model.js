const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// mongoose.Schema defines the SHAPE of a document in MongoDB
// Think of it like a table definition in SQL
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,       // must be text
      required: true,     // cannot be empty
      trim: true,         // removes extra spaces from both ends
    },

    email: {
      type: String,
      required: true,
      unique: true,       // no two users can have the same email
      lowercase: true,    // always saves email in lowercase
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,       // minimum 6 characters
      select: false,      // NEVER return password in query results by default
    },

    role: {
      type: String,
      // enum means only these 3 values are allowed
      enum: ['admin', 'company', 'candidate'],
      default: 'candidate', // if no role given, user becomes candidate
    },

    // Company profile — only filled if role is 'company'
    companyName: {
      type: String,
      trim: true,
    },

    companyWebsite: {
      type: String,
      trim: true,
    },

    // Candidate profile — only filled if role is 'candidate'
    resumeUrl: {
      type: String,
    },

    // These fields are used for the forgot password OTP flow
    resetPasswordOTP: {
      type: String,       // stores the hashed OTP
    },

    resetPasswordOTPExpiry: {
      type: Date,         // stores when the OTP expires
    },

    // Stores the refresh token so we can invalidate it on logout
    refreshToken: {
      type: String,
      select: false,      // never return this in query results
    },

    isActive: {
      type: Boolean,
      default: true,      // account is active by default
    },
  },
  {
    // timestamps: true automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ─── MIDDLEWARE (also called "hooks") ───────────────────────────────
// This runs BEFORE a user document is saved to MongoDB
// Its job: hash the password so we never store plain text passwords
userSchema.pre('save', async function (next) {
  // "this" refers to the current user document being saved

  // isModified('password') checks if the password field was changed
  // If user is just updating their name, we don't re-hash the password
  if (!this.isModified('password')) return next();

  // bcrypt.hash() scrambles the password
  // 12 is the "salt rounds" — higher = more secure but slower
  // 12 is a good balance for production
  this.password = await bcrypt.hash(this.password, 12);

  // next() tells Mongoose to continue saving the document
  next();
});

// ─── INSTANCE METHOD ─────────────────────────────────────────────────
// This is a custom method we add to every user document
// It compares a plain text password with the stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // bcrypt.compare() hashes candidatePassword and checks if it matches
  // Returns true if match, false if not
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the model from the schema
// 'User' becomes the collection name 'users' in MongoDB (auto-pluralized)
const User = mongoose.model('User', userSchema);

module.exports = User;