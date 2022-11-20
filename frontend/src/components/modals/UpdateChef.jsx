import React, { useState } from 'react'
import { updateActor } from '../../api/actor'
import { updateChef } from '../../api/chef'
import { updateMenuItem } from '../../api/menu'
import { useNotification } from '../../hooks'
import { commonModalTitleClasses } from '../../utils/theme'
import ChefForm from '../form/ChefForm'
import MenuForm from '../form/MenuForm'
import Modal from './Modal'

export default function UpdateChef({ onClose, onSuccess, initialState }) {
    const { updateNotification } = useNotification()
    const [busy, setBusy] = useState(false)
    const handleSubmit = async (data) => {
        setBusy(true)
        const { error, chef } = await updateChef(initialState.id, data)
        setBusy(false)
        if (error) return updateNotification('error', error)
        onSuccess(chef)
        updateNotification('success', 'Profile updated successfully!')
        onClose()
    }
    return (
        <Modal onClose={onClose} style=" top-[25vh]" title='Menu Form'>
            <div className='w-full p-5'>
                <ChefForm
                    busy={busy}
                    initialState={initialState}
                    onSubmit={!busy ? handleSubmit : null}
                    title={"Update Chef"}
                    btnTitle={"Update"}
                />
            </div>
        </Modal >
    )
}
