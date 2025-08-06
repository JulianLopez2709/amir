type props = {
    name : string,
    color : string,
    bg?: string,
    textColor ?: string
}

function Status({ name = "New", color = "purple", bg = "purple", textColor = "purple" }:props) {
    return (
        <div  className={`${bg}  px-5 rounded-lg`}>
            <p className={`text-sm font-bold ${textColor}`}>{name}</p>
        </div>
    )
}

export default Status