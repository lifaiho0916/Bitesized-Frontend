import axios from 'axios';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BackIcon, InstagramIcon, YoutubeIcon } from '../../../assets/svg';
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

  useEffect(() => {
    if (user) dispatch(accountAction.getAccounts(user.id));
  }, [dispatch, user]);

  const responseGoogleSuccess = async (response: any) => {
    try {
      const access_token = response.accessToken;
      const youtubeApiUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${access_token}&key=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;
      const response1 = await axios.get(youtubeApiUrl);
      const data = {
        id: response1.data.items[0].id,
        name: 'youtube',
        metadata: JSON.stringify(response1.data.items),
      };
      dispatch(accountAction.addAccount(data));
    } catch (err) {
      console.log(err);
    }
  };

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
                <InstagramIcon color='#EFA058' />
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
                <YoutubeIcon color='#EFA058' />
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
                // <GoogleLogin
                //   clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                //   render={(renderProps) => (
                    <div className='connect-btn'>
                      <span>Connect</span>
                    </div>
                //   )}
                //   onSuccess={responseGoogleSuccess}
                //   cookiePolicy={'single_host_origin'}
                //   scope='https://www.googleapis.com/auth/youtube.readonly'
                // />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Socialaccount;
