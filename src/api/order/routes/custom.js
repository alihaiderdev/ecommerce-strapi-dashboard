// path: ./src/api/restaurant/routes/custom-restaurant.js

module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/order/confirm",
      handler: "custom.confirm",
    },
  ],
};
