const Label = ({ children, htmlFor }) => {
    return (
        <label className='text-grey-subtle font-semibold' htmlFor={htmlFor}>{children}</label>
    )
}

export default Label;