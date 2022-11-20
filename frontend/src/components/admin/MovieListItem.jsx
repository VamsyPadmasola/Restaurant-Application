import React, { useState } from 'react'
import { MdModeEditOutline } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { IoMdOpen } from 'react-icons/io'
import { deleteMovie } from '../../api/movie'
import { useNotification } from '../../hooks'
import ConfirmModal from '../modals/ConfirmModal'
import UpdateMovie from '../modals/UpdateMovie'
import { getPoster } from '../../utils/helper'

const MovieListItem = ({ movie, afterDelete, afterUpdate }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showUpdateMovieModal, setShowUpdateMovieModal] = useState(false);
    const [busy, setBusy] = useState(false)
    const [selectedMovieId, setSelectedMovieId] = useState(null)

    const { updateNotification } = useNotification();

    const hideConfirmModal = () => {
        setShowConfirmModal(false)
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

    const hideUpdateModal = () => {
        setShowUpdateMovieModal(false)
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
        <div className='dark:bg-primary w-[35rem] bg-white h-32 dark:shadow-darkShadow shadow-lightShadow
        rounded-xl overflow-hidden'>
            <div className="flex cursor-pointer relative">
                <div className='w-[25rem]'>
                    <img src={getPoster(responsivePosters) || poster} alt={title} className="w-full aspect-video object-cover" />
                </div>
                <div className="p-2 w-full">
                    <div className='flex justify-between overflow-auto'>
                        <div>
                            <h1 className=" dark:text-white w-full text-xl text-primary font-semibold whitespace-nowrap">
                                {title}</h1>
                        </div>
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
                    <div className='flex items-center space-x-3 text-lg mt-2'>
                        <button type='button' className='text-white bg-red-btn rounded-full p-1.5 hover:opacity-70 transition'
                            onClick={onDeleteClick}>
                            <AiFillDelete />
                        </button>
                        <button type='button' className='text-white bg-orange-btn rounded-full p-1.5 hover:opacity-70 transition'
                            onClick={onEditClick}>
                            <MdModeEditOutline />
                        </button>
                        <button type='button' className='text-white bg-blue-btn rounded-full p-1.5 hover:opacity-70 transition'
                            onClick={onOpenClick}>
                            <IoMdOpen />
                        </button>
                    </div>
                </div>
            </div>
        </div >
        // <table className='w-full border-b mt-5'>
        //     <tbody>
        //         <tr>
        //             <td>
        //                 <div className='w-24'>
        //                     <img className='w-full aspect-video'
        //                         src={poster}
        //                         alt={title} />
        //                 </div>
        //             </td>
        //             <td className='w-full pl-5'>
        //                 <div>
        //                     <h1 className='dark:text-white text-primary text-lg font-semibold'>
        //                         {title}
        //                     </h1>
        //                     <div className='space-x-1'>
        //                         {
        //                             genres.map((genre, index) => {
        //                                 return (
        //                                     <span key={genre + index} className='text-xs dark:text-white text-primary '>
        //                                         {genre}
        //                                     </span>
        //                                 )
        //                             })
        //                         }
        //                     </div>
        //                 </div>
        //             </td>
        //             <td className='px-5'>
        //                 <p className='dark:text-white text-primary'>{status}</p>
        //             </td>
        //             <td>
        //                 <div className='flex items-center space-x-3 text-lg'>
        //                     <button type='button' className='dark:text-white text-primary'
        //                         onClick={onDeleteClick}>
        //                         <BsTrash />
        //                     </button>
        //                     <button type='button' className='dark:text-white text-primary'
        //                         onClick={onEditClick}>
        //                         <BsPencilSquare />
        //                     </button>
        //                     <button type='button' className='dark:text-white text-primary'
        //                         onClick={onOpenClick}>
        //                         <BsBoxArrowUpRight />
        //                     </button>
        //                 </div>
        //             </td>
        //         </tr>
        //     </tbody>
        // </table>
    )
}
export default MovieListItem;