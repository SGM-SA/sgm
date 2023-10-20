import type { Meta, StoryObj } from '@storybook/react'
import { Board } from './Board'
import { BoardColumnType } from '../../../utils'

/**
 * Meta
 */
export default {
	component: Board,
	title: 'UI/Board/Board',
} as Meta<typeof Board>

/**
 * Mock data
 */

type CardType = {
	id: number
	title: string
}

const data: BoardColumnType<CardType>[] = [
	{
		id: 'Column1',
		title: 'Column1',
		cards: [
			{
				id: 1,
				title: 'Card1',
			},
			{
				id: 2,
				title: 'Card2',
			},
		],
	},
	{
		id: 'Column2',
		title: 'Column2',
		cards: [
			{
				id: 3,
				title: 'Card3',
			},
			{
				id: 4,
				title: 'Card4',
			},
		],
	},
]

/**
 * Stories
 */
type Story = StoryObj<typeof Board<CardType>>

export const Primary: Story = {
	args: {
		initialData: data,
		renderCard: (card) => <div>{card.title}</div>,
		onCardMove: (card, to) => {
			console.log(card, to)
		},
	},
}
