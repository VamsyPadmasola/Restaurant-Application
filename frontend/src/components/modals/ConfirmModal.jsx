import React from 'react'
import { ImSpinner3 } from 'react-icons/im'
import Modal from './Modal'
import { SecondaryModal } from './PopupModal'

export default function ConfirmModal({ busy, onConfirm, onCancel, title, subtitle }) {
    const commonClass = "px-3 py-1 text-white rounded mt-3"
    return (
        <SecondaryModal
            width='w-20rem '
            style=" top-[40vh] left-[70vh]"
            title='Delete Actor'
            hideClose={true}>
            <div className='dark:bg-primary bg-white rounded p-1'>
                <h1 className='text-red-400 font-semibold text-lg'>{title}</h1>
                <p className='dark:text-white text-primary text-sm'>
                    {subtitle}</p>
                <div className='flex items-center justify-between'>
                    {busy
                        ?
                        <p className='dark:text-white text-primary flex items-center space-x-2 mt-3'>
                            <ImSpinner3 className="animate-spin" />
                            <span>Please wait</span>
                        </p>
                        :
                        <>
                            <button onClick={onConfirm} type='button' className={commonClass + " bg-red-btn"} >
                                Confirm
                            </button>
                            <button onClick={onCancel} type='button' className={commonClass + " bg-blue-btn"}>
                                Cancel
                            </button>
                        </>
                    }

                </div>
            </div>
        </SecondaryModal >
    )
}
