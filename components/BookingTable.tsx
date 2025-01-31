import React, { RefObject } from 'react';
import SelectedRoom from './SelectedRoom';
import mongoose from 'mongoose';

interface Room {
    number: string;
    _id: string;
}

interface RoomTableProps {
    rooms: Room[];
    dateArray: Date[];
    getRoomState: (date: string, roomId: mongoose.Types.ObjectId) => {status:string,by:string};
    selected: RefObject<{ date: string; roomId: mongoose.Types.ObjectId }[]>
    state: number;
}

const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}\n${month}\n${year}`;
  };

const RoomTable = ({ rooms, dateArray, getRoomState, selected, state }:RoomTableProps) => {
    return (
        <div className='relative bg-[#282828] rounded-lg'>
            <div className='w-full absolute top-[0.05em] left-[0.05em] text-white overflow-x-clip'>
                <table className='z-20 table-fixed w-full absolute bg-transparent h-[2.6em]'>
                    <thead className='text-white sticky top-0'>
                        <tr>
                            <th className='w-[5em] h-1 left-7 top-5
                            bg-[#282828] border-r border-b z-20 rounded-tl-lg border-solid border-[#575757]'>Dates</th>
                            {rooms.map((room) => (
                                <th key={room.number} className='w-28 p-2'>
                                    <div className='hidden'>
                                        {room.number}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                </table>
            </div>
            <div className='w-full h-[30em] text-white border border-solid border-[#575757] rounded-lg
                overflow-auto
                md:[&::-webkit-scrollbar]:w-2 
                md:[&::-webkit-scrollbar]:h-2 
                md:[&::-webkit-scrollbar-thumb]:rounded-full
                md:[&::-webkit-scrollbar-track]:bg-[#575757]
                md:[&::-webkit-scrollbar-thumb]:bg-gray-400
                md:[&::-webkit-scrollbar-track]:rounded-full
                md:[&::-webkit-scrollbar-corner]:bg-transparent'>
                <table className='z-10 table-fixed w-full h-full'>
                    <thead className='text-white sticky top-0'>
                        <tr>
                            <th className='w-[5em] h-10 left-7 top-5'></th>
                            {rooms.map((room) => (
                                <th key={room.number} className='w-28 p-0 bg-[#282828]'>
                                    <div className='flex justify-center w-full h-full border-r border-b border-solid border-[#575757] p-2 m-0'>
                                        {room.number}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dateArray.map((date) => (
                            <tr key={formatDate(date)}>
                                <td className='w-28 p-0 justify-center items-center h-28 sticky left-0 bg-[#282828] text-center z-10'>
                                    <div className='w-full h-full border-r border-b border-solid border-[#575757] p-2 m-0 items-center flex justify-center'>
                                        {formatDate(date)}
                                    </div>
                                </td>
                                {rooms.map((room:any) => {
                                    const status = getRoomState(formatDate(date), room._id);
                                    return (
                                        <td className='w-28 p-2' key={room._id}>
                                            <div className='flex justify-center'>
                                                <SelectedRoom
                                                    status={status}
                                                    globalState={state}
                                                    room={room}
                                                    setSelected={(isSelected: boolean) => {
                                                        if (isSelected) {
                                                            selected.current.push({ date: formatDate(date), roomId: room._id });
                                                        } else {
                                                            const index = selected.current.filter(cur => !(cur.date === formatDate(date) && cur.roomId === room._id))
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoomTable;
