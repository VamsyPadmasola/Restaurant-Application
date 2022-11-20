import React, { useEffect, useState } from 'react'
import { ImSpinner3 } from 'react-icons/im'
import { useNotification } from '../../hooks'
import { commonInputClasses, commonModalButtonClasses } from '../../utils/theme'
import PosterSelector from './PosterSelector'
import Selector from './Selector'

const defaultMenuInfo = {
    name: '',
    description: '',
    type: '',
    price: null,
    image: ''
}

const typeOptions = [
    { title: "Starter", value: "starter" },
    { title: "Main Course", value: "maincourse" },
    { title: "Desert", value: "desert" },
    { title: "Drinks", value: "drinks" },
]

const validateMenu = (menu) => {
    const { name, description, image, price, type } = menu;

    if (!name.trim()) return { error: 'Item name is missing!' }
    if (!description.trim()) return { error: 'Item description is missing!' }
    if (!type.trim()) return { error: 'Item type is missing!' }
    if (!price.trim()) return { error: 'Item price is missing!' }

    if (image && !image.type?.startsWith('image'))
        return { error: 'Invalid image file!' }

    return { error: null }
}
export default function MenuForm({ title, btnTitle, busy, onSubmit, initialState }) {
    const [menuInfo, setMenuInfo] = useState({ ...defaultMenuInfo })
    const [selectedAvatarForUI, setSelectedAvatarForUI] = useState('')

    const updatePosterForUI = (file) => {
        const url = URL.createObjectURL(file)
        setSelectedAvatarForUI(url);
    }

    const handleChange = ({ target }) => {
        const { value, files, name } = target;

        if (name === 'image') {
            const file = files[0]
            updatePosterForUI(file)
            return setMenuInfo({ ...menuInfo, image: file })

        }

        setMenuInfo({ ...menuInfo, [name]: value })
    }



    const { name, description, type, price } = menuInfo;

    const { updateNotification } = useNotification()

    const handleSubmit = (e) => {
        e.preventDefault();
        const { error } = validateMenu(menuInfo)
        if (error) return updateNotification('error', error)

        const formData = new FormData()
        for (let key in menuInfo) {
            if (key) formData.append(key, menuInfo[key])
        }
        onSubmit(formData)
    }

    useEffect(() => {
        if (initialState) {
            setMenuInfo({ ...initialState, image: null });
            setSelectedAvatarForUI(initialState.image);
        }
    }, [initialState])
    return (
        <form onSubmit={handleSubmit}>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='font-semibold text-xl text-primary'>{title}</h1>
            </div>
            <div className='flex space-x-4 rounded'>
                <PosterSelector selectedPoster={selectedAvatarForUI} name={"image"}
                    className={'w-36 h-36 aspect-square object-cover'}
                    onChange={handleChange} label="Select Avatar" />
                <div className='flex-grow flex flex-col space-y-8'>
                    <input placeholder='Enter Item Name'
                        name='name' type='text'
                        className={commonInputClasses + ' border-b-2 '}
                        value={name}
                        onChange={handleChange}
                        autoComplete="off"
                        spellCheck="false" />
                    <textarea
                        name='description'
                        placeholder='Description'
                        value={description}
                        className={commonInputClasses + ' border-b-2 resize-none h-full custom-scroll-bar '}
                        onChange={handleChange}
                        spellCheck="false" ></textarea>
                    <div className='flex items-center justify-between'>
                        <input placeholder='Enter Item Price'
                            name='price' type='number'
                            className={commonInputClasses + ' border-b-2 w-48'}
                            value={price}
                            onChange={handleChange}
                            autoComplete="off"
                            spellCheck="false" />
                        <Selector options={typeOptions} label='Type' value={type} onChange={handleChange}
                            name='type' />
                    </div>

                </div>
            </div>
            {/* <div className="mt-3">
                <Selector options={typeOptions} label='Type' value={type} onChange={handleChange}
                    name='type' />
            </div> */}
            <div className='mt-5 flex justify-end items-end'>
                <button type='submit' className={commonModalButtonClasses + ' w-36 h-8 flex items-center justify-center '}>

                    {busy ? <ImSpinner3 size={20} className="animate-spin" /> : btnTitle}
                </button>
            </div>
        </form>
    )
}
