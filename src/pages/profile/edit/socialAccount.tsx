import axios from 'axios';
import { useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom';
import { BackIcon } from '../../../assets/svg';
import YoutubeBtn from "../../../assets/svg/youtube.svg"
import IgBtn from "../../../assets/svg/ig.svg"
import { LanguageContext } from '../../../routes/authRoute';
import { accountAction } from '../../../redux/actions/socialAccountActions';
import InstagramLogin from './InstagramLogin'
import '../../../assets/styles/profile/socialAccountStyle.scss';

const Socialaccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state: any) => state.auth);
  const accountState = useSelector((state: any) => state.account);
  const { account } = accountState;
  const { user } = userState;
  const contexts = useContext(LanguageContext)

  const hasYoutubeData: any = useMemo(() => {
    if (account && account.social && account.social.youtube) return true
    else return false
  }, [account]);

  const removeYoutube = () => { if(hasYoutubeData) dispatch(accountAction.removeAccount(account._id, "youtube"))}

  const CustomGoogleLogin = (props: any) => {
    const { contexts } = props
    const googleLogin = useGoogleLogin({
      onSuccess: async tokenResponse => {
        try {
          const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${tokenResponse.access_token}`
          const response = await axios.get(youtubeApiUrl)

          const data = {
            user: user.id,
            socialId: response.data.items[0].id,
            type: 'youtube',
          }

          dispatch(accountAction.addAccount(data))
        } catch (err) {
          alert("Your Google acount doesn't have any YouTube channels")
          console.log(err)
        }
      },
      onError: errorResponse => console.log(errorResponse),
      scope: 'https://www.googleapis.com/auth/youtube.readonly'
    })

    return (
      <div className='connect-btn' onClick={() => googleLogin()}>
        <span>{contexts.GENERAL.CONNECT}</span>
      </div>
    )
  }

  useEffect(() => { if (user) dispatch(accountAction.getAccount(user.id)) }, [dispatch, user])

  return (
    <div className='social-accounts-wrapper'>
      <div className='page-header'>
        <div onClick={() => navigate('/myaccount/edit')}>
          <BackIcon color='black' />
        </div>
        <div className='page-title'>
          <span>{contexts.SOCIAL.SOCIAL_ACCOUNTS}</span>
        </div>
        <div style={{ width: '24px' }}></div>
      </div>
      <div className='social-accounts'>
        <div className='socialaccounts'>
          <div className='content'>
            <div className='icon-title'>
              <div className='icon'>
                <img src={IgBtn} alt="igBtn" />
              </div>
              <div className='title'>Instagram</div>
            </div>
            <div className="btn">
              <InstagramLogin account={account} contexts={contexts} />
            </div>
          </div>
          <div className='content'>
            <div className='icon-title'>
              <div className='icon'>
                <img src={YoutubeBtn} alt="youtubeBtn" />
              </div>
              <div className='title'>Youtube</div>
            </div>
            <div className='btn'>
              {hasYoutubeData ? (
                <div className='remove-btn' onClick={removeYoutube}>
                  <span>Remove</span>
                </div>
              ) : (
                <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
                  <CustomGoogleLogin contexts={contexts} />
                </GoogleOAuthProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Socialaccount;
