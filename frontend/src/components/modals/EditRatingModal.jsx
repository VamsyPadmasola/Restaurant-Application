import React, { useState } from 'react'
import { updateReview } from '../../api/review'
import { useNotification } from '../../hooks'
import RatingForm from '../form/RatingForm'
import { SecondaryModal } from './PopupModal'

export default function EditRatingModal({ onSubmit, initalState, onClose, onSuccess }) {
    const [busy, setBusy] = useState(false)
    const { updateNotification } = useNotification()

    const handleSubmit = async (data) => {
        setBusy(true)
        const { error, message } = await updateReview(initalState.id, data)
        setBusy(false)
        if (error) return updateNotification('error', error)

        onSuccess({ ...data })
        updateNotification('success', message)
        onClose()
    }
    return (
        <SecondaryModal
            width='w-20rem '
            style=" top-[40%] left-[40%]"
            onClose={onClose}>
            <RatingForm busy={busy} initialState={initalState} onSubmit={handleSubmit} />
        </SecondaryModal>
    )
}
