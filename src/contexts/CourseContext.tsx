import React, {createContext, useContext, useEffect, useState} from 'react'
import HoleModel from '../models/hole/HoleModel';
import { PlayerContext } from './PlayerContext';
import { ScoreContext } from './ScoreContext';
import CourseModel from '../models/course/CourseModel';
import ConsoleHelper from '../helpers/ConsoleHelper';
import { GameContext } from './GameContext';

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
    addCourseAndHoles: (course: CourseModel, currentHole: number) => void;
}

function CourseContextProvider(props: any) {
    
    const [courses, setCourses] = useState<CourseModel[]>([]);
    const [currentCourse, setCurrentCourse] = useState<number>(0);
    const [currentHole, setCurrentHole] = useState<number>(1);

    const addHole = (hole: HoleModel) => {
        const _currentCourse = courses[currentCourse];
        _currentCourse.holes.push(hole);
        setCourses(old => [...old, _currentCourse]);
    }

    const addHoles = (holes: HoleModel[]) => {
        const _currentCourse = courses[currentCourse];
        if(_currentCourse && _currentCourse.holes)
        {
            _currentCourse.holes.push(...holes);
            setCourses(old => [...old, _currentCourse]);
        }
        
    }

    const addCourseAndHoles = (course: CourseModel, currentHole: number) => {
      
            addCourse(course);
            setCurrentCourse(courses.length - 1);
            setCurrentHole(currentHole);
            console.log("course", course);
            console.log("currentHole", currentHole);
            console.log("holes", course.holes)

      
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
        //console.log("courses[currentCourse]", courses[currentCourse])
        if(courses[currentCourse])
        {
            return courses[currentCourse].holes.filter(hole => hole.number === currentHole)[0];
        }
        return { courseID: 1,  number: 1, par: 0}
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
        if(index === -1)
        {
            console.log("index bad");
            setCurrentHole(1);
            return;
        }
        else
        {

            console.log("INDEX", index + 1);
            setCurrentHole(holeNumber);
        }
        // console.log("holeNumber", holeNumber);
        // console.log("getCurrentCourseHoles()", getCurrentCourseHoles());
        // console.log("index", index);
       
    }

    const toggleNextHole = () => {
        if (currentHole < getCurrentCourseHoles().length - 1) {
            console.log(currentHole + 1)
            setCurrentHole(old => old + 1);
        }
        else
        {
            console.log("~~~~~~~~~~~~~~~~~~~~hey");
            //console.log("cant toggle next hole");
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
        if(courses[currentCourse] && courses[currentCourse].holes)
        {
            return courses[currentCourse].holes;
        }
        return [];
       
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
        addCourses,
        addCourseAndHoles
    }

    return <CourseContext.Provider value={contextValues}>
        {props.children}
    </CourseContext.Provider>
}

export { CourseContext, CourseContextProvider }