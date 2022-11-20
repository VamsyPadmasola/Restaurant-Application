import React, { useState } from 'react'
import { searchActor } from '../../api/actor'
import { useNotification, useSearch } from '../../hooks'
import { renderItem } from '../../utils/helper'
import { commonInputClasses, commonModalButtonClasses } from '../../utils/theme'
import LiveSearch from '../LiveSearch'

// const cast = [{actor : "id", roleAs : ,leadActor :}]

const defaultCastInfo = {
    profile: {},
    roleAs: '',
    leadActor: false
}

export default function CastForm({ onSubmit }) {
    const [castInfo, setCastInfo] = useState({ ...defaultCastInfo })
    const { leadActor, profile, roleAs } = castInfo
    const { updateNotification } = useNotification()
    const { handleSearch, resetSearch } = useSearch()
    const [profiles, setProfiles] = useState([])

    const handleOnChange = ({ target }) => {
        const { checked, name, value } = target

        if (name === 'leadActor') {
            return setCastInfo({ ...castInfo, leadActor: checked })
        }

        setCastInfo({ ...castInfo, [name]: value })
    }

    const handleProfileSelect = (profile) => {
        setCastInfo({ ...castInfo, profile })
    }

    const handleSubmit = () => {
        const { profile, roleAs } = castInfo
        if (!profile.name) return updateNotification('error', 'Cast Profile is missing!')
        if (!roleAs.trim()) return updateNotification('error', 'Cast role is missing!')

        onSubmit(castInfo);
        setCastInfo({ ...defaultCastInfo, profile: { name: '' } })
        resetSearch()
        setProfiles([])
    }

    const handleProfileChange = ({ target }) => {
        const { value } = target
        const { profile } = castInfo
        profile.name = value
        setCastInfo({ ...castInfo, ...profile })
        handleSearch(searchActor, value, setProfiles)
    }

    return (
        <div className='flex items-center space-x-2'>
            <input
                type="checkbox"
                name="leadActor"
                id="leadActor"
                className='w-4 h-4'
                defaultChecked={leadActor}
                onChange={handleOnChange}
                title="Set as lead actor"
            />

            <LiveSearch
                placeholder='Search Profile...'
                value={profile.name}
                results={profiles}
                onSelect={handleProfileSelect}
                renderItem={renderItem}
                onChange={handleProfileChange} />
            <span className='text-ternary font-semibold'>as</span>

            <div className="flex-grow">
                <input placeholder='Role as'
                    name='roleAs' id='roleAs'
                    type="text" value={roleAs}
                    onChange={handleOnChange}
                    className={commonInputClasses + " rounded p-1 text-lg border-2"} />
            </div>

            <button
                onClick={handleSubmit}
                type='button'
                className={commonModalButtonClasses}>Add</button>
        </div>
    )
}
