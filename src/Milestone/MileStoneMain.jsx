import React from 'react';
import MilestoneHeader from './MilestoneHeader';
import MilestoneBody from './MilestoneBody';
import DateMilestone from './weekProgressPicker';
import NodeConnection from './nodeconnection';

const MileStoneMain = () => {
    return (
        <div>
            <MilestoneHeader />
            <MilestoneBody />
            {/* <DateMilestone/> */}
            {/* <NodeConnection /> */}
        </div>
    );
};

export default MileStoneMain;