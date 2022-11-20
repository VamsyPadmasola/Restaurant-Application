import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { commonInputClasses } from '../utils/theme'



export default function LiveSearch({
    results = [],
    name,
    value = '',
    placeholder = '',
    inputStyle,
    selectedResultStyle,
    resultContainerStyle,
    renderItem = null,
    onChange = null,
    onSelect = null
}) {
    const [displaySearch, setDisplaySearch] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState(-1)

    const handleOnFocus = () => {
        if (results.length) setDisplaySearch(true);
    };

    const closeSearch = () => {
        setDisplaySearch(false);
        setFocusedIndex(-1);
    }

    const handleOnBlur = () => {
        setTimeout(() => {
            closeSearch();
        }, 100)
    }

    const handleSelection = (selectedItem) => {
        if (selectedItem) {
            onSelect(selectedItem)
            closeSearch()
        }
    }

    const handleKeyDown = ({ key }) => {
        let nextCount;
        const keys = ["ArrowDown", "ArrowUp", "Enter", "Escape"];
        if (!keys.includes(key)) return;

        // move selection up and down
        if (key === "ArrowDown") {
            nextCount = (focusedIndex + 1) % results.length;
        }
        if (key === "ArrowUp") {
            nextCount = (focusedIndex + results.length - 1) % results.length;
        }

        if (key === "Escape") return closeSearch();

        if (key === "Enter") return handleSelection(results[focusedIndex]);

        setFocusedIndex(nextCount);
    };

    const getInputStyle = () => {
        return inputStyle ? inputStyle : commonInputClasses + ' border-2 rounded p-1 text-lg';
    }

    useEffect(() => {
        if (results.length) return setDisplaySearch(true)
        setDisplaySearch(false)

    }, [results.length])

    return (
        <div className='relative'>
            <input
                id={name}
                name={name}
                type={"text"}
                className={getInputStyle()}
                placeholder={placeholder}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                onKeyDown={handleKeyDown}
                value={value}
                onChange={onChange}
                autoComplete="off" />

            <SearchResults
                focusedIndex={focusedIndex}
                visible={displaySearch}
                results={results}
                onSelect={handleSelection}
                renderItem={renderItem}
                resultContainerStyle={resultContainerStyle}
                selectedResultStyle={selectedResultStyle}
            />
        </div>
    )
}

const SearchResults = ({ visible, results = [], focusedIndex, onSelect, renderItem, resultContainerStyle, selectedResultStyle }) => {

    const resultContainer = useRef()

    useEffect(() => {
        resultContainer.current?.scrollIntoView({
            behaviour: "smooth",
            block: "center"
        })
    }, [focusedIndex]);

    if (!visible) return null;
    return (
        <div className='absolute right-0 left-0 top-10 dark:bg-white bg-light-subtle shadow-md p-2 max-h-64 overflow-auto
        space-y-2 mt-1 custom-scroll-bar z-50'>
            {
                results.map((result, index) => {
                    const getSelectedClass = () => {
                        return selectedResultStyle ? selectedResultStyle : 'bg-white'
                    }
                    const { id, name, avatar } = result
                    return (
                        <ResultCard ref={index === focusedIndex ? resultContainer : null} key={index.toString()} item={result} renderItem={renderItem}
                            resultContainerStyle={resultContainerStyle} selectedResultStyle={index === focusedIndex ? getSelectedClass() : ''}
                            onClick={() => onSelect(result)} />
                    )
                })
            }
        </div>
    )
}

const ResultCard = forwardRef((props, ref) => {
    const { item, renderItem, resultContainerStyle, selectedResultStyle, innerRef, onClick } = props
    const getClasses = () => {
        if (resultContainerStyle) return resultContainerStyle + selectedResultStyle

        return (
            selectedResultStyle + " cursor-pointer rounded overflow-hidden dark:text-primary text-white hover:bg-secondary dark:hover:text-white hover:text-white transition"
        )
    }
    return (
        <div
            onClick={onClick}
            ref={ref}
            //key={id}
            className={
                getClasses()
            }>
            {renderItem(item)}
        </div>
    )

}
)







