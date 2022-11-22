import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../assets/styles/TabsStyle.scss"

const Tabs = (props: any) => {
    const { list, initialOption, tabWidth } = props
    const [option, setOption] = useState(initialOption)
    const navigate = useNavigate()

    return (
        <div className="tabs-wrapper">
            <div className="tab-list">
                {list.map((tab: any, index: any) => (
                    <div 
                        className={`tab ${index === option ? 'active' : '' }`} 
                        key={index} 
                        style={ tabWidth ? { width: tabWidth } : {}}
                        onClick={() => {
                            setOption(index)
                            navigate(tab.route)
                        }}
                    >
                        <span>{tab.text}</span>
                        {index === option &&<div className="active-bar"></div>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tabs