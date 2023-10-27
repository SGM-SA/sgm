import { Box, ChakraProps, Flex, Spinner } from '@chakra-ui/react'
import { Draggable, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { BaseBoardCardType, cardBorderStyle } from '../../../utils'
import { CollapsableElement } from '../../layout/CollapsableElement/CollapsableElement'


type BoardCardProps<TData extends BaseBoardCardType> = {
    card: TData
    index: number
    renderCardBody?: (card: TData) => JSX.Element
    title?: React.ReactNode
    collapse?: boolean
    chakraProps?: ChakraProps
    disableSortingAnimation?: boolean
}

export function BoardCard<TData extends BaseBoardCardType>(props: BoardCardProps<TData>) {

	return <>
        <Draggable
            key={String(props.card.id)}
            draggableId={String(props.card.id)}
            index={props.index}
        >
            {(provided, snapshot) => (
                <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                    m='.5em' p='1em'
                    opacity={1}
                    bg='secondary.100'
                    {...cardBorderStyle}
                    {...props.chakraProps}
                    {...(props.disableSortingAnimation ? {
                        style: getStyle(provided.draggableProps.style, snapshot)
                    } : {})}
                >
                    {props.card.isLoading &&
                        <Flex w='100%' justifyContent='center'>
                            <Spinner />
                        </Flex>
                    }
                    {!props.card.isLoading &&
                        <CollapsableElement
                            title={props.title || props.card.title}
                            collapsable={props.collapse ?? false}
                            fontSize='sm'
                        >
                            {props.renderCardBody?.(props.card)}
                        </CollapsableElement>
                    }
                </Box>
            )}
        </Draggable>
    </>
}

const getStyle = (style: any, snapshot: DraggableStateSnapshot) => {
    if (!snapshot.isDragging) return {};
    if (!snapshot.isDropAnimating) {
      return style;
    }

    return {
      ...style,
      // cannot be 0, but make it super tiny
      transitionDuration: `0.001s`
    };
  }
