import type { Meta, StoryObj } from '@storybook/react'
import { AffaireNotes } from './AffaireNotes'
import { NoteDetail } from '@sgm/openapi'
import { dayjs } from '@sgm/utils'

/**
 * Meta
 */
export default {
	component: AffaireNotes,
	title: 'Web/Affaire/AffaireNotes',
} as Meta<typeof AffaireNotes>

/**
 * Mock data
 */

const notes: NoteDetail[] = [
    {
        id: 1,
        contenu: 'Bonjour, comment vous allez ?',
        date_creation: dayjs().subtract(5, 'minute').toString(),
        user: 'Bartho'
    },
    {
        id: 2,
        contenu: 'Ca va bien et vous ?',
        date_creation: dayjs().subtract(10, 'minute').toString(),
        user: 'Lou-Anne',
    },
    {
        id: 3,
        contenu: 'Ca va bien merci',
        date_creation: dayjs().subtract(15, 'minute').toString(),
        user: 'Bartho',
    }
]

/**
 * Stories
 */
type Story = StoryObj<typeof AffaireNotes>

export const Primary: Story = {
	args: {
        notes: notes,
    },
}