import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import React from 'react'

const Home = () => {
  const loggedIn = {firstName:'Jose',lastName:"coyt",email: 'Jcoytfined@icloud.com'}
  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type ="greeting"
            title = "Welcome"
            user = {loggedIn?.firstName || "Guest"}
            subtext = "Access and manage your bank accounts effeciently"
          />
        </header>
        RECENT TRANS
      </div>
      <RightSidebar 
      user = {loggedIn}
      transactions = {[]}
      banks = {[{currentBalance:1250},{currentBalance:350}]}
      />
    </section>
  )
}

export default Home