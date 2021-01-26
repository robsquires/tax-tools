module.exports = {
	printWidth: 120,
	singleQuote: true,
	bracketSpacing: true,
	useTabs: false,
	tabWidth: 4,
	trailingComma: 'all',
	arrowParens: 'always',
	semi: false,
	overrides: [
		{
			// npm uses 2 spaces rather than tabs, so maintain that rule
			files: ['**/package.json', '**/package-lock.json'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
}
