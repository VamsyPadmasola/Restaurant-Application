import React, { useState } from "react";
import { useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsTrash, BsPencilSquare } from 'react-icons/bs'
import { MdModeEditOutline } from "react-icons/md";
import { deleteActor, getActors, searchActor } from "../../api/actor";
import { useNotification, useSearch } from '../../hooks';
import AppSearchForm from "../form/AppSearchForm";
import ConfirmModal from "../modals/ConfirmModal";
import NotFound from "../ui/NotFound";
import UpdateActor from "../modals/UpdateActor";
import NextAndPreviousButton from "./NextAndPreviousButton";
import { getMenu } from "../../api/menu";

let currentPageNo = 0;
const limit = 20;

export default function Menu() {
    const [menu, setMenu] = useState([])
    const [results, setResults] = useState([])
    const [reachedToEnd, setReachedToEnd] = useState(false);
    const [busy, setBusy] = useState(false);
    const [showUpdateActorModal, setShowUpdateActorModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const [selectedProfile, setSelectedProfile] = useState(null)

    const { updateNotification } = useNotification();
    const { handleSearch, resetSearch, resultNotFound } = useSearch();

    const fetchMenu = async (pageNo) => {
        const { items, error } = await getMenu(pageNo, limit);
        if (error) return updateNotification("error", error);

        if (!items.length) {
            currentPageNo = pageNo - 1;
            return setReachedToEnd(true);
        }

        setMenu([...items]);
    };

    const handleOnNextClick = () => {
        if (reachedToEnd) return;
        currentPageNo += 1;
        fetchMenu(currentPageNo);
    };

    const handleOnPrevClick = () => {
        if (currentPageNo <= 0) return;
        if (reachedToEnd) setReachedToEnd(false)
        currentPageNo -= 1;
        fetchMenu(currentPageNo);
    };

    const handleUpdateActorModal = () => {
        setShowUpdateActorModal(previousState => !previousState)
    }

    const handleConfirmModal = () => {
        setShowConfirmModal(previousState => !previousState)
    }

    const handleOnEditClick = (profile) => {
        setSelectedProfile(profile)
        setShowUpdateActorModal(!showUpdateActorModal)
    }

    const handleOnActorUpdate = (profile) => {
        const updatedActors = menu.map(actor => {
            if (profile.id == actor.id) {
                return profile
            }

            return actor
        })

        setMenu([...updatedActors])
    }

    const handleOnDeleteClick = (profile) => {
        setShowConfirmModal(!showConfirmModal)
        setSelectedProfile(profile)
    }

    const handleOnSearchSubmit = (value) => {
        handleSearch(searchActor, value, setResults)
    }

    const handleSearchFormReset = () => {
        resetSearch()
        setResults([])
    }

    const hideConfirmModal = () => {
        setShowConfirmModal(false)
    }

    const handleOnDeleteConfirm = async () => {
        // setBusy(true)
        // const { error, message } = await deleteActor(selectedProfile.id)
        // setBusy(false)
        // if (error) return updateNotification('error', error)
        // updateNotification('success', message)
        // hideConfirmModal()
        // fetchActors(currentPageNo)
    }

    useEffect(() => {
        fetchMenu();
    }, []);

    return (
        <>
            <div className="p-2">
                <div className="flex justify-end">
                    <AppSearchForm onReset={handleSearchFormReset}
                        showResetBtn={results.length || resultNotFound}
                        onSubmit={handleOnSearchSubmit} placeholder="Search Actors..." />
                </div>
                <NotFound text='Record not found' visible={resultNotFound} />

                <div className={"product-list"}>
                    <div className={"product-list--wrapper"}>
                        {results.length || resultNotFound
                            ?
                            results.map(item => <MenuItem item={item} key={item.id}
                                onEditClick={() => handleOnEditClick(item)}
                                onDeleteClick={() => handleOnDeleteClick(item)} />
                            )
                            :
                            menu.map(item => <MenuItem item={item} key={item.id}
                                onEditClick={() => handleOnEditClick(item)}
                                onDeleteClick={() => handleOnDeleteClick(item)} />
                            )
                        }
                    </div>
                </div>

                {/* {!results.length && !resultNotFound ? <NextAndPreviousButton
                    className="mt-5"
                    onNextClick={handleOnNextClick}
                    onPrevClick={handleOnPrevClick} /> : null} */}
            </div>
            {
                showConfirmModal &&
                <ConfirmModal
                    onClose={handleConfirmModal}
                    title='Are you sure?'
                    subtitle={"This action will remove this profile permanently!"}
                    busy={busy}
                    onConfirm={handleOnDeleteConfirm}
                    onCancel={hideConfirmModal}
                />
            }
            {
                showUpdateActorModal &&
                <UpdateActor
                    initialState={selectedProfile}
                    onClose={handleUpdateActorModal}
                    onSuccess={handleOnActorUpdate} />
            }
        </>
    )
}

const MenuItem = ({ item, onEditClick, onDeleteClick }) => {
    const [showOptions, setShowOptions] = useState(false)
    const acceptedNameLength = 35
    const acceptedDecrLength = 150

    const handleOnMouseEnter = () => {
        setShowOptions(true)
    }
    const handleMouseLeave = () => {
        setShowOptions(false)
    }
    if (!item) return null;
    const { name, image, description = '', type, price } = item;
    console.log(item)
    const getName = (name) => {
        if (name.length <= acceptedNameLength) return name;
        return name.substring(0, acceptedNameLength) + '...'
    }

    const getDescr = (description) => {
        if (description.length <= acceptedDecrLength) return description;
        return description.substring(0, acceptedDecrLength) + '...'
    }

    return (
        <div className={"item-card"}>
            <img className="aspect-square object-cover" src={image} />
            <div className="p-2">
                <div className="flex flex-col">
                    <span className="text-sm">{name}</span>
                    <span className="text-sm">₹ {price}</span>
                </div>
                <div className="w-full flex items-center justify-center space-x-5">
                    <button type='button' className='text-white bg-secondary rounded-full p-2 hover:opacity-70 transition'
                        onClick={onEditClick}>
                        <MdModeEditOutline />
                    </button>
                    <button type='button' className='text-white bg-red-btn rounded-full p-2 hover:opacity-70 transition'
                        onClick={onDeleteClick}>
                        <AiFillDelete />
                    </button>
                </div>
            </div>
        </div>

        // <div className="flex flex-col w-full">
        //     <img src={image} alt={name} className="w-32 aspect-square object-cover" />
        // </div>

        // <div className='bg-white shadow-lightShadow
        // 	rounded-3xl h-32 overflow-hidden w-[50%]'>
        //     <div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleMouseLeave}
        //         className="flex cursor-pointer relative">
        //         <img src={image} alt={name} className="w-32 aspect-square object-cover" />

        //         <div className="p-2 w-full">
        //             <span className=" text-black text-xl font-bold whitespace-nowrap">
        //                 {getName(name)}</span>
        //             <p className="text-black text-xs opacity-70 min-h-[25%]">
        //                 {getDescr(description)}
        //             </p>
        //             <span>
        //                 Rating
        //             </span>
        //             <div className="flex items-center justify-between">
        //                 <span className="text-lg text-black whitespace-nowrap">
        //                     ₹ {+"" + price}</span>
        //                 <div className="flex space-x-5 relative right-2">
        //                     <div className="rounded-full bg-[#1DA8E2] p-2">
        //                         <MdModeEditOutline color="#ffffff" />
        //                     </div>
        //                     <div className="rounded-full bg-[#B22222] p-2">
        //                         <AiFillDelete color="#ffffff" />
        //                     </div>
        //                 </div>
        //             </div>

        //         </div>
        /* <Options onEditClick={onEditClick} onDeleteClick={onDeleteClick} visible={showOptions} /> */
        // </div>
        // </div >
    )
}

const Options = ({ visible, onEditClick, onDeleteClick }) => {
    if (!visible)
        return null
    return (
        <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm
			flex justify-center items-center space-x-5">
            <button type='button' className='text-white bg-[#89CFF0] rounded-full p-2 hover:opacity-70 transition'
                onClick={onEditClick}>
                <MdModeEditOutline />
            </button>
            <button type='button' className='text-white bg-red-btn rounded-full p-2 hover:opacity-70 transition'
                onClick={onDeleteClick}>
                <AiFillDelete />
            </button>
        </div>
    )
}