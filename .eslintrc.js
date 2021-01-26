module.exports = {
	env: {
		node: true,
		jest: true,
		es6: true
	},
	extends: [
		'plugin:jest/recommended',
		'plugin:jest-formatting/recommended',
		'plugin:prettier/recommended',
		'prettier',
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
	],
	plugins: ['jest-formatting'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2020,
		sourceType: 'module',
	},
}

