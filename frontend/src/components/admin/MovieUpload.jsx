import React, { useState } from 'react'
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { uploadMovie, uploadTrailer } from '../../api/movie';
import { useNotification } from '../../hooks';
import { commonModalTitleClasses } from '../../utils/theme';
import Modal from '../modals/Modal';
import MovieForm from './MovieForm';

export default function MovieUpload({ onClose }) {

    const [videoSelected, setVideoSelected] = useState(false);
    const [videoUploaded, setVideoUploaded] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoInfo, setVideoInfo] = useState({})
    const [busy, setBusy] = useState(false)

    const { updateNotification } = useNotification()

    const resetState = () => {
        setVideoSelected(false)
        setVideoUploaded(false)
        setUploadProgress(0)
        setVideoInfo({})
    }

    const handleTypeError = (error) => {
        updateNotification('error', error)
        console.log(error)
    }

    const handleUploadTrailer = async (data) => {
        const { error, url, public_id } = await uploadTrailer(data, setUploadProgress)
        if (error) return updateNotification('error', error)
        setVideoUploaded(true)

        setVideoInfo({
            url,
            public_id
        })

    }
    const handleChange = (file) => {
        const formData = new FormData();
        formData.append('video', file);
        setVideoSelected(true)
        handleUploadTrailer(formData);
    }
    const getUploadProgressValue = () => {
        if (!videoUploaded && uploadProgress >= 100) {
            return 'Processing...'
        }
        return `Trailer Upload Progress ${uploadProgress}%`
    }

    const handleSubmit = async (data) => {
        if (!videoInfo.url || !videoInfo.public_id)
            return updateNotification('error', 'Trailer is missing!')
        setBusy(true)
        data.append('trailer', JSON.stringify(videoInfo))
        const { error, movie } = await uploadMovie(data)
        setBusy(false)
        if (error) return updateNotification('error', error)
        updateNotification('success', 'Movie uploaded successfully!')
        resetState()
        onClose()
    }

    return (
        <>
            {/* <div className='fixed inset-0 bg-primary bg-opacity-50 backdrop-blur-sm
         flex items-center justify-center'>
                <div className='dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto p-2 custom-scroll-bar'>                    <MovieForm />
                </div>
            </div> */}
            {
                <Modal onClose={onClose} title='Movie Form'>
                    <div className='p-4'>
                        <UploadProgress
                            visible={!videoUploaded && videoSelected}
                            message={getUploadProgressValue()}
                            width={uploadProgress} />
                        {
                            !videoSelected
                                ?
                                <TrailerSelector
                                    visible={!videoSelected}
                                    onTypeError={handleTypeError}
                                    handleChange={handleChange} />
                                :
                                <div className='w-full'>
                                    <MovieForm btnTitle="Upload" busy={busy} onSubmit={!busy ? handleSubmit : null} />
                                </div>
                        }
                    </div>
                </Modal>
            }
        </>
    )

}

const TrailerSelector = ({ visible, handleChange, onTypeError }) => {
    if (!visible) return null;
    return (

        <div className='h-full flex items-center justify-center'>
            <FileUploader handleChange={handleChange} onTypeError={onTypeError} types={['mp4', 'avi']}>
                <label className='w-48 h-48 border border-dashed border-grey-subtle rounded-full
                flex flex-col items-center justify-center text-grey-subtle cursor-pointer'>
                    <AiOutlineCloudUpload size={80} />
                    <p>Drop your file here!</p>
                </label>
            </FileUploader>
        </div>
    )
}

const UploadProgress = ({ width, message, visible }) => {
    if (!visible)
        return null;
    return (
        <div className='dark:bg-light-subtle bg-dark-subtle drop-shadow-lg rounded mb-5 p-3'>
            <div className='relative h-3 bg-grey-subtle overflow-hidden'>
                <div style={{ width: width + "%" }} className='h-full absolute left-0 bg-secondary' />
            </div>
            <p className='font-semibold dark:text-white text-light-subtle animate-pulse mt-1'>{message}</p>

        </div>
    )
}
