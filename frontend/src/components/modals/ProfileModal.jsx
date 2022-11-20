import React, { useEffect, useState } from 'react'
import { getActorProfile } from '../../api/actor'
import { useNotification } from '../../hooks'
import { SecondaryModal } from './PopupModal'

export default function ProfileModal({ profileId, onClose }) {
    console.log(profileId)
    const [profile, setProfile] = useState({})
    const { updateNotification } = useNotification()

    const fetchActorProfile = async (profileId) => {
        const { error, actor } = await getActorProfile(profileId)
        if (error) return updateNotification('error', error)
        setProfile(actor)
    }

    useEffect(() => {
        if (profileId)
            fetchActorProfile(profileId)
    }, [profileId])

    const { avatar, name, about } = profile

    return (
        <SecondaryModal width='w-[25rem] ' style=' left-[40%] ' onClose={onClose}>
            <div className='p-2 flex flex-col items-center rounded bg-white dark:bg-primary space-y-3'>
                <img className='w-28 h-28 rounded-full' src={avatar} alt={name} />
                <h1 className='dark:text-white text-primary font-semibold'>{name}</h1>
                <p className='dark:text-dark-subtle text-light-subtle font-semibold'>{about}</p>
            </div>
        </SecondaryModal>
    )
}
