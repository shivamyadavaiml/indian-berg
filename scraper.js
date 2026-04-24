import puppeteer from "puppeteer-core";

async function scrape() {
  const browser = await puppeteer.launch({ 
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", 
    headless: "new" 
  });
  const page = await browser.newPage();

  // Open website
  await page.goto("https://theindianberg.com/", {
    waitUntil: "networkidle2",
  });

  // Wait for content to load
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Extract data
  const articles = await page.evaluate(() => {
    const data = [];

    // Get all links
    document.querySelectorAll("a").forEach(el => {
      const title = el.innerText?.trim();
      const link = el.href;

      // Filter valid news links
      if (
        title &&
        title.length > 30 &&
        link &&
        link.includes("theindianberg.com")
      ) {
        data.push({
          title,
          link
        });
      }
    });

    // Remove duplicates using link
    const unique = [];
    const seen = new Set();

    data.forEach(item => {
      if (!seen.has(item.link)) {
        seen.add(item.link);
        unique.push(item);
      }
    });

    return unique;
  });

  // Show result
  console.log("✅ Scraped Articles:\n");
  console.log(articles.slice(0, 10));

  await browser.close();
}

scrape();