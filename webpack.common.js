const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// App directory
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    entry: path.resolve(appDirectory, "src/app.ts"),
    output: {
        filename: "main.js",
        path: path.resolve("./dist/"),
    },
    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            fs: false,
            path: false, // require.resolve("path-browserify")
        },
    },
    module: {
        rules: [
            {
                test: /\.m?js/,
            },
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                loader: "source-map-loader",
                enforce: "pre",
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                // sideEffects: true
            },
            {
                test: /\.(glsl|vs|fs)$/,
                loader: "ts-shader-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|gif|env|glb|gltf|stl)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(appDirectory, "public/index.html"),
        }),
        new CopyWebpackPlugin({
            patterns: [
              { from: path.resolve(__dirname, 'public/assets'), to: path.resolve(__dirname, 'dist/assets') },
              { from: path.resolve(__dirname, 'public/styles'), to: path.resolve(__dirname, 'dist/styles') },
            ],
        })
    ],
};
