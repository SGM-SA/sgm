import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './Table'

/**
 * Meta
 */
export default {
	component: Table,
	title: 'UI/Data/Table',
} as Meta<typeof Table>

/**
 * Stories
 */
type Story = StoryObj<typeof Table>

export const Primary: Story = {
	args: {},
}

/**
 * Mock data
 */