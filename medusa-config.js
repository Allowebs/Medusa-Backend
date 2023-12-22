const dotenv = require("dotenv");

let ENV_FILE_NAME = ".env";
//switch (process.env.NODE_ENV) {
// case "production":
//    ENV_FILE_NAME = ".env.production";
//   break;
// case "staging":
//  ENV_FILE_NAME = ".env.staging";
//   break;
// case "test":
//   ENV_FILE_NAME = ".env.test";
//   break;
// case "development":
// default:
//   ENV_FILE_NAME = ".env";
//   break;
//}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "/http://*/";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "/http://*/";

const DATABASE_URL = process.env.DATABASE_URL || "";

const REDIS_URL = process.env.REDIS_URL || "";

const plugins = [
  `medusa-fulfillment-manual`,
  /**`medusa-payment-manual`,*/
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      serve: true,
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false"
      }
    }
  },
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
    }
  },
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: process.env.FILE_UPLOAD_DIR || "",
      backend_url: process.env.FILE_BACKEND_URL
    }
  },
  {
    resolve: `medusa-plugin-wishlist`
  }
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  }
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules
};
