import React, { useEffect, useState } from 'react'
import { ImSpinner3 } from 'react-icons/im'
import { useNotification } from '../../hooks'
import { commonInputClasses, commonModalButtonClasses } from '../../utils/theme'
import Selector from './Selector'

const defaultChefInfo = {
    name: '',
    about: '',
    gender: ''
}

const genderOptions = [
    { title: "Male", value: "male" },
    { title: "Female", value: "female" },
    { title: "Other", value: "other" },
]

const validateChef = (chef) => {
    const { name, about, gender } = chef;

    if (!name.trim()) return { error: 'Chef name is missing!' }
    if (!about.trim()) return { error: 'Chef description is missing!' }
    if (!gender.trim()) return { error: 'Item type is missing!' }

    return { error: null }
}
export default function ChefForm({ title, btnTitle, busy, onSubmit, initialState }) {
    const [chefInfo, setChefInfo] = useState({ ...defaultChefInfo })

    const handleChange = ({ target }) => {
        const { value, name } = target;
        setChefInfo({ ...chefInfo, [name]: value })
    }

    const { name, about, gender } = chefInfo;

    const { updateNotification } = useNotification()

    const handleSubmit = (e) => {
        e.preventDefault();
        const { error } = validateChef(chefInfo)
        if (error) return updateNotification('error', error)
        console.log(chefInfo)
        // const formData = new FormData()
        // for (let key in chefInfo) {
        //     if (key) formData.append(key, chefInfo[key])
        // }
        onSubmit(chefInfo)
    }

    useEffect(() => {
        if (initialState) {
            setChefInfo({ ...initialState });
        }
    }, [initialState])
    return (
        <form onSubmit={handleSubmit}>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='font-semibold text-xl text-primary'>{title}</h1>
            </div>
            <div className='flex space-x-4 rounded'>
                <div className='flex-grow flex flex-col space-y-8'>
                    <input placeholder='Enter Chef Name'
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
                    <div className='flex items-center justify-between'>
                        <Selector options={genderOptions} label='Gender' onChange={handleChange}
                            name='gender' value={gender} />
                    </div>
                </div>
            </div>

            <div className='mt-5 flex justify-end items-end'>
                <button type='submit' className={commonModalButtonClasses + ' w-36 h-8 flex items-center justify-center '}>
                    {busy ? <ImSpinner3 size={20} className="animate-spin" /> : btnTitle}
                </button>
            </div>
        </form>
    )
}
