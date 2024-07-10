import globals from "globals";
import pluginJs from "@eslint/js";


export default [
	{  
		rules: {
			indent: [
				"error",
				"tab"
			],
			quotes: [
				"error",
				"double"
			],
			semi: [
				"error",
				"always"
			],
			"no-unused-vars": "error",
			"no-unused-expressions": "error",
			"no-mixed-spaces-and-tabs": "error",
			"arrow-spacing": "error",
			"no-confusing-arrow": "error",
			"no-duplicate-imports": "error",
  

		}
	},
	{files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
	{languageOptions: { globals: globals.node }},
	pluginJs.configs.recommended,
];