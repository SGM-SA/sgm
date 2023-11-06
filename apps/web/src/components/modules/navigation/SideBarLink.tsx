import { ColorProps, HStack, Icon, Text } from '@chakra-ui/react'
import { Link, Path } from '@sgm/web/router'
import React from 'react'
import { IconType } from 'react-icons'

type SideBarLinkProps = {
    icon: IconType
    text: string
    to: Path
    color?: ColorProps['color']
}

export const SideBarLink: React.FC<SideBarLinkProps> = (props) => {

	return <>
        <Link to={{ pathname: props.to }}>
            <HStack color={props.color || 'unset'}>
                <Icon color={props.color || 'primary.50'} as={props.icon}/>
                <Text textTransform='uppercase' fontSize='.8rem' fontWeight='bold'>{props.text}</Text>
            </HStack>
        </Link>
    </>
}
