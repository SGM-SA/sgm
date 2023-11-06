import type { Meta, StoryObj } from '@storybook/react'
import { TableHeader } from './TableHeader'
import { Button, HStack } from '@chakra-ui/react'

/**
 * Meta
 */
export default {
	component: TableHeader,
	title: 'UI/Table/TableHeader',
} as Meta<typeof TableHeader>

/**
 * Stories
 */
type Story = StoryObj<typeof TableHeader>

export const Primary: Story = {
	args: {
		title: 'Table title',
		children: <HStack>
			<Button>
				Action
			</Button>
		</HStack>
	},
}

/**
 * Mock data
 */