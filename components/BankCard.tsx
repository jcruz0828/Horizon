import { formatAmount } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const BankCard = ({account,userName,showBalance = true}:CreditCardProps) => {
  return (
    <div className='flex flex-col'>
      <Link
      href ='/'
      className='bank-card'
      >
        <div className='bank-card_content'>
          <div>
            <h1 className='text-16 font-semibold text-white'>
              {account?.name || userName}
            </h1>
            <p className='font-ibm-plex-serif font-black text-white'>
              {formatAmount(account.currentBalance)}
            </p>
          </div>
          <article className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <h1 className='text-12 font-semibold text-white'>
                {userName}
              </h1>
              <h1 className='text-10 font-semibold text-white'>
              ●● / ●●
              </h1>
            </div>
            <p className='text-10 font-semibold tracking-[1.1px] text-white'>
            ●●●● ●●●● ●●●● <span className='text-10'>
                1234
              </span>
            </p>
          </article>
        </div>
        <div className='bank-card_icon'>
          <Image
          src = '/icons/Paypass.svg'
          height={24}
          width={20}
          alt='pay'
          />
          <Image
          src = 'icons/mastercard.svg'
          height={32}
          width={45}
          alt = 'mastercard'
          className='ml-5'
          />
        </div>
        <Image
        src = '/icons/lines.png'
        width={316}
        height={190}
        alt='lines'
        className='absolute top-0 left-o'
        />
      </Link>
    </div>
  )
}

export default BankCard