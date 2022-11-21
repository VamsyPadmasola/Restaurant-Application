import React, { useState } from 'react'
import { updateActor } from '../../api/actor'
import { updateChef } from '../../api/chef'
import { updateDelivery } from '../../api/delivery'
import { updateMenuItem } from '../../api/menu'
import { useNotification } from '../../hooks'
import { commonModalTitleClasses } from '../../utils/theme'
import AgentForm from '../form/AgentForm'
import ChefForm from '../form/ChefForm'
import MenuForm from '../form/MenuForm'
import Modal from './Modal'

export default function UpdateAgent({ onClose, onSuccess, initialState }) {
    const { updateNotification } = useNotification()
    const [busy, setBusy] = useState(false)
    const handleSubmit = async (data) => {
        setBusy(true)
        const { error, delivery } = await updateDelivery(initialState.id, data)
        setBusy(false)
        if (error) return updateNotification('error', error)
        onSuccess(delivery)
        updateNotification('success', 'Profile updated successfully!')
        onClose()
    }
    return (
        <Modal onClose={onClose} style=" top-[25vh]" title='Update Agent Form'>
            <div className='w-full p-5'>
                <AgentForm
                    busy={busy}
                    initialState={initialState}
                    onSubmit={!busy ? handleSubmit : null}
                    title={"Update Agent"}
                    btnTitle={"Update"}
                />
            </div>
        </Modal >
    )
}
