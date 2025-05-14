import React from 'react';
import MilestoneHeader from './MilestoneHeader';
import MilestoneBody from './MilestoneBody';
import DateMilestone from './weekProgressPicker';

const MileStoneMain = () => {
    return (
        <div>
            <MilestoneHeader />
            <MilestoneBody />
            <DateMilestone/>
        </div>
    );
};

export default MileStoneMain;