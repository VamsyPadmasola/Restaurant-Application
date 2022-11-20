import React, { useEffect, useState } from 'react'
import { useNotification, useSearch } from '../../hooks';
import { languageOptions, statusOptions, typeOptions } from '../../utils/options';
import { commonInputClasses, commonModalButtonClasses } from '../../utils/theme';
import { validateMovie } from '../../utils/validator';
import CastForm from '../form/CastForm';
import DirectorSelector from '../form/DirectorSelector';
import GenresSelector from '../form/GenresSelector';
import Label from '../form/Label';
import LabelWithBadge from '../form/LabelWithBadge';
import PosterSelector from '../form/PosterSelector';
import Selector from '../form/Selector';
import Submit from '../form/Submit';
import ViewAllBtn from '../form/ViewAllButton';
import WriterSelector from '../form/WriterSelector';
import TagsInput from '../TagsInput'
import WritersPopupModal, { CastandCrewPopupModal, GenresPopupModal } from '../modals/PopupModal';

const defaultMovieInfo = {
    title: '',
    storyLine: '',
    tags: [],
    cast: [],
    director: {},
    writers: [],
    releaseDate: '',
    poster: null,
    genres: [],
    type: '',
    language: '',
    status: ' '
}

export default function MovieForm({ onSubmit, btnTitle, initialState, busy }) {

    const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo })
    const { updateNotification } = useNotification()
    const [showWritersModal, setShowWritersModal] = useState(false);
    const [showCastModal, setShowCastModal] = useState(false);
    const [showGenresModal, setShowGenresModal] = useState(false);
    const [selectedPosterForUI, setSelectedPosterForUI] = useState('')

    const handleWritersModal = () => {
        setShowWritersModal(previousState => !previousState)
    }

    const handleCastModal = () => {
        setShowCastModal(previousState => !previousState)
    }

    const handleGenresModal = () => {
        setShowGenresModal(previousState => !previousState)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { error } = validateMovie(movieInfo)
        if (error)
            return updateNotification('error', error)
        const { tags, genres, cast, writers, director, poster } = movieInfo

        const formData = new FormData()
        const finalMovieInfo = {
            ...movieInfo,

        }
        finalMovieInfo.tags = JSON.stringify(tags);
        finalMovieInfo.genres = JSON.stringify(genres);
        const finalCast = cast.map((c) => ({
            actor: c.profile.id,
            roleAs: c.roleAs,
            leadActor: c.leadActor
        }))
        finalMovieInfo.cast = JSON.stringify(finalCast)

        if (writers.length) {
            const finalWriters = writers.map(writer => writer.id)
            finalMovieInfo.writers = JSON.stringify(finalWriters)
        }

        if (director.id)
            finalMovieInfo.director = director.id

        if (poster)
            finalMovieInfo.poster = poster

        for (let key in finalMovieInfo) {
            formData.append(key, finalMovieInfo[key])
        }

        onSubmit(formData)
    }

    const updatePosterForUI = (file) => {
        const url = URL.createObjectURL(file)
        setSelectedPosterForUI(url);
    }

    const handleChange = ({ target }) => {
        const { value, name, files } = target
        if (name === 'poster') {
            const poster = files[0]
            updatePosterForUI(poster)
            return setMovieInfo({ ...movieInfo, poster })
        }
        setMovieInfo({ ...movieInfo, [name]: value })
    }

    const updateTags = (tags) => {
        setMovieInfo({ ...movieInfo, tags })
    }

    const updateDirector = (profile) => {
        setMovieInfo({ ...movieInfo, director: profile })
    }

    const updateWriters = (profile) => {
        const { writers } = movieInfo;
        for (let writer of writers) {
            if (writer.id === profile.id) {
                return updateNotification('warning', "This Profile is already selected.")
            }
        }
        setMovieInfo({ ...movieInfo, writers: [...writers, profile] })
    }

    const updateCast = (castInfo) => {
        const { cast } = movieInfo
        setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] })
    }

    const updateGenres = (genres) => {
        setMovieInfo({ ...movieInfo, genres })
    }

    const handleRemoveWriter = (profileId) => {
        const { writers } = movieInfo;
        const newWriters = writers.filter(({ id }) => id !== profileId);
        setMovieInfo({ ...movieInfo, writers: newWriters })
    }

    const handleRemoveCast = (profileId) => {
        const { cast } = movieInfo;
        const newCast = cast.filter(({ profile }) => profile.id !== profileId);
        setMovieInfo({ ...movieInfo, cast: [...newCast] })
    }

    const {
        title,
        storyLine,
        writers,
        cast,
        tags,
        releaseDate,
        genres,
        type,
        language,
        status
    } = movieInfo;

    useEffect(() => {
        if (initialState) {
            setMovieInfo({
                ...initialState, releaseDate: initialState.releaseDate.split('T')[0],
                poster: null
            })
            setSelectedPosterForUI(initialState.poster)
            console.log(initialState)
        }

    }, [initialState]);

    return (
        <div>
            <div className='flex space-x-3'>
                <div className='w-[70%] space-y-5'>
                    <div>
                        <Label htmlFor={"title"}>Title</Label>
                        <input id='title' defaultValue={title} onChange={handleChange} name='title' type='text' className={commonInputClasses + ' border-b-2 font-semibold text-xl'} placeholder='Titanic' />
                    </div>
                    <div>
                        <Label htmlFor={"storyLine"}>Story line</Label>
                        <textarea id='storyLine' defaultValue={storyLine} onChange={handleChange} name='storyLine' placeholder='Movie story line..' className={commonInputClasses + ' resize-none h-24 border-b-2'}></textarea>
                    </div>
                    <div>
                        <Label htmlFor={"tags"}>Tags</Label>
                        <TagsInput value={tags} name="tags" onChange={updateTags} />
                    </div>
                    <DirectorSelector onSelect={updateDirector} />
                    <div>
                        <div className="flex justify-between">
                            <LabelWithBadge htmlFor={"writers"} badge={writers.length}>Writers</LabelWithBadge>
                            <ViewAllBtn onClick={() => setShowWritersModal(!showWritersModal)} visible={writers.length}>View All</ViewAllBtn>
                        </div>
                        <WriterSelector onSelect={updateWriters} />
                    </div>
                    <div>
                        <div className="flex justify-between">
                            <LabelWithBadge
                                badge={cast.length}>Add Cast and Crew
                            </LabelWithBadge>
                            <ViewAllBtn
                                visible={cast.length}
                                onClick={() => setShowCastModal(!showCastModal)}>
                                View All</ViewAllBtn>
                        </div>
                        <CastForm onSubmit={updateCast} />
                    </div>
                    <div>
                        <Label htmlFor={"releaseDate"}>Release Date</Label>
                        <input id='releaseDate' value={releaseDate}
                            onChange={handleChange} name='releaseDate'
                            type='date' className={commonInputClasses + ' border-b-2 w-auto p-1 ml-3'} />
                    </div>
                    <Submit busy={busy} value={btnTitle} onClick={handleSubmit} type='button' />
                </div>
                <div className='w-[30%] space-y-5'>
                    <PosterSelector
                        name='poster'
                        onChange={handleChange}
                        selectedPoster={selectedPosterForUI}
                        accept='image/jpeg, image/jpg, image/png'
                        label={"Select Poster"}
                    />
                    <GenresSelector badge={genres.length} onClick={() => setShowGenresModal(!showGenresModal)}></GenresSelector>
                    <Selector onChange={handleChange} name='type' value={type} options={typeOptions} label='Type' />
                    <Selector onChange={handleChange} name='language' value={language} options={languageOptions} label='language' />
                    <Selector onChange={handleChange} name='status' value={status} options={statusOptions} label='Status' />
                </div>
            </div>
            {
                showWritersModal &&
                <WritersPopupModal profiles={movieInfo.writers} handleModal={handleWritersModal} onRemove={handleRemoveWriter} />
            }
            {
                showCastModal &&
                <CastandCrewPopupModal castInfo={movieInfo.cast} handleModal={handleCastModal} onRemove={handleRemoveCast} />
            }
            {
                showGenresModal &&
                <GenresPopupModal handleModal={handleGenresModal}
                    onSubmit={updateGenres} previousSelection={genres}
                //  onRemove = {handleRemoveGenres}
                />
            }
        </div>
    )
}

