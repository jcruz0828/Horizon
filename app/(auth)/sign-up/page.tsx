import AuthForm from '@/components/AuthForm'
import React from 'react'

const SignUp = async () => {

  return (
    <section className='flex flex-center size-full max-sm:px-5'>
    <AuthForm
    type = 'sign-up'
    />
    </section>
  )
}

export default SignUp