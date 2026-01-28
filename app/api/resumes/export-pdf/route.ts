import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: POST /api/resumes/export-pdf
 * 
 * Tạo file PDF từ HTML/CSS sử dụng Puppeteer
 * 
 * Environment handling:
 * - Local: Sử dụng puppeteer với Chrome đầy đủ
 * - Vercel: Sử dụng puppeteer-core + @sparticuz/chromium
 */

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { content, styles, margin = 0 } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Missing HTML content" },
        { status: 400 }
      );
    }

    // Check content size (max 5MB)
    const contentSize = new Blob([content]).size;
    if (contentSize > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Content too large (max 5MB)" },
        { status: 413 }
      );
    }

    // Dynamic import Puppeteer based on environment
    let browser;
    const isProduction = process.env.NODE_ENV === "production";
    const isVercel = process.env.VERCEL === "1";

    console.log(`[PDF Export] Environment: ${isProduction ? "production" : "development"}, Vercel: ${isVercel}`);

    if (isVercel || isProduction) {
      // Production: Use puppeteer-core + @sparticuz/chromium
      const puppeteer = await import("puppeteer-core");
      
      console.log("[PDF Export] Using puppeteer-core with @sparticuz/chromium");

      let launchOptions: any = {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
      };

      try {
        const chromium = await import("@sparticuz/chromium" as any);
        const executablePath = await chromium.default.executablePath();
        
        if (!executablePath) {
          throw new Error("Failed to get Chromium executable path");
        }

        launchOptions = {
          args: chromium.default.args || launchOptions.args,
          defaultViewport: chromium.default.defaultViewport,
          executablePath: executablePath,
          headless: chromium.default.headless !== false,
        };
        
        console.log(`[PDF Export] Chromium executable path: ${executablePath}`);
      } catch (chromiumError) {
        console.error("[PDF Export] Error loading @sparticuz/chromium:", chromiumError);
        
        // Fallback: Try using browser channel instead of executablePath
        console.log("[PDF Export] Falling back to chrome channel");
        launchOptions = {
          ...launchOptions,
          channel: "chrome", // Chrome, chromium, firefox, msedge
        };
      }

      browser = await puppeteer.default.launch(launchOptions);
    } else {
      // Local development: Use full puppeteer
      const puppeteer = await import("puppeteer");

      console.log("[PDF Export] Using full puppeteer for local development");

      browser = await puppeteer.default.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
      });
    }

    const page = await browser.newPage();

    // Build complete HTML with injected styles and fonts
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume Export</title>
          
          <!-- Tailwind CSS -->
          <script src="https://cdn.tailwindcss.com"></script>
          
          <!-- Google Fonts for Vietnamese support -->
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
          
          <style>
            @page {
              size: A4;
              margin: ${margin}px;
            }
            
            * {
              box-sizing: border-box;
            }
            
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              background: white;
            }
            
            body {
              font-family: 'Inter', 'Roboto', sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
            }
            
            /* Inject custom styles */
            ${styles || ""}
            
            /* Hide page break indicators */
            .page-break-line {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;

    // Set content and wait for all resources to load
    await page.setContent(htmlContent, {
      waitUntil: ["networkidle0", "load"],
      timeout: 30000,
    });

    // Additional wait for fonts to load
    await page.evaluateHandle("document.fonts.ready");

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });

    await browser.close();

    const duration = Date.now() - startTime;
    console.log(`[PDF Export] Generated successfully in ${duration}ms`);

    // Return PDF with proper headers
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[PDF Export] Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const duration = Date.now() - startTime;

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        message: errorMessage,
        duration: `${duration}ms`,
      },
      { status: 500 }
    );
  }
}
