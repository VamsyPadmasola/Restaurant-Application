import { ImTree } from 'react-icons/im'

export default function ({ badge = 0, onClick }) {

    const renderBadge = () => {
        if(!badge) return null
        return (
            <span className='bg-gray-500 absolute top-0 right-0 w-5 h-5
            translate-x-6 translate-y-0 text-xs rounded-full flex justify-center items-center text-white'>{badge <= 9 ? badge : '9+'}</span>  
        )
    }

    return (
        <button type='button' onClick={onClick} className='relative flex items-center space-x-2 py-1 px-3
        border-2 dark:border-dark-subtle  border-light-subtle dark:hover:border-secondary
        hover:border-secondary dark:text-dark-subtle dark:hover:text-white text-primary transition rounded'>
            <ImTree/>
            <span>Select Genres</span>
            {renderBadge()}
        </button>
    )
}
