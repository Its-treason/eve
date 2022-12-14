const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    target: 'node',
    externals: [nodeExternals()],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    optimization: {
        minimize: true,
    },
}
