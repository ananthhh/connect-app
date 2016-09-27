require('./node_modules/coffee-script/register')

const branch = process.env.TRAVIS_BRANCH

if (branch === 'master') process.env.ENV = 'PROD'
if (branch === 'dev')    process.env.ENV = 'DEV'
if (branch === 'qa')     process.env.ENV = 'QA'

const config = require('appirio-tech-webpack-config')({
  dirname: __dirname,
  entry: {
    app: ['./src/styles/main.scss', './src/index']
  },
  template: './src/index.html'
})

// Set asset prefix to CDN
// FIXME: Move to constants in webpack-config
// if (branch === 'dev')     config.output.publicPath = '//d2w5g0u9h79yyx.cloudfront.net/'
// if (branch === 'qa')      config.output.publicPath = '//changeme.cloudfront.net/'
// if (branch === 'master')  config.output.publicPath = '//changeme.cloudfront.net/'

// Adding react hot loader
const babelOptions = {
  presets: [ 'es2015', 'react', 'stage-2' ],
  plugins: [ 'lodash' ]
}

const jsxLoader = {
  test: /\.(js|jsx)$/,
  loaders: [
    'react-hot',
    'babel?' + JSON.stringify(babelOptions)
  ],
  exclude: /node_modules\/(?!appirio-tech.*|topcoder|tc-)/
}

// Add react-css-modules to style loader
const styleLoader = {
  test: /\.scss$/,
  loaders: [
    'style',
    'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
    'resolve-url',
    'sass'
  ]
}

// Loop over loaders and replace
config.module.loaders.forEach((loader, i, loaders) => {
  if (loader.loader === 'babel' && String(loader.test) === String(/\.(js|jsx)$/)) {
    jsxLoader.include = loader.include
    loaders[i] = jsxLoader
  }

  else if (loader.loader === 'style-loader') {
    styleLoader.include = loader.include
    loaders[i] = styleLoader
  }
})

module.exports = config
