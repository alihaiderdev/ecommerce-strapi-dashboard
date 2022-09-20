// path: ./src/api/restaurant/routes/custom-restaurant.js

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/order/pretransaction",
      handler: "custom.exampleAction",
      //   this below line of code is optional for any custom route
      //   config: {
      //     policies: [
      //       // point to a registered policy
      //       "policy-name",

      //       // point to a registered policy with some custom configuration
      //       { name: "policy-name", config: {} },

      //       // pass a policy implementation directly
      //       (policyContext, config, { strapi }) => {
      //         return true;
      //       },
      //     ],
      //   },
    },
  ],
};
