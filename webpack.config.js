const path = require('path');

module.exports = {
    entry: './src/gbi-account-nav.js',
    output: {
        filename: 'gbi-account-nav.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'umd', // Universal Module Definition
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], // Process CSS files with these loaders
            },
        ],
    },
    mode: 'production'
};