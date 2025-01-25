'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import SelectedRoom from './SelectedRoom'


const BookingForm = () => {
    const [submitting, setSubmitting] = useState(false)

    const [buildings, setBuildings] = useState([])
    const [selectedBuilding, setSelectedBuilding] = useState('')

    const [rooms, setRooms] = useState([])
    const [selectedRooms, setSelectedRooms] = useState([])

    const [dateRange, setDateRange] = useState<[Date|null,Date|null]>([null,null])
    const [startDate, endDate] = dateRange

    const [showDatePicker, setShowDatePicker] = useState(false)

    const router = useRouter()

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

    const handleChangeBuilding = (event:React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBuilding(event.target.value);
        setSelectedRooms([])
        setDateRange([null,null])
    };

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
        while(cur<=end){
            dateArray.push(new Date(cur))
            cur.setDate(cur.getDate()+1)
        }
        return dateArray
      }

      const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}\nJan\n${year}`;
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
                    <button type='button' onClick={() => setShowDatePicker(!showDatePicker)}
                        className='bg-[#3f3f3f] py-2 px-4 rounded-full hover:bg-[#8b8b8b]'>
                            Select Dates
                    </button>
                </div>
            </div>
            {showDatePicker && (
                <div className="absolute left-64 top-[22.3rem] z-20 mt-2 bg-white shadow-lg rounded p-2">
                    <div className='absolute top-[-0.5rem] right-[-0.5rem] bg-red-600 text-white rounded-full p-1 cursor-pointer z-30 flex items-center justify-center w-6 h-6'
                    onClick={() => setShowDatePicker(false)}>X</div>
                    <DatePicker
                        selected={startDate}
                        onChange={(dates: [Date | null, Date | null]) => {setDateRange(dates); let [start, end] = dates;
                            if (start && end) {
                              setShowDatePicker(false); // Only close when both dates are selected
                            }}}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        className='p-2 rounded inline-block'
                    />
                </div>
            )}
                
            {rooms?.length>0 && dateArray?.length>0?(
                    <div className='relative '>
                        <div className='w-full absolute top-[0.05em] left-[0.05em] text-white'>
                            <table className='z-20 table-fixed w-full absolute bg-transparent h-[2.6em]'>
                                <thead className='text-white sticky top-0'>
                                    <tr>
                                        <th className='w-[5em] h-1 left-7 top-5
                                        bg-black border-r border-b z-20 rounded-tl-lg border-solid border-[#282828]'>Dates</th>
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
                        <div className='w-full h-[30em] text-white border border-solid border-[#282828] rounded-lg
                            overflow-auto' >
                                
                            <table className='z-10 table-fixed w-full h-full'>
                                <thead className='text-white sticky top-0'>
                                    <tr>
                                        <th className='w-[5em] h-10 left-7 top-5'></th>
                                        {rooms.map((room:any) => (
                                            <th key={room.number} className='w-28 p-0 bg-black'>
                                                <div className='flex justify-center w-full h-full border-r border-b border-solid border-[#282828] p-2 m-0'>
                                                    {room.number}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className=''>
                                    {dateArray.map((date) => (
                                        <tr key={formatDate(date)}>
                                            <td className='w-28 p-0 justify-center items-center h-28 sticky left-0 bg-black text-center z-10 '>
                                                <div className='w-full h-full border-r border-b border-solid border-[#282828] p-2 m-0 items-center flex justify-center'>{formatDate(date)}</div>
                                            </td>
                                            {rooms.map((room:any) => {
                                                return (
                                                    <td className='w-28 p-2'>
                                                        <div className='flex justify-center'>
                                                            <SelectedRoom roomNumber={room.number} room={room}/>
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
            :<div className='w-full flex items-center justify-center'>No Data</div>}
            
            
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