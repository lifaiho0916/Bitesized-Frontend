import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { CheckOnIcon, CheckOffIcon, BackIcon } from "../../../assets/svg"
import { useSelector } from "react-redux"
import Button from "../../../components/general/button"
import CurrencySelect from "../../../components/stripe/CurrencySelect"
import { authAction } from "../../../redux/actions/authActions"
import { LanguageContext } from "../../../routes/authRoute"
import "../../../assets/styles/profile/languageStyle.scss"

const currencies = ['USD - US Dollar', 'INR - Indian Rupee', 'TWD - New Taiwan Dollar', 'HKD - Hong Kong Dollar', 'MYR - Malaysian Ringgit']
const currenciesLowercase = ['usd', 'inr', 'twd', 'hkd', 'myr']

const LanguageCurrency = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)
  const contexts = useContext(LanguageContext)
  const { prevRoute } = loadState
  const { user } = userState
  const [lang, setLang] = useState(user ? user.language : 'EN')
  const [option, setOption] = useState(0)
  
  const saveSetting = () => {
    dispatch(authAction.setLanguageCurrency(lang, currenciesLowercase[option], navigate))
  }

  useEffect(() => {
    if (user) {
      const foundIndex = currenciesLowercase.findIndex((currency) => currency === user.currency)
      setOption(foundIndex)
    }
  }, [user])

  return (
    <div className="lang-currency-wrapper">
      <div className="page-header">
        <div onClick={() => navigate(prevRoute)}><BackIcon color="black" /></div>
        <div className="page-title"><span>Language and Currency</span></div>
        <div style={{ width: '24px' }}></div>
      </div>
      {user &&
        <div className="lang-currency">
          <div className="lang-currency-title">
            <span>Language Settings</span>
          </div>
          <div className="lang-setting">
            <div className="language" onClick={() => setLang('EN')}>
              <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                {lang === 'EN' ? <CheckOnIcon color="#EFA058" /> : <CheckOffIcon color="#EFA058" />}
              </div>
              <label>English</label>
            </div>
            <div className="language" onClick={() => setLang('CH')}>
              <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                {lang === 'EN' ? <CheckOffIcon color="#EFA058" /> : <CheckOnIcon color="#EFA058" />}
              </div>
              <label>繁體中文</label>
            </div>
          </div>
          <div className="lang-currency-title">
            <span>Currency Settings</span>
          </div>
          <div className="currency-setting">
            <CurrencySelect
              options={currencies}
              option={option}
              setOption={setOption}
              width={'100%'}
              label="Select the currency you want to shop with."
            />
          </div>
          <div className="buttons">
            <Button
              text="Cancel"
              fillStyle="outline"
              color="primary"
              shape="rounded"
              width={'100px'}
              handleSubmit={() => navigate(prevRoute)}
            />
            <Button
              text="Save Changes"
              fillStyle="fill"
              color="primary"
              shape="rounded"
              width={'100px'}
              handleSubmit={saveSetting}
            />
          </div>
        </div>
      }
    </div>
  )
}

export default LanguageCurrency
