import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { CheckOnIcon, CheckOffIcon, BackIcon } from "../../../assets/svg"
import { useSelector } from "react-redux"
import Button from "../../../components/general/button"
import CurrencySelect from "../../../components/stripe/CurrencySelect"
import { authAction } from "../../../redux/actions/authActions"
import { LanguageContext } from "../../../routes/authRoute"
import CONSTANT from "../../../constants/constant"
import "../../../assets/styles/profile/languageStyle.scss"

const LanguageCurrency = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)
  const { prevRoute } = loadState
  const { user } = userState
  const [lang, setLang] = useState(user ? user.language : 'EN')
  const [option, setOption] = useState(0)
  const contexts = useContext(LanguageContext)
  
  const saveSetting = () => {
    dispatch(authAction.setLanguageCurrency(lang, CONSTANT.CURRENCIES[option].toLowerCase(), navigate))
  }

  useEffect(() => {
    if (user) {
      const foundIndex = CONSTANT.CURRENCIES.findIndex((currency) => currency.toLowerCase() === user.currency)
      setOption(foundIndex)
    }
  }, [user])

  return (
    <div className="lang-currency-wrapper">
      <div className="page-header">
        <div onClick={() => navigate(prevRoute)}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.SIDEMENU.LANGUAGE_CURRENCY}</span></div>
        <div style={{ width: '24px' }}></div>
      </div>
      {user &&
        <div className="lang-currency">
          <div className="lang-currency-title">
            <span>{contexts.LANG_CURRENCY.LANG_SETTING}</span>
          </div>
          <div className="lang-setting">
            <div className="language" onClick={() => setLang('EN')}>
              <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                {lang === 'EN' ? <CheckOnIcon color="#EFA058" /> : <CheckOffIcon color="#EFA058" />}
              </div>
              <label>{contexts.LANG_CURRENCY.ENGLISH}</label>
            </div>
            <div className="language" onClick={() => setLang('FR')}>
              <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                {lang === 'EN' ? <CheckOffIcon color="#EFA058" /> : <CheckOnIcon color="#EFA058" />}
              </div>
              <label>{contexts.LANG_CURRENCY.FRENCH}</label>
            </div>
          </div>
          <div className="lang-currency-title">
            <span>{contexts.LANG_CURRENCY.CURRENCY_SETTING}</span>
          </div>
          <div className="currency-setting">
            <CurrencySelect
              options={contexts.DISPLAY_CURRENCIES}
              option={option}
              setOption={setOption}
              width={'100%'}
              label={contexts.LANG_CURRENCY.CURRECNY_DESC}
            />
          </div>
          <div className="buttons">
            <Button
              text={contexts.GENERAL.CANCEL}
              fillStyle="outline"
              color="primary"
              shape="rounded"
              width={'100px'}
              handleSubmit={() => navigate(prevRoute)}
            />
            <Button
              text={contexts.GENERAL.SAVE}
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
