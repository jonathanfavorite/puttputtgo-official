import React, { Fragment } from 'react'
import './OnFireEffect.scss';
import RGBModel from '../../../models/color/RGBModel';

interface FireProps {
    color?: RGBModel;
    isLast?: boolean;
    isFirst?: boolean;
}

function OnFireEffect(props: FireProps) {
    let flamesAmount = 50;
    let color = {
        r: 0,
        g: 0,
        b: 0
    }
    let isLast = false;
    let isFirst = false;

    if(props.isFirst) {
        console.log("yes"); 
        isFirst = props.isFirst;
    }
    
    if(props.isLast) {
        console.log("yes");
        isLast = props.isLast;
    }
    if(props.color) {
       //color = props.color;
    }
    //background-image: radial-gradient($fireColor 20%,$fireColorT 70%);
    
    let opacity = 0.05;

    return <Fragment>
     {!isFirst && <><div className='fire top-fire'>
       {
           [...Array(flamesAmount)].map((_, index) => {
                return <div className='particle' key={index} style={{
                    backgroundImage: `radial-gradient(rgba(${color.r}, ${color.g}, ${color.b}, ${opacity}) 20%, rgba(${color.r}, ${color.g}, ${color.b}, 0) 70%)`
                }}></div>
           })
        }
    
    </div>
    </>}
    {!isLast && <><div className='fire bottom-fire'>
    {
           [...Array(flamesAmount)].map((_, index) => {
            return <div className='particle' key={index} style={{
                backgroundImage: `radial-gradient(rgba(${color.r}, ${color.g}, ${color.b}, ${opacity}) 20%, rgba(${color.r}, ${color.g}, ${color.b}, 0) 70%)`
            }}></div>
           })
        }
    </div></>}
    </Fragment>
}

export default OnFireEffect
