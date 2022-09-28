// path: ./src/api/restaurant/routes/custom-restaurant.js

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/confirm",
      handler: "custom.confirm",
    },
  ],
};
