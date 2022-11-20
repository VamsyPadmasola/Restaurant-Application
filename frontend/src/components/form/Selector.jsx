import React from 'react'

export default function Selector({ name, options, value, label, onChange }) {
  return (
    <select id={name} name={name} value={value} onChange={onChange}
      className={"border-2 bg-transparent outline-none border-secondary hover:border-secondary cursor-pointer" +
        "  text-black transition rounded px-4 py-1 pr-10 w-52"}>
      <option value={""}>{label}</option>
      {
        options.map(({ title, value }) => {
          return (
            <option key={title} value={value}>{title}</option>
          )
        })
      }
    </select>
  )
}
