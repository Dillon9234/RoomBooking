'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
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

    const [dateRange, setDateRange] = useState<[Date|null,Date|null]>([null,null])
    const [startDate, endDate] = dateRange

    const [showDatePicker, setShowDatePicker] = useState(false)

    const [roomsState, setRoomsState] = useState([])

    const router = useRouter()

    const [okPressed, setOkPressed] = useState(false)

    const [state, setState] = useState(Number)
    const nameInput = useRef<HTMLInputElement>(null)

    let selectedRooms: {date:string, roomId:mongoose.Schema.Types.ObjectId}[] = []

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
        setState(1)
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
        selectedRooms = []
        setDateRange([null,null])
    };

    const getRoomState = (date: string, roomId: mongoose.Types.ObjectId) => {
        const existingBookedRoom:any = roomsState.find((bookedRoom: any) => {
            return bookedRoom.date === date && bookedRoom.roomId === roomId;
        });
    
        if (existingBookedRoom) {
            return {status:"Occupied", by:existingBookedRoom.by};
        }
        return {status:"Unselected", by:''}; 
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setSubmitting(true)
        try{
            if(selectedRooms.length<0)
                return
            if(state == 1){
                const bookedBy = nameInput?.current?.value

                if(!bookedBy){
                    return
                }
                const response = await fetch('/api/bookroom',{
                    method:'POST',
                    body: JSON.stringify({bookings:selectedRooms, by:bookedBy})
                })

                if(response.ok){
                    console.log("booked")
                }
            }else{
                console.log(selectedRooms)
                const response = await fetch('/api/bookroom',{
                    method:'DELETE',
                    body: JSON.stringify({bookings:selectedRooms})
                })

                if(response.ok){
                    console.log("Deleted")
                }
            }
        }catch(error){
            console.log(error)
        }finally{
            setSubmitting(false)
            fetchRoomsState()
            clearNameInput()
        }
      };

      const clearNameInput = () => {
        if (nameInput.current) {
            nameInput.current.value = "";
        }
      }

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
        className='w-full flex flex-col gap-2 font-mono'>
            {state === 1 && <div className="w-full pt-3">
                    <input type="text" className="w-full flex h-10 rounded-lg bg-[#282828]
                    text-[#8b8b8b] px-2" maxLength={10} placeholder="Club Name" ref={nameInput}/>
                </div>}
            <div className='w-full flex flex-row gap-10 justify-evenly md:justify-normal'>
                <div className='flex flex-col justify-center items-center'>
                    <label className='block text-white font-mono py-2'>
                        Building
                    </label>
                    <select name="building" value={selectedBuilding} id="buildingDropdown" onChange={handleChangeBuilding}
                        className='bg-[#6c8cff] text-black border rounded-lg h-10 p-2 block border-black
                        focus:ring-[#006eff] focus:border-[#006eff] border-collapse'>
                            <option defaultValue={undefined}>
                                Select
                            </option>
                        {buildings && buildings.map((building:any) => (
                            <option key={building._id}value={building._id}>
                                {building.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col justify-center items-center md:items-end'>
                    <label className='block text-white font-mono py-2'>Date Range</label>
                    <button type='button' onClick={() => {setShowDatePicker(!showDatePicker); setOkPressed(false)}}
                        className='bg-[#6c8cff] text-black py-2 px-4 h-10 rounded-lg hover:bg-[#575757] active:bg-[#8b8b8b] border border-black border-collapse'>
                            Select
                    </button>
                </div>
            </div>
            <hr  className="h-px my-1 bg-[#282828] border-0"/>
            <div className='flex flex-row flex-wrap gap-y-4 w-full gap-10 justify-center md:justify-normal'>
                <div className='flex flex-row gap-10 justify-start my-2 bg-[#6c8cff] text-black px-4 py-2 rounded-lg h-10'>
                    <div className="flex items-center" onClick={()=>{setState(1); selectedRooms = [];}}>
                        <input id="inline-radio" type="radio" value="" name="inline-radio-group" className="cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-0"
                        defaultChecked disabled={!state}/>
                        <label htmlFor="inline-radio" className="ms-2 cursor-pointer">Book</label>
                    </div>
                    <div className="flex items-center" onClick={()=>{setState(2); selectedRooms = [];}}>
                        <input id="inline-2-radio" type="radio" value="" name="inline-radio-group" className="cursor-pointer text-[#9dabff] focus:ring-[#9dabff] focus:ring-0" disabled={!state}/>
                        <label htmlFor="inline-2-radio" className="ms-2 cursor-pointer">Cancel</label>
                    </div>
                </div>
                <div className='flex flex-end gap-10 justify-end my-2 h-10'>
                    <Link href='/' className='bg-red-500 text-black rounded-md px-4 py-2 font-mono' onClick={() => {setDateRange([null,null]);clearNameInput()}}>
                        Cancel
                    </Link>
                    <button type='submit' className='bg-green-400 text-black rounded-md px-4 py-2 font-mono' disabled={submitting}>
                        {submitting ? 'Submiting..':'Submit'}
                    </button>
                </div>
            </div>
            <hr className="h-px my-1 bg-[#282828] border-0"/>

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
                        <div className='w-full absolute top-[0.05em] left-[0.05em] text-white overflow-x-clip'>
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
                            overflow-auto
                            md:[&::-webkit-scrollbar]:w-2 
                            md:[&::-webkit-scrollbar]:h-2 
                            md:[&::-webkit-scrollbar-thumb]:rounded-full
                          md:[&::-webkit-scrollbar-track]:bg-[#575757]
                          md:[&::-webkit-scrollbar-thumb]:bg-gray-400
                            md:[&::-webkit-scrollbar-track]:rounded-full
                            md:[&::-webkit-scrollbar-corner]:bg-transparent' >
                                
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
                                                const status = getRoomState(formatDate(date), room._id)
                                                return (
                                                    <td className='w-28 p-2' key={room._id}>
                                                        <div className='flex justify-center'>
                                                            <SelectedRoom status={status} globalState={state} room={room} setSelected={ (isSelected:boolean) => {
                                                                if(isSelected){
                                                                    selectedRooms.push({date:formatDate(date), roomId: room._id})
                                                                }else{
                                                                    selectedRooms = selectedRooms.filter((cur) => { return !(cur.date === formatDate(date) && cur.roomId === room._id)})
                                                                }
                                                             }}/>
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
            :<div className='w-full flex items-center justify-center bg-[#282828] rounded-lg border border-[#575757]'>No Data</div>}
            
        </form>
  )
}

export default BookingForm