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

let currentPageNo = 0;
const limit = 20;

export default function Actors() {
	const [actors, setActors] = useState([])
	const [results, setResults] = useState([])
	const [reachedToEnd, setReachedToEnd] = useState(false);
	const [busy, setBusy] = useState(false);
	const [showUpdateActorModal, setShowUpdateActorModal] = useState(false)
	const [showConfirmModal, setShowConfirmModal] = useState(false)

	const [selectedProfile, setSelectedProfile] = useState(null)

	const { updateNotification } = useNotification();
	const { handleSearch, resetSearch, resultNotFound } = useSearch();

	const fetchActors = async (pageNo) => {
		const { profiles, error } = await getActors(pageNo, limit);
		if (error) return updateNotification("error", error);

		if (!profiles.length) {
			currentPageNo = pageNo - 1;
			return setReachedToEnd(true);
		}

		setActors([...profiles]);
	};

	const handleOnNextClick = () => {
		if (reachedToEnd) return;
		currentPageNo += 1;
		fetchActors(currentPageNo);
	};

	const handleOnPrevClick = () => {
		if (currentPageNo <= 0) return;
		if (reachedToEnd) setReachedToEnd(false)
		currentPageNo -= 1;
		fetchActors(currentPageNo);
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
		const updatedActors = actors.map(actor => {
			if (profile.id == actor.id) {
				return profile
			}

			return actor
		})

		setActors([...updatedActors])
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
		fetchActors();
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
				<div className="grid grid-cols-4 gap-5 p-5">
					{results.length || resultNotFound
						?
						results.map(actor => <ActorProfile profile={actor} key={actor.id}
							onEditClick={() => handleOnEditClick(actor)}
							onDeleteClick={() => handleOnDeleteClick(actor)} />
						)
						:
						actors.map(actor => <ActorProfile profile={actor} key={actor.id}
							onEditClick={() => handleOnEditClick(actor)}
							onDeleteClick={() => handleOnDeleteClick(actor)} />
						)
					}
				</div >
				{!results.length && !resultNotFound ? <NextAndPreviousButton
					className="mt-5"
					onNextClick={handleOnNextClick}
					onPrevClick={handleOnPrevClick} /> : null}
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

const ActorProfile = ({ profile, onEditClick, onDeleteClick }) => {
	const [showOptions, setShowOptions] = useState(false)
	const acceptedNameLength = 15

	const handleOnMouseEnter = () => {
		setShowOptions(true)
	}
	const handleMouseLeave = () => {
		setShowOptions(false)
	}
	if (!profile) return null;
	const { name, avatar, about = '' } = profile;

	const getName = (name) => {
		if (name.length <= acceptedNameLength) return name;
		return name.substring(0, acceptedNameLength) + '...'
	}

	return (
		<div className='dark:bg-primary bg-white dark:shadow-darkShadow shadow-lightShadow
        	rounded-xl h-24 overflow-hidden'>
			<div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleMouseLeave}
				className="flex cursor-pointer relative">
				<img src={avatar} alt={name} className="w-24 aspect-square object-cover" />

				<div className="p-2">
					<h1 className=" dark:text-white text-primary font-semibold whitespace-nowrap">
						{getName(name)}</h1>
					<p className="dark:text-white text-primary text-xs opacity-70">
						{about.substring(0, 55) + "..."}
					</p>

				</div>
				<Options onEditClick={onEditClick} onDeleteClick={onDeleteClick} visible={showOptions} />
			</div>
		</div >
	)
}

const Options = ({ visible, onEditClick, onDeleteClick }) => {
	if (!visible)
		return null
	return (
		<div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm
			flex justify-center items-center space-x-5">
			<button type='button' className='text-white bg-red-btn rounded-full p-2 hover:opacity-70 transition'
				onClick={onDeleteClick}>
				<AiFillDelete />
			</button>
			<button type='button' className='text-white bg-orange-btn rounded-full p-2 hover:opacity-70 transition'
				onClick={onEditClick}>
				<MdModeEditOutline />
			</button>
		</div>
	)
}