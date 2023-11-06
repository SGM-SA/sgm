import type { Meta, StoryObj } from '@storybook/react'
import { TableLayout } from './TableLayout'

/**
 * Meta
 */
export default {
	component: TableLayout,
	title: 'UI/Layout/TableLayout',
} as Meta<typeof TableLayout>

/**
 * Mock data
 */

/**
 * Stories
 */
type Story = StoryObj<typeof TableLayout>

export const Primary: Story = {
	args: {},
}