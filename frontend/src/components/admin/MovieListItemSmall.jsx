import React, { useState } from 'react'
import { MdModeEditOutline } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { IoMdOpen } from 'react-icons/io'
import { deleteMovie } from '../../api/movie'
import { useNotification } from '../../hooks'
import ConfirmModal from '../modals/ConfirmModal'
import UpdateMovie from '../modals/UpdateMovie'
import { getPoster } from '../../utils/helper'

const MovieListItemSmall = ({ movie, afterDelete, afterUpdate }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showUpdateMovieModal, setShowUpdateMovieModal] = useState(false);
    const [busy, setBusy] = useState(false)
    const [selectedMovieId, setSelectedMovieId] = useState(null)

    const { updateNotification } = useNotification();

    const hideConfirmModal = () => {
        setShowConfirmModal(false)
    }
    const hideUpdateModal = () => {
        setShowUpdateMovieModal(false)
    }

    const handleOnDeleteConfirm = async () => {
        setBusy(true)
        const { error, message } = await deleteMovie(movie.id)
        setBusy(false)

        if (error) return updateNotification('error', error)
        hideConfirmModal()
        updateNotification('success', message)
        afterDelete(movie)
    }

    const displayConfirmModal = () => {
        setShowConfirmModal(true)
    }

    const handleOnEditClick = () => {
        setShowUpdateMovieModal(true)
        setSelectedMovieId(movie.id)
    }

    const handleOnUpdate = (movie) => {
        afterUpdate(movie)
        setShowUpdateMovieModal(!showUpdateMovieModal)
        setSelectedMovieId(null)
    }

    return (
        <>
            <Moviecard movie={movie}
                onDeleteClick={displayConfirmModal}
                onEditClick={handleOnEditClick}
            />
            {
                showConfirmModal &&
                <ConfirmModal
                    title='Are you sure?'
                    subtitle={"This action will remove this movie permanently!"}
                    busy={busy}
                    onConfirm={handleOnDeleteConfirm}
                    onCancel={hideConfirmModal}
                />
            }
            {
                showUpdateMovieModal &&
                <UpdateMovie
                    movieId={selectedMovieId}
                    onSuccess={handleOnUpdate}
                    onClose={hideUpdateModal}
                />
            }
        </>
    )
}

const Moviecard = ({ movie, onDeleteClick, onEditClick, onOpenClick }) => {
    const { poster, responsivePosters, title, genres = [], status } = movie
    return (
        <div className='dark:bg-primary w-full bg-white h-20 dark:shadow-darkShadow shadow-lightShadow
        rounded-xl overflow-hidden mt-3'>
            <div className="flex relative w-full">
                <div className='w-48'>
                    <img src={getPoster(responsivePosters) || poster} alt={title} className="w-full aspect-video object-cover" />
                </div>
                <div className='w-full flex justify-between'>
                    <div className='p-1 ml-2'>
                        <div>
                            <h1 className=" dark:text-white w-full text-primary font-semibold whitespace-nowrap">
                                {title}</h1>
                        </div>
                        <div className='space-x-1 opacity-70'>
                            {
                                genres.map((genre, index) => {
                                    return (
                                        <span key={genre + index} className='text-xs dark:text-white text-primary '>
                                            {genre}
                                        </span>
                                    )
                                })
                            }
                        </div>
                        <p className='dark:text-white text-sm text-primary opacity-70 capitalize'>{status}</p>

                    </div>
                    <div className='flex items-start space-x-3 text-lg mt-4 mr-5'>
                        <button type='button' className='text-white cursor-pointer bg-red-btn rounded-full p-1.5 hover:opacity-70 transition'
                            onClick={onDeleteClick}>
                            <AiFillDelete />
                        </button>
                        <button type='button' className='text-white cursor-pointer bg-orange-btn rounded-full p-1.5 hover:opacity-70 transition'
                            onClick={onEditClick}>
                            <MdModeEditOutline />
                        </button>
                        <button type='button' className='text-white cursor-pointer bg-blue-btn rounded-full p-1.5 hover:opacity-70 transition'
                            onClick={onOpenClick}>
                            <IoMdOpen />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default MovieListItemSmall;