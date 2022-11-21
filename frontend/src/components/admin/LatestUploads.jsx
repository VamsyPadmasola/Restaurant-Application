import React, { useEffect, useState } from 'react'
import { getOrders } from '../../api/order';
import { useMovies, useNotification } from '../../hooks';
import MovieListItemSmall from './MovieListItemSmall'

export default function LatestUploads() {
    const [orders, setOrders] = useState([])
    const { updateNotification } = useNotification()
    // const [selectedMovie, setSelectedMovie] = useState(null)
    // const [showUpdateMovieModal, setShowUpdateMovieModal] = useState(false);
    // const [showConfirmModal, setShowConfirmModal] = useState(false)
    // const [busy, setBusy] = useState(false)

    const { latestUploads, fetchLatestUploads } = useMovies()

    // const fetchLatestUploads = async () => {
    //     const { error, movies } = await getMovies(pageNo, limit)
    //     if (error)
    //         return updateNotification('error', error)
    //     setMovies([...movies])
    // }

    const fetchOrders = async () => {
        const { results, error } = await getOrders();
        if (error) return updateNotification("error", error);
        setOrders([...results]);

    };

    // const handleOnEditClick = async ({ id }) => {
    //     const { movie, error } = await getMovieForUpdate(id)

    //     if (error)
    //         return updateNotification('error', error)
    //     setSelectedMovie(movie)
    //     setShowUpdateMovieModal(!showUpdateMovieModal)
    // }

    // const handleOnDeleteConfirm = async () => {
    //     setBusy(true)
    //     const { error, message } = await deleteMovie(selectedMovie.id)
    //     setBusy(false)

    //     if (error) return updateNotification('error', error)

    //     updateNotification('success', message)
    //     hideConfirmModal()
    //     fetchLatestUploads()
    // }
    // const handleOnUpdate = (movie) => {
    //     const updatedMovies = movies.map(m => {
    //         if (m.id === movie.id) {
    //             return movie
    //         }
    //         return m
    //     })

    //     setMovies([...updatedMovies])
    // }

    // const hideConfirmModal = () => {
    //     setShowConfirmModal(false)
    // }

    // const hideUpdateForm = () => {
    //     setShowUpdateMovieModal(!showUpdateMovieModal)
    // }

    // const handleOnDeleteClick = async (movie) => {
    //     setSelectedMovie(movie)
    //     setShowConfirmModal(true)
    // }

    const handleUIUpdate = () => {
        fetchLatestUploads()
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return (
        <>
            <div className='bg-primary p-5 rounded-3xl col-span-2 dark:shadow-darkShadow
        shadow-lightShadow h-[60vh] overflow-auto'>
                <h1 className='text-xl text-black'>Recent Orders</h1>
                {
                    orders.map(order => <OrderListSmall
                        order={order}
                        key={order.id}
                    // afterDelete={handleUIUpdate}
                    // afterUpdate={handleUIUpdate}
                    // onEditClick={() => handleOnEditClick(movie)}
                    // onDeleteClick={() => handleOnDeleteClick(movie)}
                    />
                    )
                }

            </div>
            {/* {
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
                    initialState={selectedMovie}
                    onSuccess={handleOnUpdate}
                    onClose={hideUpdateForm} />
            } */}
        </>
    )
}

const OrderListSmall = ({ order }) => {
    const { status, details, price } = order
    return (
        <div className='dark:bg-primary w-full bg-white h-24 dark:shadow-darkShadow shadow-lightShadow
            rounded-xl overflow-hidden mt-3 p-2'>
            <div className="flex relative w-full">
                <div className='w-20 flex items-center justify-center'>
                    <img src={"order.png"} className="h-20 aspect-video object-cover items-center justify-center" />
                </div>

                <div className='space-x-2'>
                    {
                        details.map((detail, index) => {
                            return (
                                <span key={detail.itemId} className='text-md'>
                                    {detail.itemName + " X " + detail.quantity}
                                </span>

                            )
                        })
                    }
                    <h1>₹ {price}</h1>
                    <h1>{status}</h1>
                </div>

                {/* <p className='dark:text-white text-sm text-primary opacity-70 capitalize'>{status}</p>

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
                        </button> */}
                {/* </div> */}
                {/* </div> */}
            </div>
        </div >
    )


}
