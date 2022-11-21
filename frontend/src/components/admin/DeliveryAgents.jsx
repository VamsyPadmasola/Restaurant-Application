import React, { useState } from "react";
import { useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsTrash, BsPencilSquare } from 'react-icons/bs'
import { MdModeEditOutline } from "react-icons/md";
import { deleteAgent, getAgents, searchAgent } from "../../api/chef";
import { useNotification, useSearch } from '../../hooks';
import AppSearchForm from "../form/AppSearchForm";
import ConfirmModal from "../modals/ConfirmModal";
import NotFound from "../ui/NotFound";
import UpdateAgent from "../modals/UpdateAgent";
import NextAndPreviousButton from "./NextAndPreviousButton";
import { deleteDelivery, getDelivery, searchDelivery } from "../../api/delivery";

let currentPageNo = 0;
const limit = 20;

export default function DeliveryAgents() {
    const [agents, setAgents] = useState([])
    const [results, setResults] = useState([])
    const [reachedToEnd, setReachedToEnd] = useState(false);
    const [busy, setBusy] = useState(false);
    const [showUpdateAgentModal, setShowUpdateAgentModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const [selectedProfile, setSelectedProfile] = useState(null)

    const { updateNotification } = useNotification();
    const { handleSearch, resetSearch, resultNotFound } = useSearch();

    const fetchAgents = async () => {
        const { profiles, error } = await getDelivery();
        if (error) return updateNotification("error", error);
        setAgents([...profiles]);
    };

    const handleOnNextClick = () => {
        if (reachedToEnd) return;
        currentPageNo += 1;
        fetchAgents(currentPageNo);
    };

    const handleOnPrevClick = () => {
        if (currentPageNo <= 0) return;
        if (reachedToEnd) setReachedToEnd(false)
        currentPageNo -= 1;
        fetchAgents();
    };

    const handleUpdateAgentModal = () => {
        setShowUpdateAgentModal(previousState => !previousState)
    }

    const handleConfirmModal = () => {
        setShowConfirmModal(previousState => !previousState)
    }

    const handleOnEditClick = (profile) => {
        setSelectedProfile(profile)
        setShowUpdateAgentModal(!showUpdateAgentModal)
    }

    const handleOnAgentUpdate = (profile) => {
        const updatedAgents = agents.map(agent => {
            if (profile.id == agent.id) {
                return profile
            }
            return agent
        })

        setAgents([...updatedAgents])

    }

    const handleOnDeleteClick = (profile) => {
        setShowConfirmModal(!showConfirmModal)
        setSelectedProfile(profile)
    }

    const handleOnSearchSubmit = (value) => {
        handleSearch(searchDelivery, value, setResults)
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
        const { error, message } = await deleteDelivery(selectedProfile.id)
        setBusy(false)
        if (error) return updateNotification('error', error)
        updateNotification('success', message)
        hideConfirmModal()
        fetchAgents()
    }

    useEffect(() => {
        fetchAgents();
    }, []);

    return (
        <>
            <div className="p-2">
                <div className="flex justify-left ml-3">
                    <AppSearchForm onReset={handleSearchFormReset}
                        showResetBtn={results.length || resultNotFound}
                        onSubmit={handleOnSearchSubmit} placeholder="Search Agents..." />
                </div>
                <NotFound text='Record not found' visible={resultNotFound} />
                <div className="grid grid-cols-3 gap-5 p-5">
                    {
                        results.length || resultNotFound
                            ?
                            results.map(chef => <AgentCard profile={chef} key={chef.id}
                                onEditClick={() => handleOnEditClick(chef)}
                                onDeleteClick={() => handleOnDeleteClick(chef)} />
                            )
                            :
                            agents.map(chef => <AgentCard profile={chef} key={chef.id}
                                onEditClick={() => handleOnEditClick(chef)}
                                onDeleteClick={() => handleOnDeleteClick(chef)} />
                            )
                    }
                </div >
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
                showUpdateAgentModal &&
                <UpdateAgent
                    initialState={selectedProfile}
                    onClose={handleUpdateAgentModal}
                    onSuccess={handleOnAgentUpdate} />
            }
        </>
    )
}

// const ActorProfile = ({ profile, onEditClick, onDeleteClick }) => {
// 	const [showOptions, setShowOptions] = useState(false)
// 	const acceptedNameLength = 15

// 	const handleOnMouseEnter = () => {
// 		setShowOptions(true)
// 	}
// 	const handleMouseLeave = () => {
// 		setShowOptions(false)
// 	}
// 	if (!profile) return null;
// 	const { name, gender, about = '' } = profile;

// 	const getName = (name) => {
// 		if (name.length <= acceptedNameLength) return name;
// 		return name.substring(0, acceptedNameLength) + '...'
// 	}

// 	return (
// 		<div className='dark:bg-primary bg-white dark:shadow-darkShadow shadow-lightShadow
//         	rounded-xl h-24 overflow-hidden'>
// 			<div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleMouseLeave}
// 				className="flex cursor-pointer relative">
// 				<img src={avatar} alt={name} className="w-24 aspect-square object-cover" />

// 				<div className="p-2">
// 					<h1 className=" dark:text-white text-primary font-semibold whitespace-nowrap">
// 						{getName(name)}</h1>
// 					<h2 className=" dark:text-white text-primary font-semibold whitespace-nowrap">
// 						{gender}</h2>
// 					<p className="dark:text-white text-primary text-xs opacity-70">
// 						{about.substring(0, 55) + "..."}
// 					</p>

// 				</div>
// 				<Options onEditClick={onEditClick} onDeleteClick={onDeleteClick} visible={showOptions} />
// 			</div>
// 		</div >
// 	)
// }

const Options = ({ visible, onEditClick, onDeleteClick }) => {
    if (!visible)
        return null
    return (
        <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm
			flex justify-center items-center space-x-5">
            <button type='button' className='text-white bg-success rounded-full p-2 hover:opacity-70 transition'
                onClick={onEditClick}>
                <MdModeEditOutline size={20} />
            </button>
            <button type='button' className='text-white bg-failure rounded-full p-2 hover:opacity-70 transition'
                onClick={onDeleteClick}>
                <AiFillDelete size={20} />
            </button>
        </div>
    )
}

const AgentCard = ({ profile, onEditClick, onDeleteClick }) => {

    const [showOptions, setShowOptions] = useState(false)
    const acceptedNameLength = 35
    const acceptedDecrLength = 80

    const handleOnMouseEnter = () => {
        setShowOptions(true)
    }
    const handleMouseLeave = () => {
        setShowOptions(false)
    }
    if (!profile) return null;
    const { name, contact, gender } = profile;

    const getName = (name) => {
        if (name.length <= acceptedNameLength) return name;
        return name.substring(0, acceptedNameLength) + '...'
    }

    const getDescr = (description) => {
        if (description.length <= acceptedDecrLength) return description;
        return description.substring(0, acceptedDecrLength) + '...'
    }

    return (
        <div className='dark:bg-primary bg-white dark:shadow-darkShadow shadow-lightShadow
        	rounded-xl h-24 overflow-hidden'>
            <div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleMouseLeave}
                className="flex cursor-pointer relative">
                <img src={"deliveryagent_2.png"} alt={name} className="w-24 aspect-square object-cover" />

                <div className="p-2 flex flex-col">
                    <span className=" text-black text-lg font-semibold whitespace-nowrap">
                        {getName(name)}</span>
                    <span className=" text-black text-sm font-semibold whitespace-nowrap capitalize">
                        {gender}</span>
                    <p className="text-black text-md opacity-70">
                        {contact}
                    </p>

                </div>
                <Options onEditClick={onEditClick} onDeleteClick={onDeleteClick} visible={showOptions} />
            </div>
        </div >
    )
}