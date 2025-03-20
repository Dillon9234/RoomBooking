'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'


const CreateBuildingForm = () => {
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()
    const handleSubmit= async (event) => {
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

  return (
        <form onSubmit={handleSubmit} 
        className='bg-gray-600 p-10 rounded-xl w-full flex flex-col gap-10'>
            <div className='flex gap-10'>
                <label className='text-white font-mono'>
                    Name
                </label>
                <input type='text' name='name'/>
            </div>
            
            <div className='flex flex-end gap-2 justify-end'>
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

export default CreateBuildingForm