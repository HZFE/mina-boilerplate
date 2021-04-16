const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

const replaceExt = require("replace-ext");
const MinaPlugin = require("@hzfe/mina-webpack-plugin");

const srcPath = path.resolve("src");
const distPath = path.resolve("dist");
const modulePath = path.resolve("node_modules");

// [absolute path], the home directory for webpack,
// the entry and module.rules.loader option is resolved relative to this directory
const context = srcPath;

// defaults to ./src, here our entry is miniapp entry file app.js
// Here the application starts executing and webpack starts bundling
// entry: {
//   'app': './app.js',
//   'pages/index/index': './pages/index/index.js',
//   'pages/logs/logs': './pages/logs/logs.js'
// },
const entry = "./app.js";

/**
 * @param {*} webpackConfig
 *
 * 预期效果：
 * 任意依赖被[主包]中多个文件引用 -> 打包到主包vendor
 * 任意依赖被[分包]中多个文件引用 -> 打包到分包vendor
 * 任意依赖被[主包和分包]中多个文件引用 -> 打包到主包vendor
 * 任意依赖被[多个分包]中多个文件引用 -> 打包到主包vendor
 */
const getSplitChunksCacheGroups = (webpackConfig) => {
  // 找到 app.json 确定分包路径
  const curEntry = path.resolve(webpackConfig.context, webpackConfig.entry);
  const curConfig = replaceExt(curEntry, ".json");

  // 检查 app.json 配置 获取分包的根目录数组
  const config = JSON.parse(fs.readFileSync(curConfig, "utf8"));
  const subPkg = config.subpackages || config.subPackages || [];
  const subPkgRoots = subPkg.map((item) => item.root);

  return subPkgRoots.reduce(
    (acc, val, index) => {
      acc[`subVendor${index}`] = {
        name: `${val}/vendor`,
        test(_m, chunks) {
          return chunks.every((c) => c.name.startsWith(val));
        },
        priority: 0,
      };
      return acc;
    },
    {
      vendor: {
        name: "vendor",
        test(module) {
          return module.resource && module.resource.indexOf(".js") !== -1;
        },
        priority: -10,
      },
    }
  );
};

const useFileLoader = (ext = "[ext]", options = {}) => ({
  loader: "file-loader",
  options: {
    name: `[path][name].${ext}`,
    ...options,
  },
});

const getWebpackConfig = (env = {}) => {
  const { DEV_APPID = false, DEV_API = false } = process.env;

  return {
    context,
    entry,
    // https://webpack.js.org/configuration/mode/#root
    // 决定用哪种[构建类型]的配置 要和环境配置区分开来
    // Chosen mode tells webpack to use its built-in optimizations accordingly.
    mode: env.production ? "production" : "development",

    // note: 小程序环境没有eval
    devtool: env.production ? "cheap-module-source-map" : "source-map",

    // options related to how webpack emits results
    output: {
      // [absolute path], the target directory for all output files
      path: distPath,
      // for multiple entry points
      filename: "[name].js",
      // default string = 'window' // todo: global?
      globalObject: "wx",
      pathinfo: false,
    },

    resolve: {
      extensions: [".js", ".json"],
      modules: [modulePath],
    },

    optimization: {
      // adds an additional chunk containing only the runtime to each entrypoint.
      runtimeChunk: {
        name: "runtime",
      },
      // This configuration object represents the default behavior of the SplitChunksPlugin.
      splitChunks: {
        chunks: "all",
        minSize: 0,
        minChunks: 2,
        cacheGroups: getSplitChunksCacheGroups({
          context,
          entry,
        }),
      },
    },

    // how the different types of modules within a project will be treated.
    module: {
      // A Rule can be separated into three parts
      // Conditions, Results and nested Rules.
      rules: [
        {
          test: /\.js$/,
          exclude: [modulePath],
          include: srcPath,
          use: ["babel-loader?cacheDirectory"],
        },
        {
          test: /\.wxs$/,
          exclude: /node_modules/,
          include: srcPath,
          use: [useFileLoader("wxs"), "babel-loader"],
        },
        {
          test: /\.(less|wxss)$/,
          exclude: /node_modules/,
          include: srcPath,
          use: [
            useFileLoader("wxss"),
            env.production ? "postcss-loader" : false,
            "less-loader",
          ].filter((v) => v),
        },
        {
          test: /\.wxml$/,
          exclude: /node_modules/,
          include: srcPath,
          use: [
            useFileLoader("wxml", {
              useRelativePath: true,
              context: srcPath,
              esModule: false,
            }),
            {
              loader: "@hzfe/wxml-loader",
              options: {
                collectedTags: {
                  image: {
                    src: false,
                  },
                },
                minimize: env.production,
              },
            },
          ],
        },
        // env.production
        //   ? {
        //       test: /\.(png|jpe?g|gif)$/,
        //       exclude: /node_modules/,
        //       include: srcPath,
        //       use: ["image-webpack-loader"],
        //       enforce: "pre",
        //     }
        //   : false,
        {
          test: /\.(png|jpe?g|gif)$/,
          exclude: /node_modules/,
          include: srcPath,
          use: [
            useFileLoader(undefined, {
              esModule: false,
            }),
          ],
        },
        // issue: https://github.com/webpack-contrib/file-loader/issues/259
        {
          test: /\.json$/,
          exclude: /node_modules/,
          include: srcPath,
          type: "javascript/auto",
          use: [useFileLoader()],
        },
      ].filter((v) => v),
    },

    // list of additional plugins
    plugins: [
      new webpack.EnvironmentPlugin({
        DEV_APPID,
        DEV_API,
      }),

      new MinaPlugin(),

      new CleanWebpackPlugin(),

      // 小程序不支持在脚本中require资源，wxml无法解析动态资源。故直接输出这类资源
      new CopyPlugin({
        patterns: [
          {
            from: "**/*.{jpg,png,gif,jpeg}",
            globOptions: {
              ignore: ["**/tabBar/**"],
            },
            noErrorOnMissing: true,
          },
        ],
      }),

      // 分析资源
      // new BundleAnalyzerPlugin(),
    ],
  };
};

module.exports = (env) => smp.wrap(getWebpackConfig(env));
