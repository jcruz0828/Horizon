import React from 'react'
import TotalBalanceBox from './TotalBalanceBox'

const headerBox = ({type = 'title',title,subtext,user}:HeaderBoxProps) => {
  return (
    <div className='header-box'>
       <h1 className='header-box-title'>
        {title}
        {type === "greeting" && (
          <span className='text-bankGradient'>
            &nbsp; {user}
          </span>
        )}
       </h1>
       <p className='header-subtext'>{subtext}</p>
    </div>
  )
}

export default headerBox