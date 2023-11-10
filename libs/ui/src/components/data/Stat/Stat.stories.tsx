import type { Meta, StoryObj } from '@storybook/react'
import { Stat } from './Stat'

/**
 * Meta
 */
export default {
	component: Stat,
	title: 'UI/Data/Stat',
} as Meta<typeof Stat>

/**
 * Mock data
 */

/**
 * Stories
 */
type Story = StoryObj<typeof Stat>

export const Primary: Story = {
	args: {},
}