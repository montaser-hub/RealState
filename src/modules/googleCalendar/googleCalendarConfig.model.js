import mongoose from 'mongoose';
import crypto from 'crypto';

const googleCalendarConfigSchema = new mongoose.Schema({
  accessToken: {
    type: String,
    required: false,
    default: '',
    select: false, // Hide by default, decrypt when needed
  },
  refreshToken: {
    type: String,
    required: false,
    default: '',
    select: false,
  },
  tokenExpiry: {
    type: Date,
    required: false,
    default: Date.now,
  },
  calendarId: {
    type: String,
    default: 'primary',
  },
  isConnected: {
    type: Boolean,
    default: false,
  },
  connectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  connectedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Encrypt tokens before saving
googleCalendarConfigSchema.pre('save', function (next) {
  if (this.isModified('accessToken') || this.isModified('refreshToken')) {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.JWT_SECRET || 'default-secret-key', 'utf8').slice(0, 32);

    const encrypt = (text) => {
      // Don't encrypt if already encrypted (contains colon separator)
      if (text && text.includes(':')) {
        return text;
      }
      if (!text) return text;
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted;
    };

    if (this.isModified('accessToken') && this.accessToken) {
      this.accessToken = encrypt(this.accessToken);
    }
    if (this.isModified('refreshToken') && this.refreshToken) {
      this.refreshToken = encrypt(this.refreshToken);
    }
  }
  next();
});

// Decrypt tokens when retrieving
googleCalendarConfigSchema.methods.decryptTokens = function () {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.JWT_SECRET || 'default-secret-key', 'utf8').slice(0, 32);

  const decrypt = (encryptedText) => {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  };

  return {
    accessToken: this.accessToken ? decrypt(this.accessToken) : null,
    refreshToken: this.refreshToken ? decrypt(this.refreshToken) : null,
  };
};

// Ensure only one config document exists
googleCalendarConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({
      accessToken: '',
      refreshToken: '',
      tokenExpiry: new Date(),
      isConnected: false,
    });
  }
  return config;
};

export default mongoose.model('GoogleCalendarConfig', googleCalendarConfigSchema);

