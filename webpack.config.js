const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
    }
}

module.exports = {
    entry: './src/styles.css',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        { loader: 'css-loader', options: { importLoader: 1 } },
                        'postcss-loader'
                    ],
                    fallback: 'style-loader'
                })
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ExtractTextPlugin('[name].[hash].css'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        }),
        new PurgecssPlugin({
            paths: path.resolve(__dirname, 'src/index.html'),
            extractors: [{
                extractor: TailwindExtractor,
                extensions: ['html']
            }]
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
};
