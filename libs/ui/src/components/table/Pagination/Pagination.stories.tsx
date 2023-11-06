import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './Pagination'

/**
 * Meta
 */
export default {
	component: Pagination,
	title: 'UI/Data/Pagination',
} as Meta<typeof Pagination>

/**
 * Stories
 */
type Story = StoryObj<typeof Pagination>

export const Primary: Story = {
	args: {},
}

/**
 * Mock data
 */