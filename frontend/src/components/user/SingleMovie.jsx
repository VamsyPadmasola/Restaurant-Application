import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react";
import { getSingleMovie } from "../../api/movie";
import { useAuth, useNotification } from "../../hooks";
import Loader from "../ui/Loader";
import Container from "../Container";
import RatingStar from "./RatingStar";
import RelatedMovies from "./RelatedMovies";
import AddRatingModal from "../modals/AddRatingModal";
import CustomButtonLink from "../ui/CustomButtonLink";
import ProfileModal from "../modals/ProfileModal";
import { convertReviewCount } from "../../utils/helper";

const convertDate = (date = '') => {
	return date.split("T")[0]
}

export default function SingleMovie() {
	const [ready, setReady] = useState(false)
	const [movie, setMovie] = useState({})
	const [showRatingModal, setShowRatingModal] = useState(false)
	const [showProfileModal, setShowProfileModal] = useState(false)
	const [selectedProfile, setSelectedProfile] = useState({})

	const { updateNotification } = useNotification()
	const { authInfo } = useAuth()
	const { isLoggedIn } = authInfo

	const navigate = useNavigate()

	const { movieId } = useParams()

	const fetchMovie = async () => {
		const { error, movie } = await getSingleMovie(movieId)
		if (error) updateNotification('error', error)
		setReady(true)
		setMovie(movie)
	}

	const handleOnRateMovie = () => {
		console.log(isLoggedIn)
		if (!isLoggedIn) return navigate('/auth/signin')
		setShowRatingModal(!showRatingModal)
	}
	const handleRatingModal = () => {
		setShowRatingModal(!showRatingModal)
	}

	const handleProfileModal = () => {
		setShowProfileModal(!showProfileModal)
	}

	const handleOnRatingSuccess = (reviews) => {
		setMovie({ ...movie, reviews: { ...reviews } })
	}

	const handleProfileClick = (profile) => {
		setSelectedProfile(profile)
		setShowProfileModal(!showProfileModal)
	}

	useEffect(() => {
		if (movieId)
			fetchMovie()
	}, [movieId])

	if (!ready) {
		return (
			<div className="w-screen h-screen flex justify-center items-center dark:bg-primary bg-white">
				<Loader />
			</div>
		)
	}

	const { id, trailer, poster, title, storyLine, director = {}, writers = [],
		cast = [], language, releaseDate, reviews = {}, genres = [], type } = movie

	return (
		<div className="dark:bg-primary bg-white min-h-screen pb-10">
			<Container className={"xl:px-0 px-2"}>
				<div className="flex items-center justify-center">
					<video width={"80%"} className="" poster={poster} controls src={trailer}></video>
				</div>
				<div className="flex justify-between">
					<h1 className="xl:text-4xl lg:text-3xl text-2xl 
					text-highlight dark:text-highlight-dark font-semibold py-3">
						{title}
					</h1>
					<div className="flex flex-col items-end">
						<RatingStar rating={reviews.ratingAvg} />
						<CustomButtonLink
							label={convertReviewCount(reviews.reviewCount) + " Reviews"}
							onClick={() => navigate('/movie/reviews/' + id)}
						/>
						<CustomButtonLink
							label={"Rate The Movie"}
							onClick={handleOnRateMovie}
						/>
					</div>
				</div>

				<div className="space-y-3">
					<p className="dark:text-dark-subtle text-light-subtle">{storyLine}</p>
					{/* <div className="flex space-x-2 ">
						<p className="dark:text-dark-subtle text-light-subtle font-semibold">Director:</p>
						<p className="dark:text-highlight-dark text-highlight hover:underline cursor-pointer">{director.name}</p>

					</div> */}

					<ListWithLabel label={"Director: "}>
						<CustomButtonLink label={director.name}
							onClick={() => handleProfileClick(director)} />
					</ListWithLabel>

					<ListWithLabel label={"Writers: "}>
						{writers.map(writer => <CustomButtonLink key={writer.id} label={writer.name} />)}
					</ListWithLabel>

					<ListWithLabel label={"Cast: "}>
						{
							cast.map(({ id, profile, leadActor }) => {
								return leadActor ?
									<CustomButtonLink label={profile.name} key={profile.id} /> : null
							})
						}
					</ListWithLabel>

					<ListWithLabel label={"Language: "}>
						<CustomButtonLink label={language} clickable={false} />
					</ListWithLabel>

					<ListWithLabel label={"Release Date: "}>
						<CustomButtonLink label={convertDate(releaseDate)} clickable={false} />
					</ListWithLabel>

					<ListWithLabel label={"Genres: "}>
						{genres.map(genre => <CustomButtonLink key={genre} label={genre} clickable={false} />)}
					</ListWithLabel>

					<ListWithLabel label={"Type: "}>
						<CustomButtonLink label={type} clickable={false} />
					</ListWithLabel>

					<CastProfiles cast={cast} />

					<RelatedMovies movieId={movieId} />
				</div>
			</Container >

			{
				showRatingModal &&
				<AddRatingModal onClose={handleRatingModal} onSuccess={handleOnRatingSuccess} />
			}
			{
				showProfileModal &&
				<ProfileModal onClose={handleProfileModal} profileId={selectedProfile.id} />
			}
		</div >

	)
}

const ListWithLabel = ({ children, label }) => {
	return (
		<div className="flex space-x-2 ">
			<p className="dark:text-dark-subtle text-light-subtle font-semibold">{label}</p>
			{children}
		</div>)
}

const CastProfiles = ({ cast }) => {
	return (
		<div className="">
			<h1 className="dark:text-dark-subtle text-light-subtle font-semibold text-2xl mb-2">Cast: </h1>
			<div className="flex flex-wrap space-x-4">
				{cast.map(({ id, profile, roleAs }) => {
					return (
						<div key={profile.id} className="basis-28 flex flex-col items-center text-center mb-4">
							<img className="w-24 h-24 aspect-square object-cover rounded-full" src={profile.avatar} alt="" />
							{/* <p className="dark:text-highlight-dark text-highlight hover:underline cursor-pointer">
								{c.profile.name}
							</p> */}
							<CustomButtonLink label={profile.name} />
							<span className="dark:text-dark-subtle text-light-subtle font-semibold text-sm">as</span>
							<p className="dark:text-dark-subtle text-light-subtle font-semibold">{roleAs}</p>
						</div>
					)
				})}
			</div>
		</div>
	)
}