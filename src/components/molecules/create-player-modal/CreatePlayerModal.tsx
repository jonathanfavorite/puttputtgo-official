import React, { useContext, useEffect, useState } from 'react'
import StyleHelper from '../../../helpers/StyleHelper'
import { PlayerContext, formatRGBToCSS } from '../../../contexts/PlayerContext'
import RGBModel from '../../../models/color/RGBModel'
import PlayerModel from '../../../models/player/PlayerModel'
import { GameContext } from '../../../contexts/GameContext'
import { Icons } from '../../atoms/Icons'

interface IProps {
  closeModal: () => void,
  chosenColors: RGBModel[],
  chosenAvatarIndexs: number[],
  onCreatedPlayer: (player: PlayerModel) => void
}

enum Gender {
  MALE = 0,
  FEMALE = 1
}

const avatarGenders = [
  {id: 0, gender: Gender.MALE},
  {id: 1, gender: Gender.MALE},
  {id: 2, gender: Gender.MALE},
  {id: 3, gender: Gender.MALE},
  {id: 4, gender: Gender.FEMALE},
  {id: 5, gender: Gender.FEMALE},
  {id: 6, gender: Gender.FEMALE},
  {id: 7, gender: Gender.FEMALE},
]

function CreatePlayerModal (props: IProps) {
  const _playerContext = useContext(PlayerContext)
  const _gameContext = useContext(GameContext)

  const [newName, setNewName] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<RGBModel>({
    name: 'unknown',
    r: 0,
    g: 0,
    b: 0
  })
  const [toggleColorDropdown, setToggleColorDropdown] = useState<boolean>(false)
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number>(0);
  const [selectedGender, setSelectedGender] = useState<Gender>(Gender.MALE);

  useEffect(() => {
    // make selectedColor the first color in the list not in props.choseColors
    console.log(props);
    let firstAvailableColor = preDefinedColors.find(color => {
      return !props.chosenColors.some(c => c.name === color.name)
    })
    if (firstAvailableColor) {
      setSelectedColor(firstAvailableColor)
    }

    let firstAvailableAvatarIndex = avatarGenders.find(avatar => {
      return !props.chosenAvatarIndexs.some(c => c === avatar.id)
    }
    )
    if (firstAvailableAvatarIndex) {
      setSelectedAvatarIndex(firstAvailableAvatarIndex.id)
    }
  }, []);



  const getAvailableColors = () => {
    return preDefinedColors.filter(color => {
      return !props.chosenColors.some(c => c.name === color.name)
    })
  }

  const isAvatarAvailable = (avatarIndex: number) => {
    return !props.chosenAvatarIndexs.some(c => c === avatarIndex)
  }


  const preDefinedColors: RGBModel[] = [
    { name: 'red', r: 255, g: 0, b: 0 },
    { name: 'yellow', r: 255, g: 255, b: 0 },
    { name: 'green', r: 0, g: 255, b: 0 },
    { name: 'blue', r: 0, g: 0, b: 255 },
    { name: 'white', r: 255, g: 255, b: 255 },
    { name: 'purple', r: 128, g: 0, b: 128 },
    { name: 'black', r: 0, g: 0, b: 0 },
    { name: 'teal', r: 0, g: 128, b: 128 },
    { name: 'lime_green', r: 50, g: 205, b: 50 },
    { name: 'orange', r: 255, g: 165, b: 0 },
    { name: 'dark_blue', r: 0, g: 0, b: 139 },
    { name: 'pink', r: 255, g: 192, b: 203 }
  ]

  const handleColorPicker = (color: RGBModel) => {
    setSelectedColor(color)
  }

  const handleNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value)
  }

  const handleConfirmPlayerButton = () => {
    if (selectedColor.name === 'unknown') {
      alert('Please select a color for the player')
      return
    }
    if (newName.length === 0) {
      alert('Please enter a name for the player')
      return
    }
    const newPlayer: PlayerModel = {
      id: Math.floor(Math.random() * 100000),
      name: newName,
      color: selectedColor,
      avatarIndex: selectedAvatarIndex
    }
    _playerContext.addPlayer(newPlayer)
    setNewName('')
    setSelectedColor({ name: 'unknown', r: 0, g: 0, b: 0 })
    props.onCreatedPlayer(newPlayer)
    props.closeModal()
  }

  const handleAvatarSelected = (avatarIndex: number) => {
    if(isAvatarAvailable(avatarIndex))
    {
      setSelectedAvatarIndex(avatarIndex);
    }
  }

  return (
    <div className='create-game-modal'>
      <div className='modal-content'>
        <div className='content'>
          <div
            className='close'
            onClick={props.closeModal}
            style={{
              backgroundImage: StyleHelper.format_css_url(
                _gameContext.getAssetByID('close-create-modal-button')
              )
            }}
          ></div>

          <div className='heading'>
            {_gameContext.getPlainTextByID('add-player:title')}
          </div>
          <div className='name-input'>
            <input
              type='text'
              value={newName}
              onChange={handleNewNameChange}
              placeholder={_gameContext.getPlainTextByID('add-player:input')}
            />
          </div>
          <div className='heading choices-wrap'>
            <div className='choose-color-wrap'>
              <div className='choose-color-text'>
                {/* {_gameContext.getPlainTextByID("add-player:choose-color")} */}
                ball color
              </div>
              <div className='choose-color-dropdown'>
                <div className='selected-color-wrap' onClick={() => setToggleColorDropdown(old => !old)}>
                  <div
                    className='selected-color'
                    style={{
                      backgroundColor: formatRGBToCSS(selectedColor, 1)
                    }}
                  >
                    <div
                      className='selected-frame'
                      style={{
                        backgroundImage: StyleHelper.format_css_url(
                          _gameContext.getAssetByID(
                            'gameplay-player-ball-frame'
                          )
                        )
                      }}
                    ></div>
                  </div>

                  {toggleColorDropdown && <div className='all-colors-dropdown-wrap'>
                    <div className='all-colors-inside-wrap'>
                      {getAvailableColors().map((item, index) => {
                        return (
                          <div
                            className='all-color-indi'
                            onClick={() => handleColorPicker(item)}
                            style={{
                              backgroundColor: formatRGBToCSS(item, 1)
                            }}
                          >
                            &nbsp;
                          </div>
                        )
                      })}
                    </div>
                  </div>}


                </div>
              </div>
            </div>
          </div>

          <div className='heading gender-wrap'>
              <div className='gender-switch'>
                <div className={`switch male ${selectedGender == Gender.MALE ? 'selected': ''}`} onClick={() => setSelectedGender(old => Gender.MALE)}>male</div>
                <div className={`switch female ${selectedGender == Gender.FEMALE ? 'selected': ''}`} onClick={() => setSelectedGender(old => Gender.FEMALE)}>female</div>
              </div>
            </div>

          <div className='avatar-wrap'>
            <div className='avatar-container'>
              {avatarGenders.filter(x => x.gender == selectedGender).map((avatar, index) => {
                const backgrounPosition = StyleHelper.getProfilePictureAtIndex(avatar.id);
                let trueClass = '';
                let taken = false;
                let selected = false;
                if(!isAvatarAvailable(avatar.id))
                {
                  trueClass = 'taken';
                  taken = true;
                }
                if(selectedAvatarIndex == avatar.id)
                {
                  selected = true;
                }
               
                return <div
                key={index}
                className={`avatar-indi ${taken ? 'taken' : ''}`}
                onClick={() => handleAvatarSelected(avatar.id)}
                style={{
                  backgroundImage: StyleHelper.format_css_url(
                    _gameContext.getAssetByID('avatar-sprites')
                  ),
                  backgroundPosition: backgrounPosition,
                  backgroundColor: formatRGBToCSS(selectedColor, 1)
                }}
              >
                <div
                  className='avatar-frame'
                  style={{
                    backgroundImage: StyleHelper.format_css_url(
                      _gameContext.getAssetByID('gameplay-player-ball-frame')
                    )
                  }}
                ></div>
                {selected && <>
                  <div className='avatar-selected'>
                    <div className='check'><Icons.Camera_Check /></div>
                  </div>
                </>}
                {taken && <>
                  <div className='avatar-taken'>
                    <div className='taken'>taken</div>
                  </div>
                </>}
              </div>
              })}
              
            </div>
          </div>

          {/* <div className="color-picker">
                {preDefinedColors.map((color, index) => {
                  return <div className={`color ${selectedColor.name === color.name ? 'active-color' : ''}`} key={index} onClick={() => handleColorPicker(color)} style={{
                    
                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                        backgroundColor: formatRGBToCSS(color, 1)
                  }}></div>
                })}
              </div> */}

          <div
            className='confirm-button'
            onClick={handleConfirmPlayerButton}
            style={{
              backgroundImage: `url(${
                _gameContext.getAssetByID('confirm-player-button')
                  ?.assetLocation
              })`
            }}
          >
            {_gameContext.getPlainTextByID('add-player:confirm')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePlayerModal
