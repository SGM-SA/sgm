import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
	stories: [
		'../../../libs/**/*.stories.@(js|jsx|ts|tsx|mdx)',
		'../../../apps/**/*.stories.@(js|jsx|ts|tsx|mdx)',
	],
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-links',
		'@chakra-ui/storybook-addon',
	],
	core: {
		disableTelemetry: true,
	},
	framework: {
		name: '@storybook/react-vite',
		options: {
			builder: {
				viteConfigPath: 'libs/storybook/vite.config.ts',
			},
		},
	},
	docs: {
		autodocs: 'tag',
	},
}

export default config