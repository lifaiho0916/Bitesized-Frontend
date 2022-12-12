import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import Dialog from "../../components/general/dialog"
import Button from "../../components/general/button"
import { LanguageContext } from "../../routes/authRoute"
import { BackIcon, StripeIcon, SpreadIcon } from "../../assets/svg"
import "../../assets/styles/profile/PayoutStyle.scss"

const Payout = () => {
    const navigate = useNavigate()
    const [openConnectStripe, setOpenConnectStripe] = useState(false)
    const contexts = useContext(LanguageContext)

    return (
        <div className="payout-wrapper">
            <div className="page-header">
                <div onClick={() => navigate('/myaccount/setting')}><BackIcon color="black" /></div>
                <div className="page-title"><span>{contexts.PAYOUT.PAYOUT}</span></div>
                <div style={{ width: '24px' }}></div>
            </div>
            <Dialog
                display={openConnectStripe}
                wrapExit={() => setOpenConnectStripe(false)}
                exit={() => setOpenConnectStripe(false)}
                title="Stay tuned!"
                context={"We will be launching this\nfeature soon."}
                icon={{
                    pos: 1,
                    icon: <SpreadIcon color="#EFA058" width="60px" height="60px" />
                }}
            />
            <div className="payout-main">
                <div className="payout-form">
                    <div className="payout-title">
                        <StripeIcon /><span>{contexts.PAYOUT.STRIPE_ACCOUNT}</span>
                    </div>
                    <div className="payout-description">
                        <ul>
                            <li>{contexts.PAYOUT.STRIPE_DESC1}</li>
                            <li>{contexts.PAYOUT.STRIPE_DESC2}</li>
                        </ul>
                    </div>
                    <div className="payout-btn">
                        <Button
                            text={contexts.GENERAL.CONNECT}
                            fillStyle="fill"
                            color="primary"
                            width="270px"
                            shape="rounded"
                            handleSubmit={() => setOpenConnectStripe(true)}
                        />
                    </div>
                </div>
                <div className="payout-form" style={{ marginTop: '25px' }}>
                    <div className="payout-title">
                        <span>{contexts.PAYOUT.ALTER_PAYOUT}</span>
                    </div>
                    <div className="payout-description">
                        <ul>
                            <li>{contexts.PAYOUT.ALTER_DESC1}</li>
                        </ul>
                    </div>
                    <div className="payout-btn">
                        <Button
                            text={contexts.PAYOUT.CONTACT_US}
                            fillStyle="fill"
                            color="primary"
                            width="270px"
                            shape="rounded"
                            handleSubmit={() => { window.open("https://www.creatogether.app/altpayout", '_blank') }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payout