import React from 'react'

export default function NotFound({ text, visible }) {
    if (!visible) return null
    return (
        <div className='flex items-center justify-center relative top-32 flex-col space-y-4'>
            <img src='noresults.png' className='w-56 h-56' />
            <h1 className="font-semibold text-3xl text-black text-center py-5
            opacity-40">{text}</h1>
        </div>
    )
}
