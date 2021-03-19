module.exports = (snowflake) => {
  return !isNaN(snowflake) && snowflake.length >= 16;
};
// Added to make life easier
