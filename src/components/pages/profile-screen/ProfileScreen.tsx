import React, { useContext } from 'react'
import './ProfileScreen.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { SignUpRegisterContext } from '../../../contexts/SignUpRegisterContext';
import { GameContext } from '../../../contexts/GameContext';
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC';
import StyleHelper from '../../../helpers/StyleHelper';
import { Icons } from '../../atoms/Icons';
import DateHelper from '../../../helpers/DateHelper';

function ProfileScreen() {
    const _gameContext = useContext(GameContext);
    const {business_name} = useParams();
    const _signupContext = useContext(SignUpRegisterContext);
    const navigate = useNavigate();

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

    const handleLogoutButton = () => {
        _signupContext.logout();
        navigate(`/${business_name}`);
    }
    
  return (
    <DataAssuranceHOC companyParam={
        business_name !
    }>

        <div className='profile-screen-container'>

        <div className='header' style={{
           
           backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID("profile-background"))
        }}>
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
                    <div className='upload-picture-button'>upload<br />profile picture</div>
                </div>
            </div>
            <div className='profile-description-wrap'>
                <div className='username'>{_signupContext.signedInUser?.user.Username}</div>
                <div className='joined-at'>joined {formatDateYearAndMonth(_signupContext.signedInUser!.user.CreatedDate!.toString())}</div>
                {/* <div className='rewards-points'>
                    <div className='points'>go-points</div>
                    <div className='points-count'>123</div>
                </div>
                <div className='games-played'>12 games played</div> */}
            </div>
        </div>
        </div>

           

        <div className="trans-bottom"></div>
        </div>

        </div>
      
    </DataAssuranceHOC>
  )
}

export default ProfileScreen