import React, { useState } from 'react'
import { createActor } from '../../api/actor'
import { createChef } from '../../api/chef'
import { createDelivery } from '../../api/delivery'
import { createMenuItem } from '../../api/menu'
import { useNotification } from '../../hooks'
import { commonModalTitleClasses } from '../../utils/theme'
import MovieForm from '../admin/MovieForm'
import ActorForm from '../form/ActorForm'
import AgentForm from '../form/AgentForm'
import ChefForm from '../form/ChefForm'
import MenuForm from '../form/MenuForm'
import Modal from '../modals/Modal'

export default function AgentUpload({ onClose }) {

    const { updateNotification } = useNotification()
    const [busy, setBusy] = useState(false)
    const handleSubmit = async (data) => {
        setBusy(true)
        const { error, delivery } = await createDelivery(data)
        setBusy(false)
        if (error) return updateNotification('error', error)

        updateNotification('success', 'Delivery Agent added successfully!')
        onClose()
    }
    return (
        <Modal onClose={onClose} style=" top-[25vh]" title='Delivery Agent Form'>
            <div className='w-full p-5'>
                <AgentForm busy={busy} onSubmit={!busy ? handleSubmit : null
                } title={"Add New Agent"} btnTitle={"Add"} />
            </div>
        </Modal >
    )
}
