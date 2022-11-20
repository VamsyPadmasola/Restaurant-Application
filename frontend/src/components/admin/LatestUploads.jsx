import React, { useEffect } from 'react'
import { useMovies } from '../../hooks';
import MovieListItemSmall from './MovieListItemSmall'

export default function LatestUploads() {
    // const [movies, setMovies] = useState([])
    // const { updateNotification } = useNotification()
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
        fetchLatestUploads()
    }, [])

    return (
        <>
            <div className='bg-primary p-5 rounded-3xl col-span-2 dark:shadow-darkShadow
        shadow-lightShadow'>
                <h1 className='text-xl text-black'>Recent Orders</h1>
                {/* {
                    latestUploads.map(movie => <MovieListItemSmall
                        movie={movie}
                        key={movie.id}
                        afterDelete={handleUIUpdate}
                        afterUpdate={handleUIUpdate}
                    // onEditClick={() => handleOnEditClick(movie)}
                    // onDeleteClick={() => handleOnDeleteClick(movie)}
                    />
                    )
                } */}

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
