import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToDrive, setCredentials } from '@/lib/drive/googleDrive';

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Upload API called");
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // 🚨 DEBUG: Check if file exists
    if (!file) {
      console.error("❌ No file received");
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    console.log("📁 File received:", file.name, file.size, file.type);

    // 🚨 Get tokens from cookies
    const tokensCookie = request.cookies.get('drive_tokens');
    
    if (!tokensCookie) {
      console.error("❌ No Google auth tokens found in cookies");
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated with Google. Please login again.' 
      }, { status: 401 });
    }

    try {
      const tokens = JSON.parse(tokensCookie.value);
      console.log("🔑 Tokens found, setting credentials...");
      
      // Set Google credentials
      setCredentials(tokens);
    } catch (tokenError) {
      console.error("❌ Token parsing error:", tokenError);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid authentication tokens' 
      }, { status: 401 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log("📤 Uploading to Google Drive...");

    // Upload to Google Drive
    let driveFile;
    try {
      driveFile = await uploadToDrive(buffer, file.name, file.type);
      console.log("✅ Drive upload success:", driveFile.id);
    } catch (driveError) {
      console.error("❌ Drive upload failed:", driveError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to upload to Google Drive' 
      }, { status: 500 });
    }

    if (!driveFile.id) {
      console.error("❌ No file ID from Drive");
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to get file ID from Drive' 
      }, { status: 500 });
    }

    // 🚨 Create public URL (READ-ONLY)
    const publicUrl = `https://drive.google.com/uc?id=${driveFile.id}&export=view`;
    
    console.log("🌐 Public URL created:", publicUrl);

    // Save to database
    let photo;
    try {
      photo = await prisma.photo.create({
        data: {
          name: file.name,
          src: publicUrl,
          driveId: driveFile.id,
          uploadedAt: new Date(),
        },
      });
      console.log("💾 Database save success:", photo.id);
    } catch (dbError) {
      console.error("❌ Database save failed:", dbError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to save to database' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      photo: {
        id: photo.id.toString(),
        name: photo.name,
        src: photo.src,
        uploadedAt: photo.uploadedAt.toISOString(),
      }
    });

  } catch (error) {
    console.error('❌ Upload API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Upload failed - internal server error' 
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';