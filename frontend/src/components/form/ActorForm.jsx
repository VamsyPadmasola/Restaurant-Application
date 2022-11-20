import React, { useEffect, useState } from 'react'
import { ImSpinner3 } from 'react-icons/im'
import { useNotification } from '../../hooks'
import { commonInputClasses, commonModalButtonClasses } from '../../utils/theme'
import PosterSelector from './PosterSelector'
import Selector from './Selector'

const defaultActorInfo = {
    name: '',
    about: '',
    avatar: null,
    gender: ''
}

const genderOptions = [
    { title: "Male", value: "male" },
    { title: "Female", value: "female" },
    { title: "Other", value: "other" },
]

const validateActor = (actorInfo) => {
    const { name, about, avatar, gender } = actorInfo;

    if (!name.trim()) return { error: 'Actor name is missing!' }
    if (!about.trim()) return { error: 'About field is missing!' }
    if (!gender.trim()) return { error: 'Actor gender is missing!' }

    if (avatar && !avatar.type?.startsWith('image'))
        return { error: 'Invalid image/avatar file!' }

    return { error: null }
}
export default function ActorForm({ title, btnTitle, busy, onSubmit, initialState }) {
    const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo })
    const [selectedAvatarForUI, setSelectedAvatarForUI] = useState('')

    const updatePosterForUI = (file) => {
        const url = URL.createObjectURL(file)
        setSelectedAvatarForUI(url);
    }

    const handleChange = ({ target }) => {
        const { value, files, name } = target;

        if (name === 'avatar') {
            const file = files[0]
            updatePosterForUI(file)
            return setActorInfo({ ...actorInfo, avatar: file })

        }

        setActorInfo({ ...actorInfo, [name]: value })
    }



    const { name, about, gender } = actorInfo;

    const { updateNotification } = useNotification()

    const handleSubmit = (e) => {
        e.preventDefault();
        const { error } = validateActor(actorInfo)
        if (error) return updateNotification('error', error)

        const formData = new FormData()
        for (let key in actorInfo) {
            if (key) formData.append(key, actorInfo[key])
        }
        onSubmit(formData)
    }

    useEffect(() => {
        if (initialState) {
            setActorInfo({ ...initialState, avatar: null });
            setSelectedAvatarForUI(initialState.avatar);
        }
    }, [initialState])
    return (
        <form onSubmit={handleSubmit}>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='font-semibold text-xl dark:text-white text-primary'>{title}</h1>
            </div>
            <div className='flex space-x-4 rounded'>
                <PosterSelector selectedPoster={selectedAvatarForUI} name={"avatar"}
                    className={'w-36 h-36 aspect-square object-cover'}
                    onChange={handleChange} label="Select Avatar" />
                <div className='flex-grow flex flex-col space-y-2'>
                    <input placeholder='Enter Name'
                        name='name' type='text'
                        className={commonInputClasses + ' border-b-2 '}
                        value={name}
                        onChange={handleChange}
                        autoComplete="off"
                        spellCheck="false" />
                    <textarea
                        name='about'
                        placeholder='About'
                        value={about}
                        className={commonInputClasses + ' border-b-2 resize-none h-full custom-scroll-bar '}
                        onChange={handleChange}
                        spellCheck="false" ></textarea>
                </div>
            </div>
            <div className="mt-3">
                <Selector options={genderOptions} label='Gender' value={gender} onChange={handleChange}
                    name='gender' />
            </div>
            <div className='mt-3 flex justify-end items-end'>
                <button type='submit' className={commonModalButtonClasses + ' w-36 h-8 flex items-center justify-center '}>

                    {busy ? <ImSpinner3 size={20} className="animate-spin" /> : btnTitle}
                </button>
            </div>
        </form>
    )
}
