import type { Meta, StoryObj } from '@storybook/react'
import { DefaultTableCell } from './DefaultTableCell'

/**
 * Meta
 */
export default {
	component: DefaultTableCell,
	title: 'UI/Data/DefaultTableCell',
} as Meta<typeof DefaultTableCell>

/**
 * Stories
 */
type Story = StoryObj<typeof DefaultTableCell>

export const Primary: Story = {
	args: {},
}

/**
 * Mock data
 */