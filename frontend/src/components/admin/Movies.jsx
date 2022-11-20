import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { deleteMovie, getMovieForUpdate, getMovies } from "../../api/movie";
import { useMovies, useNotification } from "../../hooks";
import ConfirmModal from "../modals/ConfirmModal";
import UpdateMovie from "../modals/UpdateMovie";
import MovieListItem from "./MovieListItem";
import NextAndPreviousButton from "./NextAndPreviousButton";

const limit = 8;
let currentPageNo = 0;

export default function Movies() {
	const [movies, setMovies] = useState([])
	const [reachedToEnd, setReachedToEnd] = useState(false);
	const [showUpdateMovieModal, setShowUpdateMovieModal] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState(null)
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [busy, setBusy] = useState(false)

	const { updateNotification } = useNotification();

	const { fetchMovies, fetchNextPage, fetchPrevPage, movies: newMovies } = useMovies()

	// const handleOnEditClick = async ({ id }) => {
	// 	const { movie, error } = await getMovieForUpdate(id)

	// 	if (error)
	// 		return updateNotification('error', error)
	// 	setSelectedMovie(movie)
	// 	setShowUpdateMovieModal(!showUpdateMovieModal)
	// }

	// const handleOnDeleteClick = async (movie) => {
	// 	setSelectedMovie(movie)
	// 	setShowConfirmModal(true)
	// }

	// const handleOnDeleteConfirm = async () => {
	// 	setBusy(true)
	// 	const { error, message } = await deleteMovie(selectedMovie.id)
	// 	setBusy(false)

	// 	if (error) return updateNotification('error', error)

	// 	updateNotification('success', message)
	// 	hideConfirmModal()
	// 	fetchMovies(currentPageNo)
	// }

	// const handleAfterUpdate = (movie) => {
	// 	const updatedMovies = movies.map(m => {
	// 		if (m.id === movie.id) {
	// 			return movie
	// 		}
	// 		return m
	// 	})

	// 	setMovies([...updatedMovies])
	// }

	// const hideConfirmModal = () => {
	// 	setShowConfirmModal(false)
	// }

	// const hideUpdateForm = () => {
	// 	setShowUpdateMovieModal(!showUpdateMovieModal)
	// }

	const handleUIUpdate = () => {
		fetchMovies()
	}
	useEffect(() => {
		fetchMovies();
	}, [])

	return (
		<>
			<div className="overflow-auto custom-scroll-bar grid grid-cols-2 gap-5 p-5 mt-4">
				{newMovies.map(movie => {
					return <MovieListItem
						key={movie.id}
						movie={movie}
						afterDelete={handleUIUpdate}
						afterUpdate={handleUIUpdate}
					// onEditClick={() => handleOnEditClick(movie)}
					// onDeleteClick={() => handleOnDeleteClick(movie)}
					/>
				})}
			</div>
			<NextAndPreviousButton
				className="mt-2"
				onNextClick={fetchNextPage}
				onPrevClick={fetchPrevPage}
			/>
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
	);
}
