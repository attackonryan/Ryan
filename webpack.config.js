const path = require('path')
module.exports = {
  mode: 'development',
  entry: {        
      index: './js/src/Ryan.js',
  },
  output: {       
      publicPath: '',     
      path: path.resolve(__dirname, 'dist'),
      filename: 'Ryan.js'
  },
}