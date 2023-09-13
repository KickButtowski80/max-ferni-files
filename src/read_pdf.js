const fs = require('node:fs/promises');
const { readdir } = require('node:fs/promises') ;
const pdfjsLib = require('pdfjs-dist');

// Path to the PDF file you want to read
// const pdfPath = './src/pdfFiles/max8Invoice.pdf';

// paths for pdf files

// const pdfPaths = [
//   "./src/pdfFiles/max8Invoice.pdf",
//   "./src/pdfFiles/max9Invoice.pdf"
// ]

let pdfPaths = []
let files = []
var total = 0.0
const path = './src/pdfFiles';
//async 
// fs.readdir(path, (err, files) => {
//   if (err) {
//     console.error('Error reading directory:', err);
//   } else {
//     console.log('Files in directory:', files);
//     // debugger;
//   }
// });
(async () => {
  try {
    files = await readdir(path);
    // for (const file of files)
    //   console.log(file);
  } catch (err) {
    console.error(err);
  }
})();
//sync 

// try {
//   files = fs.readdirSync(path);
//   // console.log('Files in directory:', files);

// } catch (err) {
//   console.error('Error reading directory:', err);
// }

let retrivePdfPaths = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
     
      pdfPaths = [...files.map(f => path + '/' + f)]
      resolve(pdfPaths)
    }, 0);
  })
}

retrivePdfPaths()
  .then(result => {    
    console.log("Success:", result);
    pdfPaths.concat(result)
    console.log("Success:", pdfPaths);
    debugger;
  })
  .catch(error => {
    console.error("Error:", error);
  });
debugger

// for (let index = 0; index < pdfPaths.length; index++) {
//   // Read the PDF file
//   fs.readFile(pdfPaths[index], (err, data) => {
//     if (err) {
//       console.error('Error reading PDF:', err);
//       return;
//     }
//     const uint8ArrayData = new Uint8Array(data);
//     // Load the PDF data into a PDFDocumentProxy object
//     pdfjsLib.getDocument(uint8ArrayData).promise.then(pdfDoc => {
//       const numPages = pdfDoc.numPages;
//       // Read content from each page
//       for (let pageNum = 1; pageNum < numPages; pageNum++) {
//         pdfDoc.getPage(pageNum).then(page => {
//           page.getTextContent().then(textContent => {
//             // const pageText = textContent.items.map(item => item.str)
//             // pageText.filter(x => x.includes('Total:'))
//             // let locTotal = pageText.indexOf('Total:');
//             // if (locTotal === -1) return;
//             // let numbers$ = 0;
//             // do {
//             //   locTotal += 1
//             //   if (pageText[locTotal].includes("$")) numbers$++
//             // } while (numbers$ < 2)
//             //  console.log('the pageText total', pageText[locTotal])
//             // let realTotal = parseFloat(pageText[locTotal].slice(1));
//             debugger;
//             const realTotal = retriveRealTotal(textContent)
//             console.log('real total is', realTotal)
//             total += realTotal
//             console.log('total is ', total.toFixed(2))
//             // debugger;
//             // if (pageNum === numPages) {
//             //   console.log("the total is", total.toFixed(2))
//             // }
//           });
//         });
//       }
//       console.log("the total after the foor loop  is done is", total.toFixed(2))

//     }).catch(err => {
//       console.error('Error loading PDF document:', err);
//     });

//   });
// }
// some other operation is being done so fs is undefined 
// how to close the file properly?
// fs.closeSync()

(async () => {
  try {
    const files = await readdir(path);
    const pdfPaths = files.map(f => path + '/' + f);

    // Initialize the total variable here
    let total = 0.0;

    for (let index = 0; index < pdfPaths.length; index++) {
      // Read the PDF file
      const data = await fs.readFile(pdfPaths[index]);
      const uint8ArrayData = new Uint8Array(data);

      // Load the PDF data into a PDFDocumentProxy object
      const pdfDoc = await pdfjsLib.getDocument(uint8ArrayData).promise;
      const numPages = pdfDoc.numPages;

      // Read content from each page
      for (let pageNum = 1; pageNum < numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Retrieve the real total from the page
        const realTotal = retrieveRealTotal(textContent);
        console.log('real total is', realTotal);

        // Update the total
        total += realTotal;
        console.log('total is', total.toFixed(2));
      }

      console.log('the total after processing this file is', total.toFixed(2));
    }
  } catch (err) {
    console.error('Error:', err);
  }
})();

function retrieveRealTotal(textContent) {
  debugger;
  const pageText = textContent.items.map(item => item.str)
    .filter(item => item.trim() !== "")
  let locTotal = pageText.indexOf('Total:');
  if (locTotal === -1) return 0;
  let numbers$ = 0;
  do {
    locTotal += 1
    if (pageText[locTotal].includes("$")) numbers$++
  } while (numbers$ < 2)
  const realTotal = parseFloat(pageText[locTotal].slice(1))
  return realTotal
}




