import { api } from './client'

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export async function uploadAttachment(file: File) {
  const dataBase64 = await readFileAsBase64(file)
  return api.post<{ url: string }>('/api/upload', {
    filename: file.name,
    contentType: file.type,
    dataBase64,
  })
}
