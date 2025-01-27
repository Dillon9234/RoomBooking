'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import SelectedRoom from './SelectedRoom'
import mongoose from 'mongoose'


const BookingForm = () => {
    const [submitting, setSubmitting] = useState(false)

    const [buildings, setBuildings] = useState([])
    const [selectedBuilding, setSelectedBuilding] = useState('')

    const [rooms, setRooms] = useState([])
    const [selectedRooms, setSelectedRooms] = useState([])

    const [dateRange, setDateRange] = useState<[Date|null,Date|null]>([null,null])
    const [startDate, endDate] = dateRange

    const [showDatePicker, setShowDatePicker] = useState(false)

    const [roomsState, setRoomsState] = useState([])

    const router = useRouter()

    const [okPressed, setOkPressed] = useState(false)

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response:Response = await fetch('/api/building')
                const data = await response.json()
                setBuildings(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchBuildings()
    }, [])

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response:Response = await fetch(`/api/building/${selectedBuilding}`)
                const data = await response.json()
                setRooms(data.rooms)
            } catch (error) {
                console.log(error)
            }
        }

        fetchRooms()
    }, [selectedBuilding])

    const fetchRoomsState = async () => {
        try {
            const response:Response = await fetch(`/api/getbookedrooms`)
            const data = await response.json()
            setRoomsState(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeBuilding = (event:React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBuilding(event.target.value);
        setSelectedRooms([])
        setDateRange([null,null])
    };

    const getRoomState = (date: Date, roomId: mongoose.Types.ObjectId) => {
        const day: any = roomsState.find((day: any) => {
            const dayDate = new Date(day.date);
            const isMatch = dayDate.getFullYear() === date.getFullYear() && 
                            dayDate.getMonth() === date.getMonth() && 
                            dayDate.getDate() === date.getDate();
            return isMatch;
        });
    
        if (day) {
            const isRoomBooked = day.bookedRooms.some((booking: any) => booking.room._id.toString() === roomId.toString());
            if (isRoomBooked) {
                return "Occupied";
            }
            return "Available";
        }
        return "Available"; 
    }
    

    const handleRemoveClick = (event:React.MouseEvent<HTMLButtonElement>) => {
        console.log(event.currentTarget.dataset.room)
    }

    const handleAddClick = (event:React.MouseEvent<HTMLButtonElement>) => {
        setSelectedRooms(selectedRooms)
    }
    

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setSubmitting(true)
        try{
            const formData = new FormData(event.currentTarget);
            const name = formData.get("name");
            const response = await fetch('/api/building/new',{
                method:'POST',
                body: JSON.stringify({
                    name,
                })
            })
    
            if(response.ok){
                router.push('/')
            }
        }catch(error){
            console.log(error)
        }finally{
            setSubmitting(false)
        }
      };

      const generateDates = (start:Date, end:Date): Date[] => {
        const dateArray: Date[] = []
        let cur = new Date(start)
        cur.setHours(0, 0, 0, 0);
        while(cur<=end){
            dateArray.push(new Date(cur))
            cur.setDate(cur.getDate()+1)
        }
        return dateArray
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

      const dateArray = startDate && endDate ? generateDates(startDate, endDate):[]
  return (
        <form onSubmit={handleSubmit} 
        className='w-full flex flex-col gap-5 font-mono'>
            <div className='max-w-md flex flex-row gap-10'>
                <div>
                    <label className='block text-white font-mono py-4'>
                        Select an options
                    </label>
                    <select name="building" value={selectedBuilding} id="buildingDropdown" onChange={handleChangeBuilding}
                        className='bg-[#3f3f3f] border border-[#282828 rounded-lg focus:ring-[#006eff] focus:border-[#006eff]
                        w-full p-2.5 '>
                            <option defaultValue={undefined}>
                                Select a building
                            </option>
                        {buildings && buildings.map((building:any) => (
                            <option key={building._id}value={building._id}>
                                {building.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className='block text-white font-mono py-4'>Select Date Range</label>
                    <button type='button' onClick={() => {setShowDatePicker(!showDatePicker); setOkPressed(false)}}
                        className='bg-[#3f3f3f] py-2 px-4 rounded-full hover:bg-[#8b8b8b]'>
                            Select Dates
                    </button>
                </div>
            </div>
                <div className={`fixed inset-1 z-50 flex items-center  justify-center bg-black/30
                transition-transform duration-200 ease-out scale-100 md:hidden bg-opacity-50 backdrop-blur-md rounded-lg
                ${showDatePicker ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}>
                    <button type='button'
                        className="absolute top-2 right-2 text-[#8b8b8b] hover:text-black"
                        onClick={() => setShowDatePicker(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <DatePicker
                        selected={startDate}
                        onChange={(dates: [Date | null, Date | null]) => {setDateRange(dates);}}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        className='p-2 rounded inline-block'
                    />
                    <div className="absolute bottom-10 right-10">
                        <button type='button'
                            className="bg-[#6c8cff] text-black rounded-lg px-4 py-2 hover:bg-blue-600 transition"
                            onClick={() => {
                                setShowDatePicker(false);
                                fetchRoomsState()
                                setOkPressed(true);
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>   
                <div className={`absolute left-64 top-[22.3rem] z-50 mt-2 bg-white shadow-2xl rounded p-2 shadow-[#575757]
                border border-gray-200 transition-transform duration-200 ease-out scale-100 hidden md:block
                ${showDatePicker ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}>
                    <div className='absolute top-[-0.5rem] right-[-0.5rem] bg-red-600 text-white rounded-full p-1 cursor-pointer z-30 flex items-center justify-center w-6 h-6'
                    onClick={() => setShowDatePicker(false)}>X</div>
                    <DatePicker
                        selected={startDate}
                        onChange={(dates: [Date | null, Date | null]) => {setDateRange(dates); let [start, end] = dates;
                            if (start && end) {
                              setShowDatePicker(false); // Only close when both dates are selected
                              fetchRoomsState()
                              setOkPressed(true);
                            }}}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        className='p-2 rounded inline-block'
                    />
                </div>               
            {rooms?.length>0 && dateArray?.length>0 && (okPressed) ? (
                    <div className='relative bg-[#282828] rounded-lg'>
                        <div className='w-full absolute top-[0.05em] left-[0.05em] text-white'>
                            <table className='z-20 table-fixed w-full absolute bg-transparent h-[2.6em]'>
                                <thead className='text-white sticky top-0'>
                                    <tr>
                                        <th className='w-[5em] h-1 left-7 top-5
                                        bg-[#282828] border-r border-b z-20 rounded-tl-lg border-solid border-[#575757]'>Dates</th>
                                        {rooms.map((room:any) => (
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
                            overflow-auto' >
                                
                            <table className='z-10 table-fixed w-full h-full'>
                                <thead className='text-white sticky top-0'>
                                    <tr>
                                        <th className='w-[5em] h-10 left-7 top-5'></th>
                                        {rooms.map((room:any) => (
                                            <th key={room.number} className='w-28 p-0 bg-[#282828]'>
                                                <div className='flex justify-center w-full h-full border-r border-b border-solid border-[#575757] p-2 m-0'>
                                                    {room.number}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className=''>
                                    {dateArray.map((date) => (
                                        <tr key={formatDate(date)}>
                                            <td className='w-28 p-0 justify-center items-center h-28 sticky left-0 bg-[#282828] text-center z-10 '>
                                                <div className='w-full h-full border-r border-b border-solid border-[#575757] p-2 m-0 items-center flex justify-center'>{formatDate(date)}</div>
                                            </td>
                                            {rooms.map((room:any) => {
                                                return (
                                                    <td className='w-28 p-2' key={room._id}>
                                                        <div className='flex justify-center' onClick={ () => { }}>
                                                            <SelectedRoom status={getRoomState(date, room._id)} room={room}/>
                                                        </div>
                                                    </td>
                                                )
                                            })
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>)
            :<div className='w-full flex items-center justify-center bg-[#282828] rounded-lg'>No Data</div>}
            
            
            <div className='flex flex-end gap-2 justify-end fixed bottom-5 right-5'>
                <Link href='/' className='bg-orange-400 rounded-md p-1 font-mono'>
                    Cancel
                </Link>
                <button type='submit' className='bg-red-600 rounded-md p-1 font-mono' disabled={submitting}>
                    {submitting ? 'Submiting..':'Submit'}
                </button>
            </div>
        </form>
  )
}

export default BookingForm