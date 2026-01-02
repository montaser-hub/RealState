import GoogleCalendarConfig from './googleCalendarConfig.model.js';

export const getConfig = async () => {
  let config = await GoogleCalendarConfig.findOne().select('+accessToken +refreshToken');
  if (!config) {
    config = await GoogleCalendarConfig.create({
      isConnected: false,
    });
    // Re-fetch with select to get encrypted fields
    config = await GoogleCalendarConfig.findById(config._id).select('+accessToken +refreshToken');
  }
  return config;
};

export const updateConfig = async (data) => {
  let config = await GoogleCalendarConfig.findOne();
  if (!config) {
    config = await GoogleCalendarConfig.create({
      accessToken: data.accessToken || '',
      refreshToken: data.refreshToken || '',
      tokenExpiry: data.tokenExpiry || new Date(),
      isConnected: data.isConnected || false,
      connectedBy: data.connectedBy || null,
      connectedAt: data.connectedAt || new Date(),
    });
  } else {
    if (data.accessToken) config.accessToken = data.accessToken;
    if (data.refreshToken) config.refreshToken = data.refreshToken;
    if (data.tokenExpiry) config.tokenExpiry = data.tokenExpiry;
    if (data.isConnected !== undefined) config.isConnected = data.isConnected;
    if (data.connectedBy) config.connectedBy = data.connectedBy;
    if (data.connectedAt) config.connectedAt = data.connectedAt;
    await config.save();
  }
  return config;
};

export const disconnect = async () => {
  const config = await GoogleCalendarConfig.getConfig();
  config.isConnected = false;
  config.accessToken = '';
  config.refreshToken = '';
  config.tokenExpiry = new Date();
  config.connectedBy = null;
  await config.save();
  return config;
};

