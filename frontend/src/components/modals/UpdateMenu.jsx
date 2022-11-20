import React, { useState } from 'react'
import { updateActor } from '../../api/actor'
import { updateMenuItem } from '../../api/menu'
import { useNotification } from '../../hooks'
import { commonModalTitleClasses } from '../../utils/theme'
import MenuForm from '../form/MenuForm'
import Modal from './Modal'

export default function UpdateMenu({ onClose, onSuccess, initialState }) {
    const { updateNotification } = useNotification()
    const [busy, setBusy] = useState(false)
    const handleSubmit = async (data) => {
        setBusy(true)
        const { error, item } = await updateMenuItem(initialState.id, data)
        setBusy(false)
        if (error) return updateNotification('error', error)
        onSuccess(item)
        updateNotification('success', 'Menu item updated successfully!')
        onClose()
    }
    return (
        <Modal onClose={onClose} style=" top-[25vh]" title='Menu Form'>
            <div className='w-full p-5'>
                <MenuForm
                    busy={busy}
                    initialState={initialState}
                    onSubmit={!busy ? handleSubmit : null}
                    title={"Update Menu item"}
                    btnTitle={"Update"}
                />
            </div>
        </Modal >
    )
}
