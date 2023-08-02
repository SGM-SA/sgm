import { Button, Flex, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchAuthTokenCreate } from '@sgm/openapi'
import { Card } from '@sgm/ui'
import { useToken } from '@sgm/web/auth'
import { useNavigate } from '@sgm/web/router'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const authFormSchema = z.object({
    username: z.string(),
    password: z.string().min(6, { message: "Password must be atleast 6 characters" })
})

type AuthFormSchema = z.infer<typeof authFormSchema>

const LoginPage: React.FC = () => {

    const navigate = useNavigate()
    const { setToken } = useToken()

    const {
        register,
        handleSubmit,
    } = useForm<AuthFormSchema>({
        resolver: zodResolver(authFormSchema)
    })

    const onSubmit: SubmitHandler<AuthFormSchema> = ({ username, password }) => {

        // @ts-ignore
        fetchAuthTokenCreate({ body: { username, password } })
            .then(res => {
                setToken(res.access)
                navigate('/')
            })
            .catch(err => {
                console.log(err)
            })
    }

	return <>

        <Flex
            width='100vw'
            height='100vh'
            justifyContent='center'
            alignItems='center'
            backgroundColor='#0f172a'
        >
            <Card
                center={true}
                width='40vw'
                mt='-25vh'
            >

                <Heading as='h1'
                    fontSize='1.5rem'
                >
                    Se connecter
                </Heading>

                <FormControl>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <Input placeholder="Nom d'utilisateur" {...register('username', { required: true })}/>
                </FormControl>

                <FormControl>
                    <FormLabel>Mot de passe</FormLabel>
                    <Input type='password' placeholder="Mot de passe" {...register('password', { required: true })} />
                </FormControl>

                <Button
                    w='100%'
                    variant='primary'
                    mt='1rem'
                    onClick={handleSubmit(onSubmit)}
                >
                    Se connecter
                </Button>
            </Card>
        </Flex>
    </>
}

export default LoginPage