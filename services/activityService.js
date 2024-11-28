const { redisClient } = require("../config/redis");
const { formatDate } = require("../utils/dateformatter");
const { getSocketInstance } = require("./sockets");


// Log user activity (specific to each user)
const logActivity = async (userId, activity) => {
  const key = `user:${userId}:activities`;
  const newActivity = `${activity} at ${formatDate()}`;
  // Add new activity to Redis and trim to the latest 5
  await redisClient.lPush(key, newActivity);
  await redisClient.lTrim(key, 0, 4);  // Keep only the latest 5 activities
  // Broadcast to the specific user's room
  const io = getSocketInstance();
  io.to(userId).emit('activityUpdate', newActivity);
};

// Fetch latest 5 activities for a user
const getUserActivities = async (userId) => {
  const key = `user:${userId}:activities`;
  return await redisClient.lRange(key, 0, 4);  // Fetch latest 5 activities
};

module.exports = {
  logActivity,
  getUserActivities,
};