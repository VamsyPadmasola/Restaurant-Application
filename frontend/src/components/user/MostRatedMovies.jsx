import React, { useState } from 'react'
import { useEffect } from 'react'
import { getMostRatedMovies } from '../../api/admin'
import { useNotification } from '../../hooks'
import { convertReviewCount } from '../../utils/helper'
import RatingStar from './RatingStar'

export default function MostRatedMovies() {
    const [movies, setMovies] = useState([])
    const { updateNotification } = useNotification()

    const fetchMostRatedMovies = async () => {
        const { error, movies } = await getMostRatedMovies()
        if (error)
            return updateNotification('error', error)
        setMovies([...movies])
    }

    useEffect(() => {
        fetchMostRatedMovies()
    }, [])
    return (
        <div className='bg-primary p-5 rounded-3xl dark:shadow-darkShadow
        shadow-lightShadow'>
            <h1 className='text-xl text-black'>Most Rated Food</h1>
            <ul className='space-y-5 mt-4'>
                {/* {movies.map(movie => {
                    return (
                        <li>
                            <h1 className='dark:text-white text-primary font-semibold'>
                                {movie.title}
                            </h1>
                            <div className='flex space-x-2'>
                                <RatingStar rating={movie.reviews?.ratingAvg} />
                                <p className='dark:text-dark-subtle text-light-subtle'>
                                    {convertReviewCount(movie.reviews?.reviewCount)} Reviews
                                </p>
                            </div>
                        </li>)
                })} */}
            </ul>
        </div>
    )
}
