// backend/app/api/building/[id]/edit/route.js
import { connectToDB } from '@/utils/database'
import Building from '@/models/building'
import Room from '@/models/room'
import { Types } from 'mongoose'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const { name } = await request.json()

    await connectToDB()

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid building ID' },
        { status: 400 }
      )
    }

    // Check if building exists
    const building = await Building.findById(id)
    if (!building) {
      return NextResponse.json(
        { message: 'Building not found' },
        { status: 404 }
      )
    }

    // Check if name is taken by another building
    const existingBuilding = await Building.findOne({ name, _id: { $ne: id } })
    if (existingBuilding) {
      return NextResponse.json(
        { message: 'Building with this name already exists' },
        { status: 400 }
      )
    }

    // Update building
    building.name = name
    await building.save()

    return NextResponse.json(building, { status: 200 })
  } catch (error) {
    console.error('Error updating building:', error)
    return NextResponse.json(
      { message: 'Failed to update building' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await connectToDB()

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid building ID' },
        { status: 400 }
      )
    }

    // Check if building exists
    const building = await Building.findById(id)
    if (!building) {
      return NextResponse.json(
        { message: 'Building not found' },
        { status: 404 }
      )
    }

    // Check if building has rooms
    const rooms = await Room.find({ building: id })
    if (rooms.length > 0) {
      return NextResponse.json(
        {
          message: 'Cannot delete building with rooms. Remove all rooms first.',
        },
        { status: 400 }
      )
    }

    // Delete building
    await Building.findByIdAndDelete(id)

    return NextResponse.json(
      { message: 'Building deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting building:', error)
    return NextResponse.json(
      { message: 'Failed to delete building' },
      { status: 500 }
    )
  }
}
