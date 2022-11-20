import React, { useState } from 'react'
import { useEffect } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import Submit from './Submit'


const createArray = (count) => {
    return new Array(count).fill('')
}
const ratings = createArray(10)
export default function RatingForm({ busy, initialState, onSubmit }) {

    const [selectedRatings, setSelectedRatings] = useState([])
    const [content, setContent] = useState('')

    const handleMouseEnter = (index) => {
        const ratings = createArray(index + 1)
        setSelectedRatings([...ratings])
    }

    const handleOnChange = ({ target }) => {
        setContent(target.value)
    }

    const handleSubmit = () => {
        if (!selectedRatings.length) return;
        const data = {
            rating: selectedRatings.length,
            content: content
        }
        onSubmit(data)
    }

    useEffect(() => {
        if (initialState) {
            setContent(initialState.content)
            setSelectedRatings(createArray(initialState.rating))
        }

    }, [initialState])

    return (
        <div>
            <div className='p-5 dark:bg-primary bg-white rounded space-y-3'>
                <div className='text-highlight dark:text-highlight-dark flex items-center relative'>
                    <StarsOutLined ratings={ratings} onMouseEnter={handleMouseEnter} />
                    <div className='flex absolute top-1/2 -translate-y-1/2 items-center'>
                        <StarsFilled ratings={selectedRatings} onMouseEnter={handleMouseEnter} />
                    </div>
                </div>
                <textarea className='h-24 w-full border-2 p-2 dark:text-white text-primary rounded resize-none
                outline-none bg-transparent'
                    value={content}
                    onChange={handleOnChange}>

                </textarea>

                <Submit busy={busy} onClick={handleSubmit} value={"Rate this Movie"} />
            </div>
        </div>
    )
}

const StarsOutLined = ({ ratings, onMouseEnter }) => {
    return ratings.map((_, index) => {
        return <AiOutlineStar className='cursor-pointer'
            key={index} size={24}
            onMouseEnter={() => onMouseEnter(index)} />
    })
}

const StarsFilled = ({ ratings, onMouseEnter }) => {
    return ratings.map((_, index) => {
        return <AiFillStar className='cursor-pointer'
            key={index} size={24}
            onMouseEnter={() => onMouseEnter(index)} />
    })
}