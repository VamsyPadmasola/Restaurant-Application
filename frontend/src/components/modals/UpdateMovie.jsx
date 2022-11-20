import React, { useState } from 'react'
import { useEffect } from 'react';
import { getMovieForUpdate, updateMovie } from '../../api/movie'
import { useNotification } from '../../hooks';
import MovieForm from '../admin/MovieForm'
import Loader from '../ui/Loader';
import Modal from './Modal'

export default function UpdateMovie({ movieId, onSuccess, onClose }) {

    const [busy, setBusy] = useState(false);
    const [ready, setReady] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null)

    const { updateNotification } = useNotification()

    const handleSubmit = async (data) => {
        setBusy(true)
        const { error, message, movie } = await updateMovie(movieId, data)
        setBusy(false)
        if (error) return updateNotification('error', error)

        updateNotification('success', message);
        onSuccess(movie)
        onClose();
    }

    const fetchMovieToUpdate = async () => {
        const { movie, error } = await getMovieForUpdate(movieId)

        if (error)
            return updateNotification('error', error)
        setSelectedMovie(movie)
        setReady(true)
    }

    useEffect(() => {
        if (movieId)
            fetchMovieToUpdate()
    }, [movieId])
    return (
        <Modal title='Update Movie' onClose={onClose}>
            {ready ?
                <div className='p-4'>
                    <MovieForm
                        btnTitle="Update"
                        initialState={selectedMovie}
                        onSubmit={!busy ? handleSubmit : null}
                        busy={busy} />
                </div>
                :
                <Loader />
            }

        </Modal>
    )
}
