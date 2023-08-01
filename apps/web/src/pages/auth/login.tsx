import { zodResolver } from '@hookform/resolvers/zod'
import { fetchAuthTokenCreate } from '@sgm/openapi'
import { useToken } from '@sgm/web/auth'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { redirect } from 'react-router-dom'
import { z } from 'zod'

const authFormSchema = z.object({
    username: z.string(),
    password: z.string().min(6, { message: "Password must be atleast 6 characters" })
})

type AuthFormSchema = z.infer<typeof authFormSchema>

const Login: React.FC = () => {

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
                return redirect('/')
            })
            .catch(err => {
                console.log(err)
            })
    }

	return <>
        <label htmlFor="username"><b>Username</b></label>
        <input {...register('username', { required: true })}/>

        <label htmlFor="password"><b>Password</b></label>
        <input type="password" {...register('password', { required: true })}/>

        <button type="submit" onClick={handleSubmit(onSubmit)}>Login</button>
    </>
}

export default Login