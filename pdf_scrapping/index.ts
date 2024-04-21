const puppeteer = require('puppeteer');
const fs = require('fs');
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';

const test1 = 'https://www.livecareer.com/resume-search/r/software-engineer-1f60a4debfe84d8daa9c00c430bc9ace';
const test2 = 'https://www.livecareer.com/resume-search/r/software-engineer-302c676edf1f4e91b1588029280a8452';

// go to https://www.livecareer.com/resume-search/
// fill position query
// pagination pg=2 / https://www.livecareer.com/resume-search/search?jt=human+resources&pg=2
// recursive or check each div class = 'resume-data' -> parent one level a -> go to href
// save query selector '#server-resume-template' as pdf
// save file name = div class = name, since this always as Jessica Claire
   //-> make collection of this random Name ?
   // -> random adress
//
(async () => {
    const browser = await puppeteer.launch({
        //executablePath: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        headless: true
    });
    const page = await browser.newPage();
    page.setUserAgent(ua);
try {
    // Navigate to the webpage containing the data you want to scrape
    await page.goto(test1);
} catch (error) {
    console.error('Navigation failed:', error);
}

    // Wait for the div with the id 'server-resume-template' to be rendered
    await page.waitForSelector('#server-resume-template');

    // Extract the inner HTML content of the div
    const data = await page.$eval('#server-resume-template', (div: Element) => div.innerHTML);
    await page.setContent(data);

    // Generate PDF from HTML content
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    // Save PDF to file

    fs.writeFileSync('output.pdf', pdfBuffer);

    // Close the br

    //console.log(data); // Output or further process the scraped data

    await browser.close();
    console.log('PDF file saved successfully');
})();
