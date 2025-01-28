import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js only when needed
const initializePdfLib = () => {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
};

export const pdfService = {
  async extractText(file) {
    try {
      // Initialize PDF.js when the function is called
      initializePdfLib();

      // Validate input
      if (!file) {
        throw new Error('No file provided');
      }

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document with proper configuration
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/',
        useSystemFonts: true,
        useWorkerFetch: true,
        verbosity: 0
      });

      // Add progress monitoring
      loadingTask.onProgress = function(progress) {
        if (progress.total > 0) {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Loading PDF: ${Math.round(percent)}%`);
        }
      };

      const pdf = await loadingTask.promise;
      let fullText = '';
      let successfulPages = 0;
      
      // Extract text from each page with better error handling
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          console.log(`Processing page ${i}/${pdf.numPages}`);
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent({
            normalizeWhitespace: true,
            disableCombineTextItems: false
          });
          
          const pageText = textContent.items
            .map(item => item.str)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (pageText) {
            fullText += pageText + '\n\n';
            successfulPages++;
          }
        } catch (pageError) {
          console.error(`Error extracting text from page ${i}:`, pageError);
          continue; // Skip problematic pages but continue with others
        }
      }

      const finalText = fullText.trim();
      
      if (!finalText) {
        throw new Error('No text content could be extracted from the PDF');
      }
      
      console.log(`Successfully extracted text from ${successfulPages} of ${pdf.numPages} pages`);
      return finalText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  }
};