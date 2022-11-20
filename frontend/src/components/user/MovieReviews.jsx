import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { deleteReview, getReviewsByMovie } from '../../api/review'
import { useAuth, useNotification } from '../../hooks'
import Container from '../Container'
import CustomButtonLink from '../ui/CustomButtonLink'
import RatingStar from './RatingStar'
import ReactReadMoreReadLess from "react-read-more-read-less";
import { MdModeEditOutline } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import ConfirmModal from '../modals/ConfirmModal'
import NotFound from '../ui/NotFound'
import EditRatingModal from '../modals/EditRatingModal'

export default function MovieReviews() {
    const [reviews, setReviews] = useState([])
    const [movieTitle, setMovieTitle] = useState('')
    const [profileOwnersReview, setProfileOwnersReview] = useState(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showEditRatingModal, setShowEditRatingModal] = useState(false)
    const [selectedReview, setSelectedReview] = useState(false)

    const { movieId } = useParams()
    const { updateNotification } = useNotification()
    const { authInfo } = useAuth()
    const profileId = authInfo.profile?.id

    const fetchReviews = async (movieId) => {
        const { error, movie } = await getReviewsByMovie(movieId)
        console.log(movie)
        if (error)
            return updateNotification('error', error)
        setReviews([...movie.reviews])
        setMovieTitle(movie.title)

        console.log(reviews)
    }

    const findProfileOwnersReview = async () => {
        if (profileOwnersReview) return setProfileOwnersReview(null)
        const matched = reviews.find(review => review.owner.id === profileId)
        if (!matched)
            return updateNotification('error', "You don't have any review!")
        setProfileOwnersReview(matched)
    }

    const hideConfirmModal = () => {
        setShowConfirmModal(false)
    }

    const hideEditRatingModal = () => {
        setShowEditRatingModal(false)
        setSelectedReview(null)
    }

    const handleOnEdit = () => {
        setSelectedReview({
            id: profileOwnersReview.id,
            content: profileOwnersReview.content,
            rating: profileOwnersReview.rating
        })
        setShowEditRatingModal(!showEditRatingModal)
    }

    const handleOnDeleteConfirm = async () => {
        const { error, message } = await deleteReview(profileOwnersReview.id)
        if (error)
            return updateNotification('error', error)
        updateNotification('success', message)

        const updatedReviews = reviews.filter((r) => r.id !== profileOwnersReview.id);
        setReviews([...updatedReviews])
        setProfileOwnersReview(null)
        hideConfirmModal()
    }

    const handleOnReviewUpdate = (review) => {
        const updatedReview = {
            ...profileOwnersReview,
            rating: review.rating,
            content: review.content
        }

        setProfileOwnersReview({ ...updatedReview })

        const newReviews = reviews.map((review) => {
            if (review.id === updatedReview.id)
                return updatedReview
            return review
        })

        setReviews([...newReviews])
    }

    useEffect(() => {
        if (movieId)
            fetchReviews(movieId)
    }, [movieId])
    return (
        <div className="dark:bg-primary bg-white min-h-screen pb-10">
            <Container className={"xl:px-0 px-2 py-8"}>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-semibold dark:text-white text-primary'>
                        <span className='text-light-subtle dark:text-dark-subtle'>Reviews for:</span>
                        {" "}
                        {movieTitle}
                    </h1>
                    <CustomButtonLink label={profileOwnersReview ? 'View All' : "Find My Review"}
                        onClick={findProfileOwnersReview} />
                </div>
                <NotFound text={"No Reviews found!"} visible={!reviews.length} />
                {
                    profileOwnersReview
                        ? (
                            <div>
                                <ReviewCard review={profileOwnersReview} />
                                <div className='flex space-x-5 dark:text-white text-primary text-xl p-3'>
                                    <button type='button'
                                        className='bg-orange-btn p-2 rounded-full hover:opacity-70 transition'
                                        onClick={handleOnEdit}
                                    >
                                        <MdModeEditOutline /> </button>
                                    <button type='button'
                                        className='bg-red-btn p-2 rounded-full hover:opacity-70 transition'
                                        onClick={() => setShowConfirmModal(!showConfirmModal)} >
                                        <AiFillDelete />
                                    </button>
                                </div>
                            </div>
                        )
                        : (
                            <div className='space-y-3 mt-3'>
                                {
                                    reviews.map(review => (
                                        <ReviewCard review={review} key={review.id} />
                                    ))
                                }
                            </div>
                        )
                }
            </Container>
            {
                showConfirmModal &&
                <ConfirmModal
                    title={"Are you sure?"}
                    subtitle={"This action will delete this review permanently!"}
                    onCancel={hideConfirmModal}
                    onConfirm={handleOnDeleteConfirm}
                />
            }
            {
                showEditRatingModal &&
                <EditRatingModal
                    onClose={hideEditRatingModal}
                    initalState={selectedReview}
                    onSuccess={handleOnReviewUpdate}
                />
            }
        </div>

    )
}

const ReviewCard = ({ review }) => {
    if (!review) return null;
    console.log(review)

    const { owner, content, rating } = review;

    const getNameInitial = (name = '') => {
        return name[0].toUpperCase()
    }
    return (
        <div className='space-x-3'>
            <div className='flex space-x-3 items-start justify-start'>
                <div>
                    <div className='flex w-14 h-14 items-center justify-center
                    rounded-full bg-light-subtle dark:bg-dark-subtle text-white select-none'>
                        {getNameInitial(owner.name)}
                    </div>
                </div>
                <div className='flex flex-col'>
                    <h1 className='dark:text-white text-primary text-lg font-semibold'>{owner.name}</h1>
                    <RatingStar rating={rating} />
                    <p className='text-light-subtle dark:text-dark-subtle'>
                        <ReactReadMoreReadLess
                            charLimit={300}
                            readMoreText={"Read more"}
                            readLessText={"Read less"}
                            className='text-light-subtle dark:text-dark-subtle'
                            readMoreClassName="text-[#0645AD] hover:underline"
                            readLessClassName="text-[#0645AD] hover:underline"
                        >
                            {content}
                        </ReactReadMoreReadLess>
                    </p>



                </div>
            </div>
            <div className='pl-12'>
            </div>
        </div>
    )
}