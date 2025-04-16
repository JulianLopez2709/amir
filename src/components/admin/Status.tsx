import React from 'react'

function Status({ name = "New", color = "bg-purple" }) {
    const bgColor = `bg-${color}-200`;
    const textColor = `text-${color}-700`;
    return (
        <div className={`${bgColor} px-5 rounded-lg`}>
            <p className={`font-bold ${textColor}`}>{name}</p>
        </div>
    )
}

export default Status