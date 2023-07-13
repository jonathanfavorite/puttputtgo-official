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
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import PlayerModel from '../../../models/player/PlayerModel';
import ScoreModel from '../../../models/score/ScoreModel';
import LocalStoragePreloader from '../../loadings/local-storage-preloader/LocalStoragePreloader';
import { Helmet } from 'react-helmet-async';
import ShareGames from '../../molecules/share-games/ShareGames';


function ResultsPage() {
    const _gameContext = useContext(GameContext);
    const _playerContext = useContext(PlayerContext);
    const _courseContext = useContext(CourseContext);
    const _scoreContext = useContext(ScoreContext);
    const {business_name} = useParams();
    const navigate = useNavigate();


    const [completelyLoaded, setCompletelyLoaded] = useState<boolean>(false);

    enum ResultType {
        Straight,
        Tie
    }

    interface TrueResults {
        type: ResultType;
        trueFirstPlace: LeaderboardModel;
        ties: LeaderboardModel[];
    }

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

    interface PerformanceData {
        player: PlayerModel;
        scores: ScoreModel[];
    }

    // const [performanceData, setPerformanceData] = useState<PerformanceData[] | null>(null)
    // const [flatPerformanceData, setFlatPerformanceData] = useState<any[]>([]);


    const [flatPerformanceData, setFlatPerformanceData] = useState<any[]>([]);
    const [playerColors, setPlayerColors] = useState<{ [key: string]: string }>({});

    const [activePerformanceOverview, setActivePerformanceOverview] = useState<PlayerModel | null>(null);
    const [dropdownActive, setDropdownActive] = useState<boolean>(false);


    const handlePlayerPerformanceClicked = (player: PlayerModel | null) => {
        setActivePerformanceOverview(player);
        setDropdownActive(false);
    }

    const handleDropdownClicked = () => {
        setDropdownActive(!dropdownActive);
    }

    interface BestWorstHole {
       bestHole: number;
       bestPar: number;
       bestAvg: number;
       worstHole: number;
       worstPar: number;
       worstAvg: number;
    }

    const  [bestWorstHole, setBestWorstHole] = useState<BestWorstHole | null>(null);

    const MAX_SCORE = 54; 

    useEffect(() => {

        if(_gameContext.preloadedLocalStorage) {

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

    const textRef = useRef < HTMLDivElement | null > (null);

    function adjustFontSize() {
        if (textRef.current) {
            const textLength = textRef.current.textContent !.length;
            const baseFontSize = 5;
            const threshold = 1;

            if (textLength > threshold) {
                const newFontSize = baseFontSize - (textLength - threshold) * 0.2;
                textRef.current.style.fontSize = `${newFontSize}rem`;
            } else {
                textRef.current.style.fontSize = `${baseFontSize}rem`;
            }
        }
    }

    useEffect(() => {
        if (textRef.current) {
            adjustFontSize();
        }
    }, [textRef]);

    interface GroupComparisonValue {
        value: number;
        color: string;
        boxColor: string;
        betterWorse: string;
    }

    const groupComparisonValue = () : GroupComparisonValue =>  {
        //let math = -1 * ((50 - 55) / 55) * 100;
        // Adjusted Percentage Difference = -1 * ((Team Score - Average Group Score) / Average Group Score) * 100
        let players = _playerContext.getAllPlayers();
        let totalScore = 0;
        players.forEach(player => {
            totalScore += _scoreContext.getPlayerTotalScore(player.id);
        });
        totalScore = totalScore / players.length;
        let averageGroupScore = _courseContext.getCurrentCourse().stats.averageGroupScore;
        let math = -1 * ((totalScore - averageGroupScore) / averageGroupScore) * 100;
        let rounded = Math.round(math);
        return {
            value: Math.abs(rounded),
            color: math < 0 ? 'red' : 'green',
            betterWorse: math < 0 ? 'worse' : 'better',
            boxColor: math < 0 ? '#eb4141' : '#517b4b'
        }
    }

    return (
        
        <DataAssuranceHOC companyParam={
            business_name ! ? business_name : "default"
        }>

            

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

                        <div className='winner-content'>
                            <div className='winner-left'>
                                <div className='ball-color-container'>
                                    <div className='ball-color'
                                        style={
                                            {
                                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                                                backgroundColor: formatRGBToCSS(GetFirstPlacePlayer().player.color !, 1)
                                            }
                                    }></div>
                                </div>
                            </div>
                            <div className='winner-right'>
                                <ConfettiCanvas/>

                                <div className='title'><img src={
                                            _gameContext.getAssetByID("crown") ?. assetLocation
                                        }
                                        className='crown'/><span>winner</span>
                                </div>

                                <div className='name'
                                    ref={textRef}>
                                    {
                                    GetFirstPlacePlayer().player.name
                                }</div>
                                <div className='score'>Score: {
                                    GetFirstPlacePlayer().score
                                }</div>
                            </div>
                        </div>
                        <div className='winner-text'>
                            Bravo, noble golfer!<br/>You've conquered the treacherous Castle Golf realm and emerged victorious!
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
                                <div className='text'>results</div>
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
                                                <small>score: {
                                                    score.score
                                                }</small>
                                            </div>
                                            <div className='place'>
                                                {
                                                index + 1
                                            }
                                                <span>{
                                                    ScoreHelper.getOrdinalSuffix(index + 1)
                                                }</span>
                                            </div>

                                        </div>
                                    </div>
                                </Fragment>
                        })
                        } </div>



                        <div className='group-comparison-wrap'>
                            <div className='left'>
                                <div className='box' style={{
                                    backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('group-comparison-background')),
                                    backgroundColor: groupComparisonValue().boxColor
                                }}>
                                    <div>
                                    <span className='number'>{groupComparisonValue().value}</span>
                                    <span className='percent'>%</span>
                                    </div>
                                </div>
                            </div>
                            <div className='right'>
                                
                                <div className='box-content'>your team did<br /><span className={`color ${groupComparisonValue().color}`}>{groupComparisonValue().value}% {groupComparisonValue().betterWorse}</span> than other groups
                                </div>
                            </div>
                        </div>

                        <div className='best-worst-hole-wrap'>
                            <div className='left'>
                                <div className='inside-content'>
                                    <div className='title'>best hole</div>
                                    <div className='large-number best'>{bestWorstHole?.bestHole}</div>
                                    <div className='par'>par {bestWorstHole?.bestPar}</div>
                                    <div className='group'>group avg: {bestWorstHole?.bestAvg}</div>
                                </div>
                            </div>
                            <div className='right'>
                                <div className='inside-content'>
                                <div className='title'>worst hole</div>
                                    <div className='large-number worst'>{bestWorstHole?.worstHole}</div>
                                    <div className='par'>par {bestWorstHole?.worstPar}</div>
                                    <div className='group'>group avg: {bestWorstHole?.worstAvg}</div>
                                </div>
                            </div>
                        </div>


                        <div className='performance-wrap'>
                            <div className='title'>performances</div>
                            <div className='performance-dropdown'>
                                <div className='selected-option' onClick={handleDropdownClicked}>
                                    <div className='display'>
                                        <div className='icon'></div>
                                        <div className='text'>{activePerformanceOverview ? activePerformanceOverview.name : 'Overview'}</div>
                                    </div>
                                    <div className='close'>
                                        <div className='icon' onClick={handleDropdownClicked} style={{
                                            backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('performance-caret')),
                                            transform: dropdownActive ? 'rotate(180deg)' : 'rotate(0deg)'
                                        }}></div>
                                    </div>
                                </div>
                                <div className='list' style={{
                                    display: dropdownActive ? 'block' : 'none'
                                }}>
                                    
                                    {activePerformanceOverview && <div className='item' onClick={() => handlePlayerPerformanceClicked(null)}>
                                        <div className='icon'></div>
                                        <div className='text'>Overview</div>
                                    </div>
}

                                    {_playerContext.getAllPlayers().map((player, index) => {
                                        if(activePerformanceOverview) {
                                            if(activePerformanceOverview.id === player.id) {
                                                return null;
                                            }
                                        }
                                        return <div key={index} className='item' onClick={() => handlePlayerPerformanceClicked(player)}>
                                        <div className='icon'
                                        style={
                                            {
                                                backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-player-ball-frame')),
                                                backgroundColor: formatRGBToCSS(player.color !, 1)
                                            }
                                    }></div>
                              
                                        <div className='text'>{player.name}</div>
                                    </div>
                                    })}
                                    
                                </div>
                            </div>
                            <div className='performance-chart'>
                            <ResponsiveContainer width={'100%'} height={'100%'}>
    <LineChart margin={{
        top:0,
        left:0,
        bottom: 0,
        right: 0
    }} data={flatPerformanceData}>

       {_playerContext.getAllPlayers().map((player, index) => { 
           const rgb = playerColors[`player${player.id}`];
           const notActiveRGB = `rgba(129, 104, 104, 0.5)`;
           let correctedColor = rgb;
           if(activePerformanceOverview) {
                if(activePerformanceOverview.id !== player.id) {
                     correctedColor = notActiveRGB;
                }
           }
            return <Line type="monotone" dataKey={`player${player.id}`} strokeWidth={3} dot={false} stroke={correctedColor} key={index} />;
        })}
    </LineChart>
      {/* <LineChart data={dummyData}>
        <Line type="monotone" dataKey="player1" stroke="blue" />
        <Line type="monotone" dataKey="player2" stroke="red" />
    </LineChart> */}
</ResponsiveContainer>
                            </div>
                        </div>




                    </div>
                </div>
            </div>
            }
        </DataAssuranceHOC>
        
    )
}

export default ResultsPage
