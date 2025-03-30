// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";
import * as eslintPluginImport from "eslint-plugin-import"; // Changed to namespace import
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config(
	{
		ignores: ["eslint.config.mjs"],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			ecmaVersion: 2022, // Changed from 5 to 2022 for modern JavaScript
			sourceType: "module",
			parserOptions: {
				project: "./tsconfig.json", // Added project path
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		plugins: {
			import: eslintPluginImport,
			"simple-import-sort": eslintPluginSimpleImportSort,
		},
		rules: {
			// TypeScript Rules
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/require-await": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],

			// Prettier Rules
			"prettier/prettier": [
				"error",
				{
					endOfLine: "auto",
					semi: true,
					tabWidth: 2,
					useTabs: true,
					singleQuote: false,
					trailingComma: "all",
				},
			],

			// Import Sorting Rules
			"simple-import-sort/imports": [
				"error",
				{
					groups: [
						// Node.js built-ins
						["^node:.*", "^fs$", "^path$"],

						// External packages (NestJS, third-party)
						["^@nestjs", "^@?\\w"],

						// Swagger, Validation, Other Third-Party
						["^@nestjs/swagger", "^class-validator"],

						// Internal absolute imports (e.g., `src/utils`)
						["^src(/.*)?$"],

						// Internal relative imports (services, DTOs, etc.)
						["^\\.\\.(?!/?$)", "^\\.\\./?$"],
						["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],

						// Style imports
						["^.+\\.s?css$"],
					],
				},
			],
			"simple-import-sort/exports": "error",
			"import/first": "error",
			"import/newline-after-import": "error",
			"import/no-duplicates": "error",

			// Disable default import ordering rule
			"import/order": "off",
		},
	},
);
