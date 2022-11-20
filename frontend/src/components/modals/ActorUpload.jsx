import React, { useState } from 'react'
import { createActor } from '../../api/actor'
import { createMenuItem } from '../../api/menu'
import { useNotification } from '../../hooks'
import { commonModalTitleClasses } from '../../utils/theme'
import MovieForm from '../admin/MovieForm'
import ActorForm from '../form/ActorForm'
import MenuForm from '../form/MenuForm'
import Modal from '../modals/Modal'

export default function ActorUpload({ onClose }) {

    const { updateNotification } = useNotification()
    const [busy, setBusy] = useState(false)
    const handleSubmit = async (data) => {
        setBusy(true)
        const { error, menu } = await createMenuItem(data)
        setBusy(false)
        if (error) return updateNotification('error', error)

        console.log(menu)

        updateNotification('success', 'Menu Item added successfully!')
        onClose()
    }
    return (
        <Modal onClose={onClose} style=" top-[25vh]" title='Menu Form'>
            <div className='w-full p-5'>
                < MenuForm busy={busy} onSubmit={!busy ? handleSubmit : null
                } title={"Add New Menu Item"} btnTitle={"Add"} />
            </div>
        </Modal >
    )
}
