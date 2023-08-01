import { zodResolver } from '@hookform/resolvers/zod'
import { AuthService } from '@sgm/openapi'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { setToken } from '../../core/utils/auth'

const authFormSchema = z.object({
    username: z.string(),
    password: z.string().min(6, { message: "Password must be atleast 6 characters" })
})

type AuthFormSchema = z.infer<typeof authFormSchema>

const Login: React.FC = () => {

    const {
        register,
        handleSubmit,
    } = useForm<AuthFormSchema>({
        resolver: zodResolver(authFormSchema)
    })

    const onSubmit: SubmitHandler<AuthFormSchema> = async ({ username, password }) => {

        // @ts-ignore
        const res = await AuthService.authTokenCreate({ username, password })
        setToken(res.access)
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