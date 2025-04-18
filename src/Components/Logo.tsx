import React from 'react'
import logoImage from '../../public/logo.png'
import Image from 'next/image'

const Logo = () => {
  return (<section className='flex items-center'>
              <Image
                src={logoImage}
                alt="logo"
                width={70}
                height={50}
                priority
                style={{ objectFit: 'cover' }}
              /> <span className="text-white font-bold">
                Spot
              </span>
              </section>
  )
}
export default Logo
