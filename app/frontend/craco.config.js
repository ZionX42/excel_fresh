// Load configuration from environment or config file
const path = require('path');

// Environment variable overrides
const config = {
  disableHotReload: process.env.DISABLE_HOT_RELOAD === 'true',
};

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Remove source-map-loader entirely (causes ESM parse issues in this setup)
      try {
        if (webpackConfig.module && Array.isArray(webpackConfig.module.rules)) {
          webpackConfig.module.rules = webpackConfig.module.rules
            .map((rule) => {
              if (rule && rule.use) {
                const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
                const filtered = uses.filter((u) => !(typeof u === 'object' && u.loader && u.loader.includes('source-map-loader')) && u !== 'source-map-loader');
                return { ...rule, use: Array.isArray(rule.use) ? filtered : filtered[0] };
              }
              if (rule && rule.oneOf) {
                rule.oneOf = rule.oneOf.map((one) => {
                  if (one.use) {
                    const uses = Array.isArray(one.use) ? one.use : [one.use];
                    const filtered = uses.filter((u) => !(typeof u === 'object' && u.loader && u.loader.includes('source-map-loader')) && u !== 'source-map-loader');
                    return { ...one, use: Array.isArray(one.use) ? filtered : filtered[0] };
                  }
                  return one;
                });
              }
              return rule;
            })
            .filter((rule) => {
              // Drop pre-rules that are solely source-map-loader
              if (rule && rule.enforce === 'pre' && rule.use) {
                const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
                return !uses.every((u) => (typeof u === 'object' && u.loader && u.loader.includes('source-map-loader')) || u === 'source-map-loader');
              }
              return true;
            });
        }
      } catch (_) { /* noop */ }
      // Exclude source-map-loader from our application sources to avoid ESM parse issues
      // previous attempt to exclude src kept for reference; full removal above
      
      // Disable hot reload completely if environment variable is set
      if (config.disableHotReload) {
        // Remove hot reload related plugins
        webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
          return !(plugin.constructor.name === 'HotModuleReplacementPlugin');
        });
        
        // Disable watch mode
        webpackConfig.watch = false;
        webpackConfig.watchOptions = {
          ignored: /.*/, // Ignore all files
        };
      } else {
        // Add ignored patterns to reduce watched directories
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
          ],
        };
      }
      
      return webpackConfig;
    },
  },
};