import type { Meta, StoryObj } from '@storybook/react'
import { CollapsableElement } from './CollapsableElement'

/**
 * Meta
 */
export default {
	component: CollapsableElement,
	title: 'UI/Layout/CollapsableElement',
} as Meta<typeof CollapsableElement>

/**
 * Mock data
 */

/**
 * Stories
 */
type Story = StoryObj<typeof CollapsableElement>

export const Primary: Story = {
	args: {},
}