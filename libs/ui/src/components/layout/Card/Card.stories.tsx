import type { Meta } from '@storybook/react'
import { Card } from './Card'

const Story: Meta<typeof Card> = {
	component: Card,
	title: 'UI/Layout/Card',
}
export default Story

export const Primary = {
	args: {},
}
