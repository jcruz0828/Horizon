'use server';

import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import React from 'react'

const Home = async () => {
  const loggedIn = await getLoggedInUser() 
  return (
    <section className='home'>       
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type ="greeting"
            title = "Welcome"
            user = {loggedIn?.name || "Guest"}
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