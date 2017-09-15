var webpack = require('webpack');
var path = require('path');
var yargs = require('yargs');

var optimizeMinimize = yargs.alias('p', 'optimize-minimize').argv.optimizeMinimize;
var nodeEnv = optimizeMinimize ? 'production' : 'development';

module.exports = [
  {
    entry: {
      ReactObjectForm: './src/ReactObjectForm.jsx'
    },
    output: {
      path: path.join(__dirname,'dist/'),
      library: 'ReactObjectForm',
      filename: optimizeMinimize ? '[name].min.js' : '[name].js',
      libraryTarget: "umd"
    },
    resolve: {
      extensions: ['.js','.jsx']
    },
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react'],
            plugins: ["syntax-object-rest-spread","transform-class-properties","transform-object-rest-spread"]
          }
        }
      ]
    },
    externals: [
      {
        'react': {
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react',
          amd: 'react'
        },
        'react-dom': {
          root: 'ReactDOM',
          commonjs2: 'react-dom',
          commonjs: 'react-dom',
          amd: 'react-dom'
        },
        'react-select': {
          root: 'Select',
          commonjs2: 'react-select',
          commonjs: 'react-select',
          amd: 'react-select'
        }
      }
    
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
      }),
    ],
    
    devtool: optimizeMinimize ? 'source-map' : false
  }
];
