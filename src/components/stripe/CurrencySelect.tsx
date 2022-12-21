import { useEffect } from "react"
import "../../assets/styles/selectStyle.scss"

const CurrencySelect = (props: any) => {
    const { label, options, setOption, option, width } = props

    useEffect(() => { if (options.length) setOption(0) }, [options])
    useEffect(() => { if (option === "" && options.length) setOption(0) }, [option])

    return (
        <div className="select-option-wrapper">
            <div className="input" style={{ width: width ? width : '190px' }}>
                <span className="label">{label}</span>
                <select
                    onChange={(e) => { setOption(Number(e.target.value)) }}
                    value={option}
                    style={{ width: width ? width : '190px' }}
                >
                    {options.map((op: any, index: any) => (
                        <option key={index} value={index}>{op}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CurrencySelect;
