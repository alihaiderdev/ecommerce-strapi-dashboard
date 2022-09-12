module.exports = ({ env }) => ({
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: env("JWT_TOKEN_EXPIRY_TIME", "1d"),
      },
    },
  },
});
