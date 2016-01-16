var webpack = require("webpack");
module.exports = {
  entry: './src/main.js',
  output: {
    path: './dist',
    publicPath: 'dist/',
    filename: 'build.js'
  },

  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel?presets[]=es2015,presets[]=stage-0,cacheDirectory=true',
        // make sure to exclude 3rd party code in node_modules
        exclude: /node_modules/,
	  },
      {
        // edit this for additional asset file types
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          // inline files smaller then 10kb as base64 dataURL
          limit: 10000,
          // fallback to file-loader with this naming scheme
          name: '[name].[ext]?[hash]'
        }
      }]
	},

  plugins: [
	  new webpack.ProvidePlugin({
		  $: "jquery",
		  jQuery: "jquery",
		  "window.jQuery": "jquery"
	})
],
  // vue-loader config:
  // lint all JavaScript inside *.vue files with ESLint
  // make sure to adjust your .eslintrc
  vue: {
    loaders: {
      js: 'babel!eslint',
    }
  }
};
