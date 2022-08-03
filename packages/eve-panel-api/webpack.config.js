const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebPackShellPlugin = require('webpack-shell-plugin-next');
const { spawn } = require('child_process');

const env = process.env.NODE_ENV ?? 'production';
let child = null;

module.exports = {
  entry: './src/index.ts',
  mode: env,
  target: 'node',
  externals: [nodeExternals({ allowlist: ['eve-core'] })],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: env === 'development' ? 'eval-source-map' : 'source-map',
  plugins: [
    new WebPackShellPlugin({
      onDoneWatch: {
        scripts: [() => {
          if (env === 'production') {
            return;
          }

          if (child) {
            console.log('Killing old process...');
            child.kill();
            child.unref();
          }

          console.log('Starting new process...');
          child = spawn('node', ['build/index.js'], { stdio: ['inherit', 'inherit', 'inherit']});

          child.stderr?.on('data', chunk => console.error(chunk.toString()));
          child.stdout?.on('data', chunk => console.log(chunk.toString()));
          child.on('error', console.error);
          child.on('exit', (...args) => console.info('Child exited', args) );
        }],
        blocking: false,
        parallel: false,
      },
    }),
  ],
  watch: env === 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  }
}
