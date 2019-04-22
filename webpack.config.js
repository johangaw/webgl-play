const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
 },
 devServer: {
   contentBase: './dist'
 },
 resolve: {
   extensions: ['.ts', '.tsx', '.js', '.jsx']
 },
 devtool: 'source-map',
 module: {
   rules: [
     {
       test: /\.tsx?$/,
       loader: 'awesome-typescript-loader'
     }
   ]
 }
};