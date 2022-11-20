import React, { useState } from 'react'
import { createActor } from '../../api/actor'
import { createChef } from '../../api/chef'
import { createMenuItem } from '../../api/menu'
import { useNotification } from '../../hooks'
import { commonModalTitleClasses } from '../../utils/theme'
import MovieForm from '../admin/MovieForm'
import ActorForm from '../form/ActorForm'
import ChefForm from '../form/ChefForm'
import MenuForm from '../form/MenuForm'
import Modal from '../modals/Modal'

export default function ChefUpload({ onClose }) {

    const { updateNotification } = useNotification()
    const [busy, setBusy] = useState(false)
    const handleSubmit = async (data) => {
        setBusy(true)
        const { error, chef } = await createChef(data)
        setBusy(false)
        if (error) return updateNotification('error', error)

        console.log(chef)

        updateNotification('success', 'Chef added successfully!')
        onClose()
    }
    return (
        <Modal onClose={onClose} style=" top-[25vh]" title='Chef Form'>
            <div className='w-full p-5'>
                <ChefForm busy={busy} onSubmit={!busy ? handleSubmit : null
                } title={"Add New Chef"} btnTitle={"Add"} />
            </div>
        </Modal >
    )
}
