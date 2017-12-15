const path = require('path');

module.exports = {
    entry: './scripts/script.js',
    output: {
        filename: '../dist/bundle.js',
        path: path.resolve(__dirname, 'pages')
    }
};