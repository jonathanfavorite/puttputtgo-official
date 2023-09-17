import React, {Fragment, useContext, useEffect, useRef, useState} from 'react'
import './ResultsPage.scss';
import ConfettiCanvas from './confettiCanvas';

import {GameContext, GameStatus} from '../../../contexts/GameContext';
import StyleHelper from '../../../helpers/StyleHelper';
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC';
import {useNavigate, useParams} from 'react-router-dom';
import {PlayerContext, formatRGBToCSS} from '../../../contexts/PlayerContext';
import {ScoreContext} from '../../../contexts/ScoreContext';
import LeaderboardModel from '../../../models/score/LeaderboardModel';
import {CourseContext} from '../../../contexts/CourseContext';
import ScoreHelper from '../../../helpers/ScoreHelper';

import PlayerModel from '../../../models/player/PlayerModel';
import ScoreModel from '../../../models/score/ScoreModel';
import LocalStoragePreloader from '../../loadings/local-storage-preloader/LocalStoragePreloader';
import { Helmet } from 'react-helmet-async';
import ShareGames from '../../molecules/share-games/ShareGames';
import { BestWorstHole, TrueResults } from '../../../models/results/ResultModels';
import ResultType from '../../../models/results/ResultType';
import WinnerStraight from '../../molecules/results/winner-straight/WinnerStraight';
import WinnerTie from '../../molecules/results/winner-tie/WinnerTie';
import GroupComparison from '../../molecules/results/group-comparison/GroupComparison';
import BestWorseHoles from '../../molecules/results/best-worse-holes/BestWorseHoles';
import PerformanceChart from '../../molecules/results/performance-chart/PerformanceChart';
import SnapGallery from '../../molecules/results/snap-gallery/SnapGallery';


function ResultsPage() {
    const _gameContext = useContext(GameContext);
    const _playerContext = useContext(PlayerContext);
    const _courseContext = useContext(CourseContext);
    const _scoreContext = useContext(ScoreContext);
    const [trueResults, setTrueResults] = useState<TrueResults | null>(null);
    const {business_name} = useParams();
    const navigate = useNavigate();


    const [completelyLoaded, setCompletelyLoaded] = useState<boolean>(false);



    const GetFirstPlacePlayer = () : LeaderboardModel => {
        return _scoreContext.getAllPlayersScores()[0];
    }

    const GetTrueResults = () : TrueResults => {
        let ties = GetTies();
        let results: TrueResults = {
            trueFirstPlace: _scoreContext.getAllPlayersScores()[0],
            ties: GetTies(),
            type: ties.length > 1 ? ResultType.Tie : ResultType.Straight
        }
        return results;
    }

    const GetTies =() : LeaderboardModel[] => {
        let firstPlayer = _scoreContext.getAllPlayersScores()[0];
        let tmp: LeaderboardModel[] = [
            firstPlayer
        ];

        _scoreContext.getAllPlayersScores().forEach((score, index) => {
            if (index !== 0) {
                if (score.score === firstPlayer.score) {
                    tmp.push(score);
                }
            }
        });

        return tmp;
    };



    // const [performanceData, setPerformanceData] = useState<PerformanceData[] | null>(null)
    // const [flatPerformanceData, setFlatPerformanceData] = useState<any[]>([]);


    const [flatPerformanceData, setFlatPerformanceData] = useState<any[]>([]);
    const [playerColors, setPlayerColors] = useState<{ [key: string]: string }>({});



    const [bestWorstHole, setBestWorstHole] = useState < BestWorstHole | null > (null);

    const MAX_SCORE = 54;
    
    useEffect(() => {

        if(_gameContext.preloadedLocalStorage) {

        setTrueResults(GetTrueResults());

        _gameContext.updateactivePage("results");

        _gameContext.updateGameStatus(GameStatus.Finished);

        let flatData: any[] = [];
    let playerColors: { [key: string]: string } = {}; // To store the color of each player

    const players = _playerContext.getAllPlayers();
    const holes = _courseContext.getCurrentCourse().holes;

    players.forEach(player => {
        // Add player's color to playerColors object
        const rgb = `rgb(${player.color!.r}, ${player.color!.g}, ${player.color!.b})`;
        playerColors[`player${player.id}`] = rgb;
    });

    // Get the maximum total score at the end of the game
    let maxTotalScore = Math.max(...players.map(player => _scoreContext.getRunningScoresByHoleAndPlayer(player.id, holes.length)));

    holes.forEach((hole, index) => {
        let dataPoint: any = { holeIndex: holes.length - index }; // Subtract the index from the total number of holes to get the reverse order

        players.forEach(player => {
            // Get the 'flipped' score by subtracting the player's score from the maximum total score
            let score = maxTotalScore - _scoreContext.getRunningScoresByHoleAndPlayer(player.id, holes.length - index);
            dataPoint[`player${player.id}`] = score;
        });

        // Push data point into array
        flatData.push(dataPoint);
    });


    
    setBestWorstHole(findBestWorstHole());

    setFlatPerformanceData(flatData);
    setPlayerColors(playerColors);

}
    }, [_gameContext.preloadedLocalStorage]);


    const findBestWorstHole = () : BestWorstHole => {

    const holes = _courseContext.getCurrentCourse().holes;
    const players = _playerContext.getAllPlayers();

    let bestHole = 0;
    let bestPar = 0;
    let bestAvg = Infinity;  // initialize to Infinity

    let worstHole = 0;
    let worstPar = 0;
    let worstAvg = -Infinity;  // initialize to -Infinity

    holes.forEach((hole, index) => {
        let holeScores = players.map(player => _scoreContext.getScoreByHoleAndPlayer(hole.number, player.id));
        let holePar = hole.par;
        let holeAvg = holeScores.reduce((a, b) => a + b, 0) / holeScores.length;

        if(holeAvg < bestAvg) {
            bestHole = index + 1;
            bestPar = holePar;
            bestAvg = holeAvg;
        }

        if(holeAvg > worstAvg) {
            worstHole = index + 1;
            worstPar = holePar;
            worstAvg = holeAvg;
        }
    });

        return {
            bestHole,
            bestPar,
            bestAvg,
            worstHole,
            worstPar,
            worstAvg
        }
    }


    const dummyData = [
        { holeIndex: 1, player1: 5, player2: 7, player3: 3, player4: 2 },
        { holeIndex: 2, player1: 7, player2: 2, player3: 4, player4: 2 },
        { holeIndex: 3, player1: 3, player2: 3, player3: 3, player4: 4 },
        { holeIndex: 4, player1: 2, player2: 4, player3: 3, player4: 3 },
        { holeIndex: 5, player1: 3, player2: 5, player3: 2, player4: 2 },
        { holeIndex: 6, player1: 4, player2: 6, player3: 1, player4: 2 },
        { holeIndex: 7, player1: 4, player2: 6, player3: 4, player4: 3 },
        { holeIndex: 8, player1: 4, player2: 2, player3: 3, player4: 4 },
        { holeIndex: 9, player1: 3, player2: 2, player3: 5, player4: 2 },
        { holeIndex: 10, player1: 5, player2: 1, player3: 3, player4: 2 },
        
        
    ];



    


    const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);

    const handleSelectedFlagClicked = () => {
        setShowLanguageDropdown(!showLanguageDropdown);
    }
    const handleNewLanguageClicked = (locale: string) => {
        _gameContext.updateSelectedLanguage(locale);
        setShowLanguageDropdown(false);
    }


    interface HoleInOneData {
        holeInOnes: { hole: number; players: PlayerModel[] }[];
    }
    
    const getHoleInOnes = (): HoleInOneData => {
        let holeInOnes: { hole: number; players: PlayerModel[] }[] = [];
    
        _playerContext.getAllPlayers().forEach(player => {
            _courseContext.getCurrentCourse().holes.forEach(hole => {
                if (_scoreContext.getScoreByHoleAndPlayer(hole.number, player.id) === 1) {
                    let holeInOne = holeInOnes.find(hio => hio.hole === hole.number);
                    if (holeInOne) {
                        holeInOne.players.push(player);
                    } else {
                        holeInOnes.push({ hole: hole.number, players: [player] });
                    }
                }
            });
        });
    
        // Order the hole-in-ones
        holeInOnes.sort((a, b) => a.hole - b.hole);
    
        return {
            holeInOnes
        }
    };


    const gameURL = `https://www.puttputtgo.net/${_gameContext.companyData.customerID}/results?gameID=${_gameContext.gameID}`;
    const imageURL = `https://ppgstorageaccount.blob.core.windows.net/shareables/${_gameContext.companyData.customerID}-${_gameContext.gameID}.jpg`;
    const title = "Game Finished!";
    const description = "We just finished a game of Castle Golf! Check out our scores!";
    const site = "@puttputtgo";

    let showHoldInOnes = true;

    return (
       
        <DataAssuranceHOC companyParam={
            business_name ! ? business_name : "default"
        }>
             <Helmet>
             <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={description} />
                <meta name="keywords" content="puttputtgo, game, golf, results" />
                <meta name="author" content="[DATA]" />

                {/* Open Graph Meta Tags */}
                <meta property="fb:app_id" content="823028086097162" />
                <meta property="og:url" content={gameURL} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageURL} />
                <meta property="og:image:width" content="700" />
                <meta property="og:image:height" content="375" />

                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={site} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={imageURL} />
            </Helmet>
            

            {!_gameContext.preloadedLocalStorage && !completelyLoaded ? <LocalStoragePreloader /> :
            <div className='results-page'>

                <div className='header'>
                    <div className='left'
                        onClick={
                            () => navigate(`/${business_name ! ? business_name : ""}`)
                    }><span style={{
                            //backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID("results-back-button-background"))
                    }}>Menu</span></div>
                    <div className='center'></div>
                    <div className='right'>
                        
                        <div className='language-dropdown'>
                            <div className='selected-option' onClick={handleSelectedFlagClicked}> <img src={`/global-assets/flags/${_gameContext.selectedLanguage}.jpg`} /></div>
                            <div className='list' style={{
                                display: showLanguageDropdown ? 'flex' : 'none'
                            }}>
                        {
                           _gameContext.getLocalsByID("welcome:new-game").map((local, index) => {
                               return _gameContext.selectedLanguage != local.locale && <div className={`flag`} key={index} onClick={() => handleNewLanguageClicked(local.locale)}>
                                   <img src={`/global-assets/flags/${local.locale}.jpg`} />
                                   </div>
                           })
                       }
                       </div>
                        </div>
                        <ShareGames />


                    </div>

                </div>
                <div className='body'>
                    <div className='winner-top'
                        style={
                            {
                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID("results-background"))
                            }
                    }>
                        <div className='gradient'
                            style={
                                {
                                    backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID("results-gradient"))
                                }
                        }></div>


                        {trueResults && trueResults.type === ResultType.Straight && <WinnerStraight results={trueResults} />}

                        {trueResults && trueResults.type === ResultType.Tie && <WinnerTie results={trueResults} />}

                        


                        <div className='winner-text' dangerouslySetInnerHTML={_gameContext.getTextByID("results:bravo-golfer")}>
                            
                        </div>

                    </div>

                    <div className='results-content-wrapper'>

                        <div className='result-list content'>
                            <div className='result-list-header content-header'
                                style={
                                    {
                                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID("results-header"))
                                    }
                            }>
                                <div className='left'></div>
                                <div className='text'>{_gameContext.getPlainTextByID("results:results")}</div>
                                <div className='right'></div>

                            </div>
                            {
                            _scoreContext.getAllPlayersScores().map((score, index) => {

                                return <Fragment key={index}>

                                    <div className='list-item'
                                        style={
                                            {
                                                backgroundColor: formatRGBToCSS(score.player.color !, 1),
                                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID("results-player-background"))
                                            }
                                    }>
                                        <div className='left'>
                                            <div className='ball-color-container'>
                                                <div className='ball-color'
                                                    style={
                                                        {
                                                            backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                                                            backgroundColor: formatRGBToCSS(score.player.color !, 1)
                                                        }
                                                }></div>
                                            </div>
                                        </div>
                                        <div className='right'>
                                            <div className='detail'>
                                                {
                                                score.player.name
                                            }
                                                <small>{_gameContext.getPlainTextByID("gameplay:score")}: {
                                                    score.score
                                                }</small>
                                            </div>
                                            <div className='place'>
                                            <span>{ _gameContext.selectedLanguage != 'en' ? "#" : null
                                                }</span>
                                                {
                                                   
                                                index + 1
                                            }
                                                <span>{ _gameContext.selectedLanguage === 'en' ? ScoreHelper.getOrdinalSuffix(index + 1) : null
                                                }</span>
                                            </div>

                                        </div>
                                    </div>
                                </Fragment>
                        })
                        } </div>


                        <GroupComparison />

                        {showHoldInOnes && 

                        <div className='hole-in-one-wrapper'>
                            <div className='title'>Hole in Ones</div>
                            {
                                getHoleInOnes().holeInOnes.length === 0 ? <div className='no-hole-in-ones'>no hole in ones!</div> :
                          
                            <div className='hole-table'>

                            {
    getHoleInOnes().holeInOnes
        .sort((a, b) => a.hole - b.hole) // Ensure we're sorted by hole number
        .map((holeInOne, index) => {
            const { hole, players } = holeInOne;
            return (
                <div key={index} className='hole-row'>
                    <div className='hole-number'>Hole {hole}</div>
                    <div className='hole-players'>
                        {players.map((player, playerIndex) =>
                            <div key={playerIndex} className='hole-player'>
                                <div className='hole-player-ball' style={{
                                    backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                                    backgroundColor: formatRGBToCSS(player.color !, 1)
                                }}></div>
                                <div className='player-name'>{player.name}</div>
                            </div>
                        )}
                    </div>
                    <br />
                </div>
            )
        })
}

                                

                            </div>
}
                        </div>
}

                        <BestWorseHoles bestWorstHole={bestWorstHole!} />
                        
                        <PerformanceChart flatPerformanceData={flatPerformanceData} playerColors={playerColors} />

                        <SnapGallery />



                    </div>
                </div>
            </div>
            }
        </DataAssuranceHOC>
        
    )
}

export default ResultsPage
