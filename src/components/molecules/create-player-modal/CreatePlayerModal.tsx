import React, { useContext, useState } from 'react'
import StyleHelper from '../../../helpers/StyleHelper'
import { PlayerContext, formatRGBToCSS } from '../../../contexts/PlayerContext';
import RGBModel from '../../../models/color/RGBModel';
import PlayerModel from '../../../models/player/PlayerModel';
import { GameContext } from '../../../contexts/GameContext';

interface IProps {
    closeModal: () => void;
}
function CreatePlayerModal(props: IProps) {

    const _playerContext = useContext(PlayerContext);
    const _gameContext = useContext(GameContext);

    const [newName, setNewName] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<RGBModel>({name: 'unknown', r: 0, g: 0, b: 0});
    
    const preDefinedColors: RGBModel[] = [
        { name: "red", r: 255, g: 0, b: 0 },
        { name: "yellow", r: 255, g: 255, b: 0 },
        { name: "green", r: 0, g: 255, b: 0 },
        { name: "blue", r: 0, g: 0, b: 255 },
        { name: "white", r: 255, g: 255, b: 255 },
        { name: "purple", r: 128, g: 0, b: 128 },
        { name: "black", r: 0, g: 0, b: 0 },
        { name: "teal", r: 0, g: 128, b: 128 },
        { name: "lime_green", r: 50, g: 205, b: 50 },
        { name: "orange", r: 255, g: 165, b: 0 },
        { name: "dark_blue", r: 0, g: 0, b: 139 },
        { name: "pink", r: 255, g: 192, b: 203 },
      ];

    const handleColorPicker = (color: RGBModel) => {
        setSelectedColor(color);
      }
    
      const handleNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(event.target.value);
      }

      const handleConfirmPlayerButton = () => {

        if(selectedColor.name == "unknown")
        {
            alert("Please select a color for the player");
            return;
        }
        if(newName.length == 0)
        {
            alert("Please enter a name for the player");
            return;
        }
        const newPlayer: PlayerModel = {
            id: Math.floor(Math.random() * 100000),
            name: newName,
            color: selectedColor
          }
          _playerContext.addPlayer(newPlayer);
          setNewName("");
          setSelectedColor({name: 'unknown', r: 0, g: 0, b: 0});
          props.closeModal();
      };


  return (
    <div className="create-game-modal">
        <div className="modal-content">
            <div className="content">
              <div className="close"
              onClick={props.closeModal} style={{
                                  backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('close-create-modal-button'))
                               }}>
              </div>

              <div className="heading">
                  {_gameContext.getPlainTextByID("add-player:title")}
              </div>
              <div className="name-input">
                  <input type="text" value={newName} onChange={handleNewNameChange} placeholder={_gameContext.getPlainTextByID("add-player:input")} />
              </div>
              <div className="heading">
              {_gameContext.getPlainTextByID("add-player:choose-color")}
              </div>

              <div className="color-picker">
                {preDefinedColors.map((color, index) => {
                  return <div className={`color ${selectedColor.name == color.name ? 'active-color' : ''}`} key={index} onClick={() => handleColorPicker(color)} style={{
                    
                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                        backgroundColor: formatRGBToCSS(color, 1)
                  }}></div>
                })}
              </div>

              <div className="confirm-button" onClick={handleConfirmPlayerButton}
            style={{
              backgroundImage: `url(${
                _gameContext.getAssetByID("confirm-player-button")
                  ?.assetLocation
              })`,
            }}>
                   {_gameContext.getPlainTextByID("add-player:confirm")}
              </div>

            </div>
        </div>
      </div>
  )
}

export default CreatePlayerModal