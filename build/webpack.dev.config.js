var config = require('./webpack.base.config')

config.devtool = 'eval-source-map'

// this is now configures so that console output only errors and "bundle is INVALID/VALID"
config.devServer = {
	// It suppress error shown in console, so it has to be set to false.
	quiet: false,
	// It suppress everything except error, so it has to be set to false as well
	// to see success build.
	noInfo: false,
	stats: {
	  // Config for minimal console.log mess.
	  assets: false,
	  colors: true,
	  version: false,
	  hash: false,
	  timings: false,
	  chunks: false,
	  chunkModules: false
	}
}

module.exports = config
