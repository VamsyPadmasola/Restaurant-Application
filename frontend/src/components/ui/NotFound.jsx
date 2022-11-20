import React from 'react'

export default function NotFound({ text, visible }) {
    if (!visible) return null
    return (
        <div><h1 className="font-semibold text-3xl dark:text-white text-primary text-center py-5
    opacity-40">{text}</h1></div>
    )
}
