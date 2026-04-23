import puppeteer from "puppeteer";

export async function GET() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://theindianberg.com/", {
    waitUntil: "networkidle2",
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Extract titles + links
  const articles = await page.evaluate(() => {
    const data: any[] = [];

    document.querySelectorAll("a").forEach(el => {
      const title = el.innerText?.trim();
      const link = (el as HTMLAnchorElement).href;

      if (
        title &&
        title.length > 30 &&
        link &&
        link.includes("theindianberg.com")
      ) {
        data.push({ title, link });
      }
    });

    // remove duplicates
    const unique: any[] = [];
    const seen = new Set();

    data.forEach(item => {
      if (!seen.has(item.link)) {
        seen.add(item.link);
        unique.push(item);
      }
    });

    return unique.slice(0, 15);
  });

  // Extract images
  for (let article of articles) {
    const newPage = await browser.newPage();

    try {
      await newPage.goto(article.link, {
        waitUntil: "networkidle2",
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const image = await newPage.evaluate(() => {
        const selectors = [
          "article img",
          ".post img",
          ".entry-content img",
          "img"
        ];

        for (let sel of selectors) {
          const img = document.querySelector(sel) as HTMLImageElement;
          if (img && img.src && img.src.startsWith("http")) {
            return img.src;
          }
        }

        return null;
      });

      article.image = image;

    } catch (e) {
      article.image = null;
    }

    await newPage.close();
  }

  await browser.close();

  return Response.json(articles);
}