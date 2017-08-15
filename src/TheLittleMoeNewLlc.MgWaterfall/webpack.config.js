const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, 'wwwroot'),
    entry: {
        'home': './app/Home.jsx',
        'home.min': './app/Home.jsx'
    },
    devtool: "source-map",
    output: {
        path: path.join(__dirname, 'wwwroot/app'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            // Transform JavaScript files via Babel
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: '../node_modules/jsx-loader?insertPragma=React.DOM&harmony'
            }
            // Uncomment this if you want to use your own version of React instead of the version 
            // bundled with ReactJS.NET.
            //{ test: require.resolve('react'), loader: 'expose?React' }
        ],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ],
    resolve: {
        // Allow require('./blah') to require blah.jsx
        extensions: [ '.js', '.jsx' ]
    },
    externals: {
        // Use external version of React (from CDN for client-side, or bundled with ReactJS.NET for server-side)
        // Comment this out if you want to load your own version of React
        react: 'React'
    }
};