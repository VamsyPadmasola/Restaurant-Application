import React from 'react'

export default function NextAndPreviousButton({ onNextClick, onPrevClick, className = '' }) {
    const getClasses = () => {
        return "flex justify-center items-center space-x-3 ";
    }
    return (
        <div className={getClasses() + className}>
            <Button onClick={onPrevClick} title={'Prev'} />
            <Button onClick={onNextClick} title={'Next'} />
        </div>
    )
}

const Button = ({ title, onClick }) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className="text-black hover:underline">
            {title}
        </button>
    )
}
