import React from 'react'
import { Link } from 'react-router-dom'

const WelcomePage = () => {
  return (
    <>
      <div className='parent-container mt-6 flex justify-center item-center h-screen'>
        <div className='Main-container'>
            <div >
                <h1 className='text-6xl font-medium Heading'>Thanks for Using <br /><span>Our Product</span></h1>
                <h3 className='pt-[35px] text-3xl font-medium '>We appreciate your download of our CRM Website </h3>
                <span className='text-3xl font-medium'>UI Kit and trust it proves beneficial for your needs. </span>

            </div>

            <div className='mt-5 '>
                <h3 className='text-3xl font-medium'>Do you need other pages of CRM UI kit to speed-up <br /> your design process. Let's explore our full-version <br /> CRM UI kit at Ui8.</h3>
                <div className='mt-4'>
                    <h3 className='text-3xl font-medium text-gray-400'>
                        What will you get from our full-version product:
                    </h3>

                    <h3 className='mt-3 text-3xl font-medium text-gray-400'>
                        - 70+ Dashboards & Websites <br />
                        - 10+ CRM Features <br />
                        - 100+ Components- <br />
                        - Ready Token Design <br />
                        - Modern & Clean design <br />
                        - Organized Layers <br />
                        - Style Guidelines <br />
                    </h3>

                    <h3 className='mt-3 text-3xl font-medium text-gray-400'>Boost your design process with our UI kit now </h3>

                    <Link
                        to='/notes'
                        className='inline-block bg-black text-white p-4 rounded-2xl w-[255px] mt-3 text-center'
                    >
                        Continue to Notes
                    </Link>
                </div>
            </div>
            
        </div>
      </div>
    
    </>
  )
}

export default WelcomePage