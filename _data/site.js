module.exports = function() {
  if (process.env.NODE_ENV === "development") {
    return {
      url: "http://localhost:8080",
    }
  } else {
    return {
      url: "https://alt-text-selfies.netlify.app",
    }
  }
};