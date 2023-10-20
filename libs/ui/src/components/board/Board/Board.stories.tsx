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
		id: 1,
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
		id: 2,
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
	{
		id: 3,
		title: 'Column3',
		cards: [
			{
				id: 5,
				title: 'Card5',
			},
			{
				id: 6,
				title: 'Card6',
			},
		],
	},
	{
		id: 4,
		title: 'Column4',
		cards: [
			{
				id: 7,
				title: 'Card7',
			},
			{
				id: 8,
				title: 'Card8',
			},
		],
	},
	{
		id: 5,
		title: 'Column5',
		cards: [
			{
				id: 9,
				title: 'Card9',
			},
			{
				id: 10,
				title: 'Card10',
			},
		],
	},
	{
		id: 6,
		title: 'Column6',
		cards: [
			{
				id: 11,
				title: 'Card11',
			},
			{
				id: 12,
				title: 'Card12',
			},
		],
	},
	{
		id: 7,
		title: 'Column7',
		cards: [
			{
				id: 13,
				title: 'Card13',
			},
			{
				id: 14,
				title: 'Card14',
			},
		],
	}

]

/**
 * Stories
 */
type Story = StoryObj<typeof Board<CardType>>

export const Primary: Story = {
	args: {
		columns: data,
		renderCardBody: (card) => <div>{card.title}</div>,
		onCardMove: (card, to) => {
			console.log(card, to)
		},
		collapsable: {
			cards: true,
			columns: true,
		},
		pinFirstColumn: true,
		styling: {
			column: (column) => ({
				bg: column.id % 2 === 0 ? 'red.100' : 'blue.100',
			}),
			card: (card) => ({
				bg: card.id % 2 === 0 ? 'red.200' : 'blue.200',
			}),
		}
	},
}
