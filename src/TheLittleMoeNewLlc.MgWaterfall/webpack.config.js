const path = require('path');
const webpack = require('webpack');
const WebpackSHAHash = require('webpack-sha-hash');

module.exports = {
    context: path.join(__dirname, 'wwwroot'),
    entry: {
        'index': './components/home/Index.tsx',
        'index.min': './components/home/Index.tsx'
    },
    devtool: "source-map",
    output: {
        path: path.join(__dirname, 'wwwroot/app'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            // Transform JavaScript files via Babel
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: '../node_modules/jsx-loader?insertPragma=React.DOM&harmony'
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            sourceMap: true,
            comments: false
        }),
        new WebpackSHAHash()
    ],
    resolve: {
        extensions: [ '.ts', '.tsx', '.js', '.jsx', '.json' ]
    },
    externals: {
        // Use external version of React (from CDN for client-side, or bundled with ReactJS.NET for server-side)
        // Comment this out if you want to load your own version of React
        react: 'React',
        "react-dom": 'ReactDOM'
    }
};