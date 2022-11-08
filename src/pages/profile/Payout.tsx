import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Dialog from "../../components/general/dialog"
import Button from "../../components/general/button"
import { BackIcon, StripeIcon, SpreadIcon } from "../../assets/svg"
import "../../assets/styles/profile/PayoutStyle.scss"

const Payout = () => {
    const navigate = useNavigate()
    const [openConnectStripe, setOpenConnectStripe] = useState(false)

    return (
        <div className="payout-wrapper">
            <div className="page-header">
                <div onClick={() => navigate('/myaccount/setting')}><BackIcon color="black" /></div>
                <div className="page-title"><span>Payout</span></div>
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
                        <StripeIcon /><span>Stripe account</span>
                    </div>
                    <div className="payout-description">
                        <ul>
                            <li>Get paid direcly to local bank account</li>
                            <li>Processing fee: ~3.4% + 2.35HKD</li>
                        </ul>
                    </div>
                    <div className="payout-btn">
                        <Button
                            text="Connect"
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
                        <span>Alternative Payout Methods</span>
                    </div>
                    <div className="payout-description">
                        <ul>
                            <li>Let us know and we will get back within 24 hours.</li>
                        </ul>
                    </div>
                    <div className="payout-btn">
                        <Button
                            text="Contact Us"
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