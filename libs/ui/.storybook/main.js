const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)'
  ],
  addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@chkra-ui/storybook-addon',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'libs/ui/vite.config.ts',
      },
    },
  },
  docs: {
		autodocs: 'tag',
	},
}

export default config