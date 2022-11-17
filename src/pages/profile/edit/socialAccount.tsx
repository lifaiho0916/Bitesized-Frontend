import axios from 'axios';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom';
import { BackIcon } from '../../../assets/svg';
import YoutubeBtn from "../../../assets/svg/youtube.svg"
import IgBtn from "../../../assets/svg/ig.svg"
import { accountAction } from '../../../redux/actions/socialAccountActions';
import InstagramLogin from './InstagramLogin'
import '../../../assets/styles/profile/socialAccountStyle.scss';

const Socialaccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state: any) => state.auth);
  const accountState = useSelector((state: any) => state.accounts);
  const { accounts } = accountState;
  const { user } = userState;

  const openConnectedYoutubeChannel = () => {
    const { id } = accounts.find((acc: any) => acc.name === 'youtube');
    window.open(`https://www.youtube.com/channel/${id}`);
  };

  const hasYoutubeData: any = useMemo(() => {
    if (accounts.length <= 0) return false;
    const d = accounts.find((acc: any) => acc.name === 'youtube');
    return d && Object.keys(d).length > 0;
  }, [accounts]);

  const removeYoutube = () => {
    const youtubeData = accounts.find((acc: any) => acc.name === 'youtube');
    if (youtubeData && Object.keys(youtubeData).length > 0) {
      dispatch(accountAction.removeAccount(youtubeData._id));
    }
  };

  // useEffect(() => { if (user) dispatch(accountAction.getAccounts(user.id)) }, [dispatch, user])

  const CustomGoogleLogin = (props: any) => {
    const googleLogin = useGoogleLogin({
      onSuccess: async tokenResponse => {
        try {
          // const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${access_token}&key=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;
          const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${tokenResponse.access_token}`
          const response = await axios.get(youtubeApiUrl)

          const data = {
            id: response.data.items[0].id,
            name: 'youtube',
            metadata: JSON.stringify(response.data.items)
          }

          window.open(`https://www.youtube.com/channel/${data.id}`)
          // dispatch(accountAction.addAccount(data))
        } catch (err) {
          console.log(err)
        }
      },
      onError: errorResponse => console.log(errorResponse),
      scope: 'https://www.googleapis.com/auth/youtube.readonly'
    })

    return (
      <div className='connect-btn' onClick={() => googleLogin()}>
        {/* <span>Connect</span> */}
        <img src={YoutubeBtn} alt="youtubeBtn" />
        {/* <span>Connect</span> */}
      </div>
    )
  }

  return (
    <div className='social-accounts-wrapper'>
      <div className='page-header'>
        <div onClick={() => navigate('/myaccount/edit')}>
          <BackIcon color='black' />
        </div>
        <div className='page-title'>
          <span>Social Accounts</span>
        </div>
        <div style={{ width: '24px' }}></div>
      </div>
      <div className='social-accounts'>
        <div className='socialaccounts'>
          <div className='content'>
            <div className='icon-title'>
              <div className='icon'>
                {/* <img src={IgBtn} alt="igBtn" /> */}
              </div>
              <div className='title'>Instagram</div>
            </div>
            <div className="btn">
              <InstagramLogin />
            </div>
          </div>
          <div className='content'>
            <div className='icon-title'>
              <div className='icon'>
                {/* <img src={YoutubeBtn} alt="youtubeBtn" /> */}
              </div>
              <div className='title'>Youtube</div>
            </div>
            {hasYoutubeData && (
              <div onClick={openConnectedYoutubeChannel}>View</div>
            )}
            <div className='btn'>
              {hasYoutubeData ? (
                <div className='remove-btn' onClick={removeYoutube}>
                  <span>Remove</span>
                </div>
              ) : (
                <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
                  <CustomGoogleLogin dispatch={dispatch} />
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
