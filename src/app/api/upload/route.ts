import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    console.log("File upload started...")
    console.log("Request headers:", Object.fromEntries(request.headers.entries()))
    console.log("Request cookies:", request.cookies.getAll())
    
    const session = await getServerSession(authOptions)
    console.log("Session result:", session)
    
    if (!session?.user) {
      console.log("Upload unauthorized - no session found")
      return NextResponse.json({ error: "Unauthorized - please sign in" }, { status: 401 })
    }

    // Use email as fallback identifier if ID is not available (database issues)
    const userId = session.user.id || session.user.email || 'unknown'
    console.log("User authenticated:", userId)

    const data = await request.formData()
    const file: File | null = data.get('audioFile') as unknown as File

    if (!file) {
      console.log("No file provided in form data")
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    console.log("File received:", { name: file.name, size: file.size, type: file.type })

    // Validate file type
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/mpeg', 'audio/x-wav']
    const validExtensions = ['.mp3', '.wav', '.flac']
    const hasValidType = validTypes.includes(file.type)
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    
    if (!hasValidType && !hasValidExtension) {
      return NextResponse.json({ error: "Invalid file type. Please upload MP3, WAV, or FLAC files only." }, { status: 400 })
    }

    // Validate file size (200MB max)
    if (file.size > 200 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 200MB." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const fileName = `${userId.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}${fileExtension}`
    
    // Save to uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'audio')
    const filePath = path.join(uploadDir, fileName)
    
    // Ensure upload directory exists
    const fs = require('fs')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    await writeFile(filePath, buffer)
    console.log("File written successfully to:", filePath)
    
    // Return file information
    const result = {
      success: true,
      fileName: fileName,
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      fileUrl: `/uploads/audio/${fileName}`
    }
    
    console.log("Upload successful, returning:", result)
    return NextResponse.json(result)

  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}