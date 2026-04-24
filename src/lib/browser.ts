import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function getBrowser() {
  if (process.env.NODE_ENV === "production") {
    const executablePath = await chromium.executablePath();
    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless as any,
    });
  } else {
    // For local development
    // You might need to change this path to your local Chrome/Chromium path
    // or install 'puppeteer' locally for dev.
    // For now, let's try to find it automatically or use a common path.
    const localExecutablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"; 
    
    return await puppeteer.launch({
      executablePath: localExecutablePath,
      headless: true,
    });
  }
}
