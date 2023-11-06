import type { Meta, StoryObj } from '@storybook/react'
import { BoardColumn } from './BoardColumn'

/**
 * Meta
 */
export default {
	component: BoardColumn,
	title: 'UI/Board/BoardColumn',
} as Meta<typeof BoardColumn>

/**
 * Mock data
 */

/**
 * Stories
 */
type Story = StoryObj<typeof BoardColumn>

export const Primary: Story = {
	args: {},
}