// Simple mock untuk testing - hapus nanti
export async function uploadToDrive(file: File) {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const mockFileId = 'mock-' + Date.now()
  
  return {
    success: true,
    fileId: mockFileId,
    fileName: file.name,
    downloadLink: `https://picsum.photos/1000?random=${mockFileId}`,
    viewLink: `https://picsum.photos/1000?random=${mockFileId}`,
    thumbnailLink: `https://picsum.photos/1000?random=${mockFileId}`,
    uploadedAt: new Date().toISOString()
  }
}

export async function getDrivePhotos() {
  // Return mock photos
  return {
    success: true,
    photos: [
      {
        id: '1',
        src: 'https://picsum.photos/1000?random=1',
        viewLink: 'https://picsum.photos/1000?random=1',
        name: 'Sample Photo 1',
        uploadedAt: new Date().toISOString()
      },
      {
        id: '2',
        src: 'https://picsum.photos/1000?random=2', 
        viewLink: 'https://picsum.photos/1000?random=2',
        name: 'Sample Photo 2',
        uploadedAt: new Date().toISOString()
      }
    ]
  }
}