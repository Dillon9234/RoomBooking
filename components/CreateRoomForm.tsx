'use client'

import React, { useEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmBox from './ConfirmBox'
import ToastMessage from './ToastMessage'


const BookingForm = () => {
    const [submitting, setSubmitting] = useState(false)

    const [buildings, setBuildings] = useState([])
    const [selectedBuilding, setSelectedBuilding] = useState('')

    const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);
    
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


    const handleChangeBuilding = (event:React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBuilding(event.target.value);
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        if(submitting)
            return
        setSubmitting(true)
    };

    const confirmSubmission = async () => {
        try{
        }catch(error:any){
            setToast({ text: error.message, type: "error" });
        }finally{
            setSubmitting(false)
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
  return (
        <form onSubmit={handleSubmit} 
        className='w-full flex flex-col gap-2 font-mono'>
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
            </div>
            <div>
                <ConfirmBox
                    onCancel={() => {setSubmitting(false)}}
                    isOpen={submitting}
                    onConfirm={confirmSubmission}
                    text='Submit'
                />
            </div>
            {toast && <ToastMessage 
            text={toast.text}
            type={toast.type}
            onClose={() => setToast(null)}
            />}
            
        </form>
  )
}

export default BookingForm