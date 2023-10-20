import type { Meta, StoryObj } from '@storybook/react'
import { TextLink } from './TextLink'

/**
 * Meta
 */
export default {
	component: TextLink,
	title: 'UI/Text/TextLink',
} as Meta<typeof TextLink>

/**
 * Mock data
 */

/**
 * Stories
 */
type Story = StoryObj<typeof TextLink>

export const Primary: Story = {
	args: {},
}