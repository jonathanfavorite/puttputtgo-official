import React, { Fragment, useContext, useEffect } from 'react'
import './ProfileScreen.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { SignUpRegisterContext } from '../../../contexts/SignUpRegisterContext';
import { GameContext } from '../../../contexts/GameContext';
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC';
import StyleHelper from '../../../helpers/StyleHelper';
import { Icons } from '../../atoms/Icons';
import DateHelper from '../../../helpers/DateHelper';
import QRCode from 'react-qr-code';
import ProfilePictureModal from '../../molecules/profile-picture-modal/ProfilePictureModal';

function ProfileScreen() {
    const _gameContext = useContext(GameContext);
    const {business_name} = useParams();
    const _signupContext = useContext(SignUpRegisterContext);
    const navigate = useNavigate();
    const [completelyLoaded, setCompletelyLoaded] = React.useState(false);
    const [showQRModal, setShowQRModal] = React.useState(false);
    const [profileImageFile, setProfileImageFile] = React.useState<File | null>(null);
    const fileUploadRef = React.useRef<HTMLInputElement>(null);
    const [showProfilePictureModal, setShowProfilePictureModal] = React.useState(false);

    const handleBackButtonClick = () => {
        navigate(`/${business_name}`);
    }
    const formatDateYearAndMonth = (dateString: string) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let d = new Date(dateString);
        let month = monthNames[d.getMonth()]; // getMonth() returns a zero-based value (0 for January, 1 for February, etc.)
        let year = d.getFullYear();

        return `${month} ${year}`.toLowerCase();
    }

    useEffect(() => {
        if(_signupContext.finishedLoadingUserFromLocalStorage)
        {
      
            setCompletelyLoaded(true);
        }
    }, [_signupContext.finishedLoadingUserFromLocalStorage]);

    const handleLogoutButton = () => {
        _signupContext.logout();
        navigate(`/${business_name}`);
    }

    const handleRefreshEvent = () => {
        _signupContext.getRewards(_signupContext.signedInUser!.user.UserKey!);
    }

    const getRewardQRValue = () => {
        let payload = {
            name: _signupContext.signedInUser!.user.Name,
            userKey: _signupContext.signedInUser!.user.UserKey,
        }
        return JSON.stringify(payload);
    }

    const handleCloseQRModal = () => {
        setShowQRModal(false);
    }
    
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0)
        {
            setShowProfilePictureModal(true);
            setProfileImageFile(e.target.files[0]);
        }
    }

    const triggerFileUpload = () => {
        if(fileUploadRef.current)
        {
            fileUploadRef.current.click();
        }
    }

    const handleUploadPictureClose = () => {
        setShowProfilePictureModal(false);
        setProfileImageFile(null);
    }

  return (
    <DataAssuranceHOC companyParam={
        business_name !
    }>
{showProfilePictureModal && <ProfilePictureModal onClose={handleUploadPictureClose} pictureData={profileImageFile} />}

        <div className='profile-screen-container'>
        {!completelyLoaded ? "loading" : <>
        <div className='header' style={{
           
           backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID("profile-background"))
        }}>

       {showQRModal && <div className='profile-qr-scan-wrap'>
            <div className='profile-qr-scan-content'>
                <div className='profile-qr-scan-box'>
                <QRCode value={getRewardQRValue()} />
                </div>
                <div className='qr-scan-text'>let {_gameContext.companyData.customerName} scan your id here</div>
                <div className='qr-scan-close'>
                    <div className='close-button' onClick={handleCloseQRModal}>Close</div>
                </div>
            </div>
        </div>}

        

        <div className='_top-bar'>
            <div className='_left' onClick={handleBackButtonClick}>
                <div className='back'><Icons.Back /></div>
            </div>
            <div className='_middle'>
                <div className='logo'>
                    <Icons.PPG_Logo color='#fff' />
                </div>
            </div>
            <div className='_right'>
                <div className='logout-button' onClick={handleLogoutButton}>logout</div>
            </div>
            
        </div>

        <div className='profile-detail-structure-wrap'>
        <div className='profile-details-wrap'>
            <div className='profile-image-wrap'>
                <div className='profile-image'>
                    <div className='upload-picture-button' onClick={triggerFileUpload}>upload<br />profile picture</div>
                    <input type='file' ref={fileUploadRef} onChange={handleFileUpload} />
                </div>
            </div>
            <div className='profile-description-wrap'>
                <div className='username'>{_signupContext.signedInUser?.user.Username}</div>
                <div className='joined-at'>joined {formatDateYearAndMonth(_signupContext.signedInUser!.user.CreatedDate!.toString())}</div>
            </div>
        </div>
        </div>
        <div className="trans-bottom"></div>
        </div>

        <div className='spacer'>
           
        </div>

        <div className='reward-id-button-wrap'>
                <div className='reward-id-button' onClick={() => setShowQRModal(true)}>reward id card</div>
            </div>

        <div className="content-main-container">
            <div className='top-trans'></div>
        <div className='large-loader' style={{
            display: _signupContext.loadingRewards ? 'flex' : 'none'
        }}
        >
            <div className='spinner'><Icons.Gallery_Spinner /></div>
            </div>
            <div className='content-main'>
                <div className='empty-top-space'></div>
                {/* {Array.from(Array(50).keys()).map((item, index) => {
                    return <p>hey</p>
                })} */}

                <div className='refresh-button' onClick={handleRefreshEvent}>{_signupContext.loadingRewards ? 'loading' : 'refresh'}</div>
                <div className='rewards-container-wrap'>

                    {
                        _signupContext.allUserRewards?.rewardsByCompany &&
                        Object.entries(_signupContext.allUserRewards.rewardsByCompany).map(([companyKey, companyRewards], index) => {
                            // return (
                            //     <div key={index}>
                            //         <h3>{companyKey}</h3>
                            //         {companyRewards.rewards.map((reward, rIndex) => (
                            //             <div key={rIndex}>
                            //                 {reward.description} - {reward.amount}
                            //             </div>
                            //         ))}
                            //     </div>
                            // );
                            return <Fragment key={index}>
                            <div className='reward-indi'>
                        <div className='reward-trans'></div>
                        <div className='reward-top' style={{
                        backgroundImage: StyleHelper.format_css_url_without_asset(`/global-assets/rewards/${companyKey}.jpg`)
                    }}>
                        <div className='darker-overlay'></div>
                            <div className='reward-customer'>
                                <div className='customer-name'>{companyKey}</div>
                                <div className='joined-on'>since {formatDateYearAndMonth(_signupContext.signedInUser!.user.CreatedDate!.toString())}</div>
                            </div>
                            <div className='reward-points-container'>
                                <div className='reward-points'>
                                    <div className='points'>{companyRewards.availableBalance}</div>
                                    <div className='points-label'>points</div>
                                </div>
                            </div>
                        </div>
                        <div className='reward-bottom'></div>
                    </div>
                    </Fragment>
                        })
                    }
{/* 
                    <div className='reward-indi'>
                        <div className='reward-trans'></div>
                        <div className='reward-top' style={{
                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID("welcome-background"))
                    }}>
                        <div className='darker-overlay'></div>
                            <div className='reward-customer'>
                                <div className='customer-name'>castle golf</div>
                                <div className='joined-on'>since {formatDateYearAndMonth(_signupContext.signedInUser!.user.CreatedDate!.toString())}</div>
                            </div>
                            <div className='reward-points-container'>
                                <div className='reward-points'>
                                    <div className='points'>100</div>
                                    <div className='points-label'>points</div>
                                </div>
                            </div>
                        </div>
                        <div className='reward-bottom'></div>
                    </div> */}



                </div>

            </div>
        </div>
        </>}
        </div>
      
    </DataAssuranceHOC>
  )
}

export default ProfileScreen