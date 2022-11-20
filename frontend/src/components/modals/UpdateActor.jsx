import React, { useState } from 'react'
import { updateActor } from '../../api/actor'
import { useNotification } from '../../hooks'
import { commonModalTitleClasses } from '../../utils/theme'
import ActorForm from '../form/ActorForm'
import Modal from './Modal'

export default function UpdateActor({ onClose, onSuccess, initialState }) {
    const { updateNotification } = useNotification()
    const [busy, setBusy] = useState(false)
    const handleSubmit = async (data) => {
        setBusy(true)
        const { error, actor } = await updateActor(initialState.id, data)
        setBusy(false)
        if (error) return updateNotification('error', error)
        onSuccess(actor)
        updateNotification('success', 'Actor updated successfully!')
        onClose()
    }
    return (
        <Modal onClose={onClose} style=" top-[25vh]" title='Actor Form'>
            <div className='w-full p-5'>
                <ActorForm
                    busy={busy}
                    initialState={initialState}
                    onSubmit={!busy ? handleSubmit : null}
                    title={"Update Actor"}
                    btnTitle={"Update"}
                />
            </div>
        </Modal >
    )
}
