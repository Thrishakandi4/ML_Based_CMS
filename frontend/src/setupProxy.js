const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://ml-based-cms-backend.onrender.com',
      changeOrigin: true,
    })
  );
};
