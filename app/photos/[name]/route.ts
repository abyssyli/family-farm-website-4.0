import { readFile } from "node:fs/promises"
import { extname, join } from "node:path"
import { NextResponse } from "next/server"

function contentTypeFromExt(ext: string) {
  switch (ext.toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".png":
      return "image/png"
    case ".webp":
      return "image/webp"
    case ".gif":
      return "image/gif"
    case ".mp3":
      return "audio/mpeg"
    default:
      return "application/octet-stream"
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { name: string } }
) {
  const name = params.name
  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return new NextResponse("Not found", { status: 404 })
  }

  try {
    const filePath = join(process.cwd(), "photo", name)
    const bytes = await readFile(filePath)
    const ext = extname(name)
    return new NextResponse(bytes, {
      headers: { [modified]
        "content-type": contentTypeFromExt(ext),
        "cache-control": "public, max-age=31536000, immutable"
      }
    })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}