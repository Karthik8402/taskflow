import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.resolve(__dirname, '../public')

// Minimal valid PNG generator for 192x192 and 512x512 blue branded icons
function createPNGData(size) {
  // We write valid PNG file buffer with RGBA pixels
  const width = size
  const height = size
  
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  
  // IHDR chunk
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type (RGBA)
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  const ihdrChunk = createChunk('IHDR', ihdr)
  
  // IDAT chunk (raw uncompressed scanlines with blue background #2563EB)
  const lineLength = 1 + width * 4
  const rawData = Buffer.alloc(height * lineLength)
  
  for (let y = 0; y < height; y++) {
    const offset = y * lineLength
    rawData[offset] = 0 // filter type None
    for (let x = 0; x < width; x++) {
      const px = offset + 1 + x * 4
      // Checkmark box logic
      const isMargin = x < width * 0.1 || x > width * 0.9 || y < height * 0.1 || y > height * 0.9
      if (isMargin) {
        // Deep slate bg
        rawData[px] = 11     // R
        rawData[px + 1] = 15 // G
        rawData[px + 2] = 23 // B
        rawData[px + 3] = 255// A
      } else {
        // Blue gradient bg #2563EB
        rawData[px] = 37    // R
        rawData[px + 1] = 99// G
        rawData[px + 2] = 235// B
        rawData[px + 3] = 255// A
      }
    }
  }

  // Simple zlib uncompressed store blocks
  const zlibHeader = Buffer.from([0x78, 0x01])
  const blocks = []
  const maxBlock = 65535
  for (let i = 0; i < rawData.length; i += maxBlock) {
    const end = Math.min(i + maxBlock, rawData.length)
    const chunkData = rawData.subarray(i, end)
    const isLast = end === rawData.length ? 1 : 0
    const header = Buffer.alloc(5)
    header[0] = isLast
    header.writeUInt16LE(chunkData.length, 1)
    header.writeUInt16LE(~chunkData.length & 0xffff, 3)
    blocks.push(header, chunkData)
  }

  // Adler32 checksum
  let a = 1, b = 0
  for (let i = 0; i < rawData.length; i++) {
    a = (a + rawData[i]) % 65521
    b = (b + a) % 65521
  }
  const adler32 = Buffer.alloc(4)
  adler32.writeUInt32BE(((b << 16) | a) >>> 0, 0)

  const idatPayload = Buffer.concat([zlibHeader, ...blocks, adler32])
  const idatChunk = createChunk('IDAT', idatPayload)
  
  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

function createChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  const crc = crc32(Buffer.concat([typeBuf, data]))
  crcBuf.writeUInt32BE(crc, 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

const icon192 = createPNGData(192)
const icon512 = createPNGData(512)

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192)
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512)

console.log('Successfully generated public/icon-192.png and public/icon-512.png PNG PWA icons!')
