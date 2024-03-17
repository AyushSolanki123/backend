const path = require("path");

module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: "standard-with-typescript",
	overrides: [
		{
			env: {
				node: true,
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				sourceType: "script",
			},
		},
	],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: path.join(__dirname, "tsconfig.json"),
	},
	rules: {},
	ignorePatterns: [".eslintrc.js"],
};
