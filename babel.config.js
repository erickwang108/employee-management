module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
  ],
  plugins: [
    ["import", {
      libraryName: "antd",
      style: true, // or 'css'
    }],
    "babel-plugin-styled-components",
    "react-loadable/babel",
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    [
      "module-resolver", {
        root: ["./"],
        alias: {
          app: "./app",
          resources: "./resources",
          config: "./app/config",
          stores: "./app/stores",
          helpers: "./app/helpers",
          constants: "./app/constants",
          components: "./app/components",
          containers: "./app/containers",
        },
      },
    ],
  ],
  env: {
    test: {
      plugins: [
        ["@babel/transform-runtime", {
          regenerator: true,
        }],
      ],
    },
    development: {
      plugins: [
        [
          "babel-plugin-styled-components",
          {
            displayName: true,
          },
        ],
      ],
    },
  },
};
