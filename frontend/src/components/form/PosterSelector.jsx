import React from 'react'


const commonPosterUI = "flex justify-center items-center border-secondary border border-dashed rounded aspect-video cursor-pointer";
export default function PosterSelector({ name, accept, selectedPoster, onChange, className, label }) {
    return (
        <div>
            <input id={name} name={name} accept={accept} type={"file"} hidden onChange={onChange} />
            <label htmlFor={name}>
                {
                    selectedPoster ?
                        <img className={commonPosterUI + " object-cover " + className}
                            src={selectedPoster} alt="Poster" /> :
                        <PosterUI label={label} className={className} />
                }
            </label>
        </div>
    )
}


const PosterUI = ({ label, className }) => {
    return (
        <div className={commonPosterUI + ' ' + className}>
            <span className='text-black'>{label}</span>
        </div>
    )
}