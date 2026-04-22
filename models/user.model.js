/**
 * User Model - MongoDB Schema
 * 
 * WHAT IS HASHING?
 * Hashing converts a password into a fixed-length string of characters.
 * It's a one-way function - you can't reverse it to get the original password.
 * This is different from encryption which can be reversed with a key.
 * 
 * WHY HASH PASSWORDS?
 * - If hackers breach your database, they only see hashed passwords, not real ones
 * - Even if they try to crack it, good hashes (like bcrypt) take years to break
 * - Users often reuse passwords, so protecting them protects their other accounts too
 * 
 * SECURITY BEST PRACTICES:
 * - Never store plain text passwords
 * - Use a salt (bcrypt does this automatically) - adds randomness to prevent rainbow table attacks
 * - Use a slow hashing algorithm (bcrypt is intentionally slow to prevent brute force)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

/**
 * Pre-save middleware - Hash password before saving
 * 
 * This runs automatically before saving a user to the database.
 * We use bcrypt's hash function with a salt round of 10.
 * 
 * WHAT IS SALT?
 * A salt is random data added to the password before hashing.
 * It ensures that two identical passwords have different hashes.
 * This prevents "rainbow table" attacks where hackers use pre-computed hash tables.
 * 
 * WHAT IS SALT ROUND?
 * The number determines how many times the hashing algorithm runs.
 * 10 is a good balance - secure but not too slow for users.
 * Each additional round doubles the time (2^10 = 1024 iterations).
 */
userSchema.pre('save', async function() {
  // Only hash if password is modified (not on every save)
  if (!this.isModified('password')) return;

  // Generate salt and hash password
  // With async/await, we don't use 'next'. Mongoose continues when the promise resolves.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Method to compare passwords during login
 * 
 * This is a custom method we add to the schema.
 * When user logs in, we compare their input with the stored hash.
 * 
 * WHY NOT JUST COMPARE HASHES?
 * Because each hash has a unique salt! We can't compare two hashes directly.
 * Instead, we hash the input password and compare the results.
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Method to return user data without password
 * 
 * When sending user data to frontend, we never include the password.
 * This method creates a clean object with just the info we need.
 */
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password; // Remove password from output
  return user;
};

module.exports = mongoose.model('User', userSchema);