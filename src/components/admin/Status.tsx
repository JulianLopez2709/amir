type props = {
    name : string,
    color : string,
    bg?: string,
    textColor ?: string
}

function Status({ name = "Pendiente por confirmar", color = "white", bg = "black", textColor = "white" }:props) {
    return (
        <div  className={`${bg}  px-5 rounded-sm`}>
            <p className={`font-bold ${textColor}`}>{name}</p>
        </div>
    )
}

export default Status