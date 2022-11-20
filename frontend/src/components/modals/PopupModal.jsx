import React, { useState } from 'react'
import { useNotification } from '../../hooks'
import ReactDom from "react-dom"
import { commonModalButtonClasses, commonModalTitleClasses } from '../../utils/theme'
import genres from '../../utils/genres'
import Submit from '../form/Submit'
import { useEffect } from 'react'

export const Backdrop = props => {
    const handleClick = () => {
        if (props.onClose) {
            props.onClose();
        }
    }
    return (
        <div onClick={handleClick} className="second-modal-overlay"></div>
    )
}

export const SecondaryModal = ({ onClose, children, width = "w-[35rem] ", style = '', hideClose = false }) => {
    return (
        <>
            {
                ReactDom.createPortal(
                    <>
                        <Backdrop onClose={onClose} />
                        <div className={width + "second-modal dark:bg-primary bg-white" + style}>
                            {
                                !hideClose &&
                                <div className="float-right">
                                    <button type="close" className="dark:text-white text-primary text-xl" onClick={onClose}>X</button>
                                </div>
                            }
                            <div className="content overflow-auto custom-scroll-bar">{children}</div>
                        </div>

                    </>,
                    document.getElementById("second-modal-root")
                )
            }
        </>
    )
}

export default function WritersPopupModal({ profiles = [], handleModal, onRemove }) {
    const { updateNotification } = useNotification()
    return (
        <SecondaryModal onClose={handleModal}>
            {
                <div>
                    <h1 className={commonModalTitleClasses}>Writers</h1>
                    <div className='w-full max-h-96 overflow-auto pr-3 custom-scroll-bar'>
                        {
                            (profiles.length)
                                ?
                                profiles.map(({ id, name, avatar }) => {
                                    return (
                                        <div key={id} className='flex mt-4 space-x-3'>
                                            <div className="img-wrap">
                                                <img className="w-16 h-16 object-cover" src={avatar} />
                                            </div>
                                            <div className="information">
                                                <div>
                                                    <h4 className='dark:text-white text-primary'>{name}</h4>
                                                </div>
                                                <div className={commonModalButtonClasses}>
                                                    <button onClick={() => onRemove(id)}>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className="empty">No writer added!</div>
                        }
                    </div>
                </div>
            }
        </SecondaryModal>
    )
}

export const CastandCrewPopupModal = ({ castInfo = [], handleModal, onRemove }) => {
    const { updateNotification } = useNotification()
    return (
        <SecondaryModal onClose={handleModal}>
            {
                <div>
                    <h1 className={commonModalTitleClasses}>Cast and Crew</h1>
                    <div className='w-full max-h-96 overflow-auto pr-3 custom-scroll-bar'>
                        {
                            (castInfo.length)
                                ?
                                castInfo.map(({ profile, roleAs, leadActor }) => {
                                    const { id, name, avatar } = profile
                                    return (
                                        <div key={id} className='flex mt-4 space-x-3'>
                                            <div className="img-wrap">
                                                <img className="w-16 h-16 object-cover" src={avatar} />
                                            </div>
                                            <div className="w-full flex justify-between">
                                                <div className='fex flex-col'>
                                                    <div>
                                                        <label className='text-ternary'> Actor: </label>
                                                        <span className='dark:text-white text-primary'>{name}</span>
                                                    </div>
                                                    <div>
                                                        <label className='text-ternary'>Role: </label>
                                                        <span className='dark:text-white text-primary'>{roleAs}</span>
                                                    </div>
                                                    {
                                                        leadActor &&
                                                        <span className='dark:text-white text-primary'>Lead Actor</span>
                                                    }
                                                </div>
                                                <div>
                                                    <button className={commonModalButtonClasses}
                                                        onClick={() => onRemove(id)}>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className="empty">No writer added!</div>
                        }
                    </div>
                </div>
            }
        </SecondaryModal >
    )
}

export const GenresPopupModal = ({ handleModal, onSubmit, previousSelection }) => {
    const { updateNotification } = useNotification()
    const [selectedGenres, setSelectedGenres] = useState([])

    const handleGenresSelector = (gen) => {
        let newGenres = [];

        if (selectedGenres.includes(gen))
            newGenres = selectedGenres.filter(genre => genre !== gen)
        else newGenres = [...selectedGenres, gen]

        setSelectedGenres([...newGenres])
    }
    const handleSubmit = () => {
        onSubmit(selectedGenres)
        handleModal();
    }

    const handleClose = () => {
        setSelectedGenres(previousSelection)
        handleModal();
    }

    useEffect(() => {
        setSelectedGenres(previousSelection);
    }, [])

    return (

        <SecondaryModal onClose={handleClose}>
            {
                <div className='flex flex-col justify-between h-full'>
                    <h1 className={commonModalTitleClasses}>Select Genres</h1>
                    <div className='w-full h-full max-h-96 overflow-auto pr-3 custom-scroll-bar space-y-3'>
                        {
                            genres.map((genre) => {
                                return (
                                    <Genre onClick={() => handleGenresSelector(genre)}
                                        selected={selectedGenres.includes(genre)}
                                        key={genre}> {genre}
                                    </Genre>
                                )
                            })
                        }
                    </div>
                    <div className='w-56 self-end'>
                        <Submit value={"Select"} type="button" onClick={handleSubmit} />
                    </div>

                </div>
            }
        </SecondaryModal>
    )
}

const Genre = ({ children, selected, onClick }) => {

    const getSelectedStyle = () => {
        if (selected)
            return "bg-secondary text-white border-secondary ";
        return "dark:border-dark-subtle border-light-subtle ";
    }

    return (
        <button
            onClick={onClick}
            className={(getSelectedStyle()) + "border-2 " +
                "dark:text-white text-primary p-2 py-1 rounded mr-3"}>
            {children}
        </button>
    )
}

// (index === 5 ? "bg-secondary text-white border-secondary " : " ")