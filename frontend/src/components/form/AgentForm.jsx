import React, { useEffect, useState } from 'react'
import { ImSpinner3 } from 'react-icons/im'
import { useNotification } from '../../hooks'
import { commonInputClasses, commonModalButtonClasses } from '../../utils/theme'
import Selector from './Selector'

const defaultAgentInfo = {
    name: '',
    contact: '',
    gender: ''
}

const genderOptions = [
    { title: "Male", value: "male" },
    { title: "Female", value: "female" },
    { title: "Other", value: "other" },
]

const validateAgent = (agent) => {
    const { name, contact, gender } = agent;

    if (!name.trim()) return { error: 'Delivery Agent name is missing!' }
    if (!contact) return { error: 'Delivery Agent contact is missing!' }
    if (contact.length < 10) return { error: 'invalid Contact' }
    if (!gender.trim()) return { error: 'gender is missing!' }

    return { error: null }
}
export default function AgentForm({ title, btnTitle, busy, onSubmit, initialState }) {
    const [agentInfo, setAgentInfo] = useState({ ...defaultAgentInfo })

    const handleChange = ({ target }) => {
        const { value, name } = target;
        setAgentInfo({ ...agentInfo, [name]: value })
    }

    const { name, contact, gender } = agentInfo;

    const { updateNotification } = useNotification()

    const handleSubmit = (e) => {
        e.preventDefault();
        const { error } = validateAgent(agentInfo)
        if (error) return updateNotification('error', error)
        // const formData = new FormData()
        // for (let key in chefInfo) {
        //     if (key) formData.append(key, chefInfo[key])
        // }
        onSubmit(agentInfo)
    }

    useEffect(() => {
        if (initialState) {
            setAgentInfo({ ...initialState });
        }
    }, [initialState])
    return (
        <form onSubmit={handleSubmit}>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='font-semibold text-xl text-primary'>{title}</h1>
            </div>
            <div className='flex space-x-4 rounded'>
                <div className='flex-grow flex flex-col space-y-8'>
                    <input placeholder='Enter Agent Name'
                        name='name' type='text'
                        className={commonInputClasses + ' border-b-2 '}
                        value={name}
                        onChange={handleChange}
                        autoComplete="off"
                        spellCheck="false" />
                    <input placeholder='Enter Contact Number'
                        name='contact' type='number'
                        className={commonInputClasses + ' border-b-2 '}
                        value={contact}
                        onChange={handleChange}
                        autoComplete="off"
                        spellCheck="false" />

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
