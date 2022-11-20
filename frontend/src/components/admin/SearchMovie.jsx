import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMoviesForAdmin } from '../../api/movie'
import { useNotification } from '../../hooks'
import NotFound from '../ui/NotFound'
import MovieListItem from './MovieListItem'

export default function SearchMovie() {

    const [searchParams] = useSearchParams()
    const query = searchParams.get('title')

    const [movies, setMovies] = useState([])
    const [resultNotFound, setResultNotFound] = useState(false)

    const { updateNotification } = useNotification()

    const searchMovies = async (val) => {
        const { error, results } = await searchMoviesForAdmin(val)
        if (error)
            return updateNotification('error', error)
        console.log(results.length)
        if (!results.length) {
            setResultNotFound(true)
            setMovies([])
        }
        else {
            setResultNotFound(false)
            setMovies([...results])
        }
    }

    useEffect(() => {
        if (query.trim())
            searchMovies(query)
    }, [query])

    const handleAfterDelete = (movie) => {
        const updateMovies = movies.filter((m) => m.id !== movie.id)
        setMovies([...updateMovies])
    }

    const handleAfterUpdate = (movie) => {
        const updateMovies = movies.map((m) => {
            if (m.id === movie.id) return movie
            return m
        })
        setMovies([...updateMovies])
    }

    return (
        <div className='overflow-auto custom-scroll-bar grid grid-cols-2 gap-5 p-5 mt-4'>
            <NotFound text={'Record not found!'} visible={resultNotFound} />
            {
                !resultNotFound &&
                movies.map(movie => <MovieListItem movie={movie} key={movie.id}
                    afterDelete={handleAfterDelete} afterUpdate={handleAfterUpdate} />)
            }
        </div>
    )
}
