import React, {useContext} from 'react'
import './TextBasedHeader.scss';
import StyleHelper from '../../../../helpers/StyleHelper'
import {GameContext} from '../../../../contexts/GameContext';
import { useNavigate } from 'react-router-dom';

interface IProps {
    backButtonEvent?: () => void;
}
function TextBasedHeader(props : IProps) {
    const _gameContext = useContext(GameContext);
    const navigate = useNavigate();
    
    const handleBackButtonClick = () => {
        if(props.backButtonEvent) {
            props.backButtonEvent();
        }
        else{
            navigate(`/${_gameContext.companyData.customerID == "default" ? "" : _gameContext.companyData.customerID}`);
        }
    };
    return (
        <div className='text-based-header'
            style={
                {
                    backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-header-background'))
                }
        }>
            <div className='left' onClick={handleBackButtonClick}>
                <div className='back-button'>
                    <img src={_gameContext.getAssetByID('back-button-1')?.assetLocation}/>
                </div>
            </div>
            <div className='center'>
                <div className='title'>
                    {
                    _gameContext.companyData.customerName
                }</div>
            </div>
            <div className='right'></div>
        </div>

    )
}

export default TextBasedHeader
