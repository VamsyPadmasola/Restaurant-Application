import React, { useState } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { addReview } from '../../api/review'
import { useNotification } from '../../hooks'
import RatingForm from '../form/RatingForm'
import { SecondaryModal } from './PopupModal'

export default function AddRatingModal({ onSubmit, onClose, onSuccess }) {

    const { movieId } = useParams()
    const { updateNotification } = useNotification()

    const handleSubmit = async (data) => {
        const { error, message, reviews } = await addReview(movieId, data)
        if (error) return updateNotification('error', error)

        updateNotification('success', 'Review added successfully!')
        onSuccess(reviews)
        onClose()
    }
    return (
        <SecondaryModal
            width='w-20rem '
            style=" top-[40%] left-[40%]"
            onClose={onClose}>
            <RatingForm onSubmit={handleSubmit} />
        </SecondaryModal>
    )
}
