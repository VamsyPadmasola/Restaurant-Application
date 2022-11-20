import React from 'react'

export default function AppInfoBox({ title, subTitle }) {
    return (
        <div className=' bg-primary p-5 dark:shadow-darkShadow shadow-lightShadow
        rounded-3xl'>
            <h1 className='font-semibold text-2xl mb-2 text-black'>
                {title}
            </h1>
            <p className='text-6xl text-secondary'>
                {subTitle}
            </p>
        </div>
    )
}
