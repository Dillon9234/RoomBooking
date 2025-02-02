'use client'

import { login } from '@/utils/actions'
import React, { useActionState } from 'react'
import { useFormState } from 'react-dom'

const LoginForm = () => {
    const [state,formAction] = useActionState<any,FormData>(login,undefined)
  return (
    <form action={formAction}>
        <input type="text" name="username" required placeholder='username' className='text-black' />
        <input type="password" name="password" required placeholder='password' className='text-black' />
        <button>Login</button>
        {state?.error && <p>{state.error}</p>}
    </form>
  )
}

export default LoginForm