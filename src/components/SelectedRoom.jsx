'use client';

import React, { useEffect, useState } from 'react';

const SelectedRoom = ({ status, room, setSelected, globalState }) => {
    const [curStatus, setCurStatus] = useState('');
    const [backgroundColorClass, setBackgroundColorClass] = useState('');

    const statusColorMap = {
        Selected: 'bg-success',
        Occupied: 'bg-dark',
        Unselected: 'bg-secondary',
        DeleteSelected: 'bg-warning text-dark',
    };

    useEffect(() => setCurStatus(status.status), [status]);
    useEffect(() => setBackgroundColorClass(statusColorMap[curStatus]), [curStatus]);

    const handleClick = () => {
        if (globalState === 1) {
            if (curStatus === 'Occupied') return;
            setCurStatus(curStatus === 'Selected' ? 'Unselected' : 'Selected');
            setSelected(curStatus !== 'Selected');
        } else {
            if (curStatus === 'Occupied') {
                setCurStatus('DeleteSelected');
                setSelected(true);
            } else if (curStatus === 'DeleteSelected') {
                setCurStatus('Occupied');
                setSelected(false);
            }
        }
    };

    return (
        <div
            className={`rounded p-2 w-10 d-flex justify-content-center align-items-center text-white text-center cursor-pointer ${backgroundColorClass}`}
            onClick={handleClick}
        >
            {(curStatus === 'Occupied' || curStatus === 'DeleteSelected') && status.by}
        </div>
    );
};

export default SelectedRoom;
