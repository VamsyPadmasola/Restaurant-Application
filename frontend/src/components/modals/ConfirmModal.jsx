import React from 'react'
import { ImSpinner3 } from 'react-icons/im'
import Modal from './Modal'
import { SecondaryModal } from './PopupModal'

export default function ConfirmModal({ busy, onConfirm, onCancel, title, subtitle }) {
    const commonClass = "px-3 py-1 text-white rounded mt-3"
    return (
        <SecondaryModal
            width='w-20rem '
            style=" top-[40vh] left-[70vh] bg-primary"
            title='Delete Actor'
            hideClose={true}>
            <div className=' bg-primary rounded p-1'>
                <h1 className='text-failure font-semibold text-lg'>{title}</h1>
                <p className='text-black text-sm'>
                    {subtitle}</p>
                <div className='flex items-center justify-between'>
                    {busy
                        ?
                        <p className='text-black flex items-center space-x-2 mt-3'>
                            <ImSpinner3 className="animate-spin" color='#000000' />
                            <span>Please wait</span>
                        </p>
                        :
                        <>
                            <button onClick={onConfirm} type='button' className={commonClass + " bg-failure"} >
                                Confirm
                            </button>
                            <button onClick={onCancel} type='button' className={commonClass + " bg-success"}>
                                Cancel
                            </button>
                        </>
                    }

                </div>
            </div>
        </SecondaryModal >
    )
}
