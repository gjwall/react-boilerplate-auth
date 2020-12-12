// entry point and output bundle
// https://webpack.js.org/concepts/#entry
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devEnvString = 'development';
process.env.NODE_ENV = process.env.NODE_ENV || devEnvString;

if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test' });
} else if (process.env.NODE_ENV === devEnvString) {
    require('dotenv').config({ path: `.env.${devEnvString}` });
} 
// dangling else means we are in production

module.exports = (env) => {

    const isProduction = env === 'production';
    //const CSSExtract = new MiniCssExtractPlugin();

    return {
        entry: './src/app.js',
        //entry: './src/playground/hoc.js',
        output: {
            path: path.join(__dirname, 'public', 'dist'),
            filename: 'bundle.js'
        },
        module: {
            rules: [{
                loader: 'babel-loader',
                test: /\.js$/, // Make sure the file ends in .js
                exclude: /node_modules/
            },
            {
                // Make sure the file ends in .scss or .css
                test: /\.s?(a|c)ss$/i, 
                use: [  
                    // New plugin loader
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS  
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    // Compiles Sass to CSS
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
                exclude: /\.module.(s(a|c)ss)$/
            }, {
                // This is required to load the images
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'url-loader'
            }]
        },
        plugins: [
            new MiniCssExtractPlugin(),
            new webpack.DefinePlugin({
                'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
                'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
                'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
                'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
                'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
                'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
                'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
                'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(process.env.FIREBASE_MEASUREMENT_ID)
            })
        ],
        devtool: isProduction ? 'source-map' : 'source-map',
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            // Make index.html be served for all end points, prevents 404s
            historyApiFallback: true,
            publicPath: '/dist/'
        }
    };
};