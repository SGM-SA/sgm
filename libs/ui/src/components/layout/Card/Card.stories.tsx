import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

/**
 * Meta
 */
export default {
	component: Card,
	title: 'UI/Layout/Card',
} as Meta<typeof Card>

/**
 * Stories
 */
type Story = StoryObj<typeof Card>

export const Primary: Story = {
	args: {},
}

/**
 * Mock data
 */