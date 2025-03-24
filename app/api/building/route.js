// backend/app/api/building/route.js
import { connectToDB } from '@/utils/database'
import Building from '@/models/building'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    await connectToDB()

    const buildings = await Building.find({}).populate('rooms')

    return NextResponse.json(buildings, { status: 200 })
  } catch (error) {
    console.error('Error fetching buildings:', error)
    return NextResponse.json(
      { message: 'Failed to fetch buildings' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json()

    await connectToDB()

    // Check if building with same name exists
    const existingBuilding = await Building.findOne({ name })
    if (existingBuilding) {
      return NextResponse.json(
        { message: 'Building with this name already exists' },
        { status: 400 }
      )
    }

    const newBuilding = new Building({ name })
    await newBuilding.save()

    return NextResponse.json(newBuilding, { status: 201 })
  } catch (error) {
    console.error('Error creating building:', error)
    return NextResponse.json(
      { message: 'Failed to create building' },
      { status: 500 }
    )
  }
}
