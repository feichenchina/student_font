const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",

  configureWebpack() {
    return {
      resolve: {
        fallback: {
          http: require.resolve("stream-http"),
          "https": require.resolve("https-browserify")
        },
      },
    }
  },
}
)

