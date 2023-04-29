import React, { useContext } from 'react'
import './CourseSelectionPage.scss'
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC'
import WelcomeTemplate from '../../templates/welcome-screen/WelcomeTemplate'
import { useNavigate, useParams } from 'react-router-dom';
import { GameContext } from '../../../contexts/GameContext';

function CourseSelectionPage() {
  const {business_name} = useParams();
  const _gameContext = useContext(GameContext);
  const navigate = useNavigate();

  const handleCourseClick = (courseID: number) => {
    _gameContext.updateSelectedCourseID(courseID);
    navigate('/create-game');
  };


  return (
    <DataAssuranceHOC companyParam={business_name!}>
        <WelcomeTemplate specifiedClass='course-selection-override'>
            <div className='course-selection-page'>
               <div className='body'>
                    <div className='course-selection-buttons'>
                        {_gameContext.companyData.courses.map((course, index) => {
                            return (
                                <div className='button' key={index} onClick={() => handleCourseClick(course.ID)}>
                                    <img src={course.image} />
                                </div>
                            );
                        })}
                      </div>
                </div>
               <div className='rules-footer'>
                    <img src={_gameContext.getAssetByID("welcome-back-button")?.assetLocation} onClick={() => navigate("/")} />
                </div>
            </div>
        </WelcomeTemplate>
      </DataAssuranceHOC>
  )
}

export default CourseSelectionPage