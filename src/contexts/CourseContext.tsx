import React, {createContext, useContext, useEffect, useState} from 'react'
import HoleModel from '../models/hole/HoleModel';
import { PlayerContext } from './PlayerContext';
import { ScoreContext } from './ScoreContext';
import CourseModel from '../models/course/CourseModel';

const CourseContext = createContext<CourseContextProps>({} as CourseContextProps)

type holeNumber = number;
type courseNumber = number;

interface CourseContextProps {
    getCurrentCourse: () => CourseModel;
    addCourse: (course: CourseModel) => void;
    addCourses: (courses: CourseModel[]) => void;
    
    addHole: (hole: HoleModel) => void;
    addHoles: (holes: HoleModel[]) => void;
    removeHole: (holeNumber: holeNumber) => void;
    getCurrentHole: () => HoleModel;
    getAllHoles: () => HoleModel[];
    updateCurrentHole: (holeNumber: holeNumber) => void;
    toggleNextHole: () => void;
    holesRemaining: () => number;
    holesCompleted: () => number;
    getTotalParsOfHoles: () => number;
}

function CourseContextProvider(props: any) {

    const _playerContext = useContext(PlayerContext);
    const _scoreContext = useContext(ScoreContext);

    const [courses, setCourses] = useState<CourseModel[]>([]);
    const [currentCourse, setCurrentCourse] = useState<number>(0);
    const [currentHole, setCurrentHole] = useState<number>(0);

    const addHole = (hole: HoleModel) => {
        const _currentCourse = courses[currentCourse];
        _currentCourse.holes.push(hole);
        setCourses(old => [...old, _currentCourse]);
    }

    const addHoles = (holes: HoleModel[]) => {
        const _currentCourse = courses[currentCourse];
        _currentCourse.holes.push(...holes);
        setCourses(old => [...old, _currentCourse]);
    }

    const removeHole = (holeNumber: holeNumber) => {
        // courses is an array of courses, which contains an array of holes
        // so we need to get the current course, and add the hole to that course
        // while keeping the state
        const _currentCourse = courses[currentCourse];
        const _holes = _currentCourse.holes.filter(hole => hole.number !== holeNumber);
        _currentCourse.holes = _holes;
        setCourses(old => [...old, _currentCourse]);
    }
    
    const getCurrentHole = () => {
        if(courses[currentCourse])
        {
            return courses[currentCourse].holes[currentHole];
        }
        return { courseID: 1,  number: 0, par: 0}
    }

    const addCourse = (course: CourseModel) => {
       
        setCourses(old => [...old, course]);
    }

    const addCourses = (_courses: CourseModel[]) => {
       
        setCourses(old => [...old, ..._courses]);
    }

    const getAllHoles = () => {
        return getCurrentCourseHoles();
    }

    const updateCurrentHole = (holeNumber: holeNumber) => {
        const index = getCurrentCourseHoles().findIndex(hole => hole.number === holeNumber);
        setCurrentHole(index);
    }

    const toggleNextHole = () => {
        if (currentHole < getCurrentCourseHoles().length - 1) {
            setCurrentHole(old => old + 1);
        }
        else
        {
            console.log("cant toggle next hole");
        }
    }

    const holesRemaining = () => {
        return getCurrentCourseHoles().length - currentHole;
    }

    const holesCompleted = () => {
        return currentHole;
    }

    const getTotalParsOfHoles = () => {
        return getCurrentCourseHoles().reduce((total, hole) => total + hole.par, 0);
    }

    const getCurrentCourse = () => {
        return courses[currentCourse];
    }
    const getCurrentCourseHoles = () => {
        return courses[currentCourse].holes;
    }

    const contextValues: CourseContextProps = {
        addHole,
        addHoles,
        removeHole,
        getCurrentHole,
        getAllHoles,
        updateCurrentHole,
        toggleNextHole,
        holesRemaining,
        holesCompleted,
        getTotalParsOfHoles,
        getCurrentCourse,
        addCourse,
        addCourses
    }

    return <CourseContext.Provider value={contextValues}>
        {props.children}
    </CourseContext.Provider>
}

export { CourseContext, CourseContextProvider }