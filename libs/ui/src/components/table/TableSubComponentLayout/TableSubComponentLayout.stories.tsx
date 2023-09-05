import type { Meta, StoryObj } from '@storybook/react'
import { TableSubComponentLayout } from './TableSubComponentLayout'

/**
 * Meta
 */
export default {
	component: TableSubComponentLayout,
	title: 'UI/Table/TableSubComponentLayout',
} as Meta<typeof TableSubComponentLayout></typeof>

/**
 * Stories
 */
type Story = StoryObj<typeof TableSubComponentLayout>

export const Primary: Story = {
	args: {},
}

/**
 * Mock data
 */