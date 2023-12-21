import {createReadStream} from 'node:fs';
import path from 'path';
import Excel from 'exceljs'
import {pipeline} from  'node:stream/promises';
import { fileURLToPath } from 'url';
import {Writable} from 'node:stream';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '..','temp', 'file.xlsx');

const stream = createReadStream(filePath);

const options: Excel.stream.xlsx.WorkbookStreamReaderOptions = {
  sharedStrings: 'emit',
  hyperlinks: 'emit',
  worksheets: 'emit',
}

// Readable Stream
const workbook = new Excel.stream.xlsx.WorkbookReader(stream, options);

// Transform Stream
async function *transform(workbook: Excel.stream.xlsx.WorkbookReader){
  // Trata ou processa aqui
  for await (const worksheet of workbook){
    for await (const row of worksheet) {
      //passa pra frente pra próxima etapa

      yield row.values.join(', ');
    }
  }
}

// Writable Stream
const output = new Writable({
  write(chunk: any, enc: any, callback: any){
    console.log(chunk.toString());
    callback();
  }
})

await pipeline(workbook,  transform, output);






