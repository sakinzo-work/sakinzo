const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const size = Buffer.alloc(4);
  size.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([size, name, data, crc]);
}

function insidePolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function sample(x, y) {
  let color = [15, 17, 23, 255];
  const top = [[.20,.28],[.50,.11],[.80,.28],[.70,.43],[.50,.36],[.30,.43]];
  const body = [[.20,.28],[.30,.43],[.21,.57],[.50,.88],[.79,.57],[.70,.43],[.50,.36]];
  const core = [[.30,.43],[.50,.36],[.70,.43],[.50,.76]];
  if (insidePolygon(x, y, body)) color = [22, 115, 255, 255];
  if (insidePolygon(x, y, top)) color = [70, 145, 255, 255];
  if (insidePolygon(x, y, core)) color = [121, 178, 255, 255];
  return color;
}

function createPng(size) {
  const data = Buffer.alloc((size * 4 + 1) * size);
  const samples = 3;
  for (let y = 0; y < size; y += 1) {
    const row = y * (size * 4 + 1);
    data[row] = 0;
    for (let x = 0; x < size; x += 1) {
      const sum = [0, 0, 0, 0];
      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const rgba = sample((x + (sx + .5) / samples) / size, (y + (sy + .5) / samples) / size);
          rgba.forEach((value, index) => { sum[index] += value; });
        }
      }
      const offset = row + 1 + x * 4;
      sum.forEach((value, index) => { data[offset + index] = Math.round(value / (samples * samples)); });
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(data, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const output = path.join(__dirname, '..', 'frontend');
for (const size of [192, 512]) fs.writeFileSync(path.join(output, `admin-icon-${size}.png`), createPng(size));
console.log('Generated admin PWA icons: 192px, 512px');
