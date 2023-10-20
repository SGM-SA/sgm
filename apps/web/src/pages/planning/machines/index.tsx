import React, { useState } from 'react'

const initialBoard = {
	columns: [
		{
			id: 1,
			title: 'Backlog',
			cards: [
				{
					id: 1,
					title: 'Add card',
					description: 'Add capability to add a card in a column',
				},
			],
		},
		{
			id: 2,
			title: 'Doing',
			cards: [
				{
					id: 2,
					title: 'Drag-n-drop support',
					description: 'Move a card between the columns',
				},
			],
		},
	],
}

const PlanningMachinesPage: React.FC = () => {

    // const [board, setBoard] = useState(initialBoard)

	return <>
        {/* <Board
            initialBoard={board}
            // renderColumnHeader={({ title, id }: any) => {
            //     return <div>{title} - {id}</div>   
            // }}
            // renderCard={(
            //     { id, title, description }: any,
            //     { dragging }: any,
            // ) => {
            //     return (
            //         <div
            //             style={{
            //                 opacity: dragging ? 0.5 : 1,
            //                 padding: 10,
            //                 border: '1px solid lightgrey',
            //                 backgroundColor: 'white',
            //             }}
            //         >
            //             <div>{title}</div>
            //             <div>{description}</div>
            //         </div>
            //     )
            // }}
        /> */}
    </>
}

export default PlanningMachinesPage
