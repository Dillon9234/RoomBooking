'use client';

import React, { useEffect, useState } from 'react';

const SelectedRoom = ({ status, room, setSelected, globalState }) => {
  const [curStatus, setCurStatus] = useState('');
  const [backgroundColorClass, setBackgroundColorClass] = useState('');

  const statusColorMap = {
    Selected: 'bg-success',
    Occupied: 'bg-dark',
    Unselected: 'bg-secondary',
    DeleteSelected: 'bg-success',
  };

  useEffect(() => {
    setCurStatus(status.status);
  }, [status]);

  useEffect(() => {
    setBackgroundColorClass(statusColorMap[curStatus]);
  }, [curStatus]);

  const handleClick = () => {
    if (globalState === 1) {
      if (curStatus === 'Occupied') return;
      if (curStatus === 'Selected') {
        setCurStatus('Unselected');
        setSelected(false);
      } else {
        setCurStatus('Selected');
        setSelected(true);
      }
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
      className={`d-flex justify-content-center align-items-center text-white rounded p-2 w-50 h-50 ${backgroundColorClass} text-truncate mx-auto`} 
      onClick={handleClick}
      style={{ cursor: 'pointer', aspectRatio: '1 / 1', minWidth: '40px', minHeight: '40px' }}
    >
      <div className={`${curStatus === 'DeleteSelected' ? 'text-dark' : 'text-white'}`}>
        {(curStatus === 'Occupied' || curStatus === 'DeleteSelected') && status.by}
      </div>
    </div>
  );
};

export default SelectedRoom;
