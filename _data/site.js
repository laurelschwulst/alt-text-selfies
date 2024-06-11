module.exports = function() {
  if (process.env.NODE_ENV === "development") {
    return {
      url: "http://localhost:8080",
    }
  } else if (process.env.NODE_ENV === "staging") {
    return {
      url: "https://staging.alttextselfies.net"
    }
  } else {
    return {
      url: "https://alttextselfies.net",
    }
  }
};