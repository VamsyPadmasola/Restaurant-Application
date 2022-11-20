import Label from "./Label"

const LabelWithBadge = ({ children, htmlFor, badge = 0 }) => {

    const renderBadge = () => {
        if (!badge) return null
        return (
            <span className='bg-gray-500 absolute top-0 right-0 w-5 h-5
            translate-x-6 translate-y-0 text-xs rounded-full flex justify-center items-center text-white'>{badge <= 9 ? badge : '9+'}</span>
        )
    }
    return (
        <div className='relative'>
            <Label htmlFor={htmlFor} >{children}</Label>
            {renderBadge()}

        </div>
    )
}

export default LabelWithBadge;