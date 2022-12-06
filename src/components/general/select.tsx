import { useEffect } from "react";
import "../../assets/styles/selectStyle.scss";

const Select = (props: any) => {
    const { label, options, setOption, option, width } = props;

    useEffect(() => {
        if (options.length) setOption(options[0]._id);
    }, [options]);

    useEffect(() => {
        if(option === "" && options.length) setOption(options[0]._id);
    }, [option]);

    return (
        <div className="select-option-wrapper">
            <div className="input" style={{ width: width ? width : '190px' }}>
                <span className="label">{label}</span>
                <div className="input-field">
                    <select 
                        onChange={(e) => { setOption(e.target.value); }} 
                        value={option}
                        style={{ width: width ? width : '190px' }}
                    >
                        {options.map((op: any, index: any) => (
                            <option key={index} value={index}>{op}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Select;
