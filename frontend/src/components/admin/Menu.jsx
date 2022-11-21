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
import { deleteMenuItem, getMenu, searchMenu } from "../../api/menu";
import Loader from "../ui/Loader";
import UpdateMenu from "../modals/UpdateMenu";

let currentPageNo = 0;
const limit = 20;

export default function Menu() {
    const [menu, setMenu] = useState([])
    const [results, setResults] = useState([])
    const [reachedToEnd, setReachedToEnd] = useState(false);
    const [busy, setBusy] = useState(false);
    const [showUpdateActorModal, setShowUpdateActorModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showLoader, setShowLoader] = useState(false)

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

    const handleOnSearchSubmit = async (value) => {
        await handleSearch(searchMenu, value, setResults)
    }

    const handleSearchFormReset = () => {
        resetSearch()
        setResults([])
    }

    const hideConfirmModal = () => {
        setShowConfirmModal(false)
    }

    const handleOnDeleteConfirm = async () => {
        setBusy(true)
        const { error, message } = await deleteMenuItem(selectedProfile.id)
        setBusy(false)
        if (error) return updateNotification('error', error)
        updateNotification('success', message)
        hideConfirmModal()
        fetchMenu()
    }

    useEffect(() => {
        fetchMenu();
    }, []);

    return (
        <>
            <div className="">
                <div className="flex justify-start ml-5">
                    <AppSearchForm onReset={handleSearchFormReset}
                        showResetBtn={results.length || resultNotFound}
                        onSubmit={handleOnSearchSubmit} placeholder="Search Menu..." />
                </div>
                <NotFound text='No item found' visible={resultNotFound} />

                <div className={"product-list h-[78vh] ml-3"}>
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
                <UpdateMenu
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
        <div className={"item-card shadow-md"}>
            <img className="aspect-square object-cover" src={image} />
            <div className="">
                <div className="flex flex-col ml-3 mt-1">
                    <span className="text-md">{getName(name)}</span>
                    <span className="text-md">₹ {price}</span>
                </div>
                <div className="w-full flex items-center justify-center space-x-5 mb-3">
                    <button type='button' className='text-white bg-success rounded-full p-2 hover:opacity-70 transition'
                        onClick={onEditClick}>
                        <MdModeEditOutline />
                    </button>
                    <button type='button' className='text-white bg-failure rounded-full p-2 hover:opacity-70 transition'
                        onClick={onDeleteClick}>
                        <AiFillDelete />
                    </button>
                </div>
            </div>
        </div>
    )
}