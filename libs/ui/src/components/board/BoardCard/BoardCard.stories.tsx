import type { Meta, StoryObj } from '@storybook/react'
import { BoardCard } from './BoardCard'

/**
 * Meta
 */
export default {
	component: BoardCard,
	title: 'UI/Board/BoardCard',
} as Meta<typeof BoardCard>

/**
 * Mock data
 */

/**
 * Stories
 */
type Story = StoryObj<typeof BoardCard>

export const Primary: Story = {
	args: {},
}