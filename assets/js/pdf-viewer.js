// renders all pages of PDF
(function () {
  'use strict';

  // Initialize PDF.js
  let pdfjsLib = null;
  let isPdfJsLoaded = false;

  // Load PDF.js from CDN
  function loadPdfJs() {
    if (isPdfJsLoaded) return Promise.resolve();

    return new Promise((resolve, reject) => {
      if (typeof pdfjsLib !== 'undefined' && pdfjsLib !== null) {
        isPdfJsLoaded = true;
        resolve();
        return;
      }

      // Load PDF.js library
      const script = document.createElement('script');
      script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        isPdfJsLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Render a single page of PDF
  async function renderPage(pdf, pageNumber, container) {
    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      container.appendChild(canvas);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Add page number label
      const pageLabel = document.createElement('div');
      pageLabel.className = 'pdf-page-label';
      pageLabel.textContent = `Page ${pageNumber}`;
      container.appendChild(pageLabel);

      return canvas;
    } catch (error) {
      console.error('Error rendering PDF page:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'pdf-error';
      errorDiv.textContent = `Error loading page ${pageNumber}: ${error.message}`;
      container.appendChild(errorDiv);
    }
  }

  // Render all pages of a PDF
  async function renderPdf(pdfUrl, container) {
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="pdf-loading">Loading PDF...</div>';

    try {
      // Load PDF.js if not already loaded
      await loadPdfJs();

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      // Clear loading message
      container.innerHTML = '';

      // Create wrapper for all pages
      const pagesWrapper = document.createElement('div');
      pagesWrapper.className = 'pdf-pages-wrapper';
      container.appendChild(pagesWrapper);

      // Render all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const pageContainer = document.createElement('div');
        pageContainer.className = 'pdf-page-container';
        pagesWrapper.appendChild(pageContainer);
        await renderPage(pdf, pageNum, pageContainer);
      }

      // Add PDF info
      const infoDiv = document.createElement('div');
      infoDiv.className = 'pdf-info';
      infoDiv.textContent = `Total pages: ${pdf.numPages}`;
      container.appendChild(infoDiv);
    } catch (error) {
      console.error('Error loading PDF:', error);
      container.innerHTML = `<div class="pdf-error">Error loading PDF: ${error.message}</div>`;
    }
  }

  // Process all PDF containers on the page
  function processPdfContainers() {
    // Process data-pdf attributes
    document.querySelectorAll('[data-pdf]').forEach((container) => {
      const pdfUrl = container.getAttribute('data-pdf');
      if (pdfUrl && !container.hasAttribute('data-pdf-processed')) {
        container.setAttribute('data-pdf-processed', 'true');
        renderPdf(pdfUrl, container);
      }
    });

    // Process PDF links with class 'pdf-viewer'
    document.querySelectorAll('a.pdf-viewer[href$=".pdf"]').forEach((link) => {
      const pdfUrl = link.getAttribute('href');
      if (pdfUrl && !link.hasAttribute('data-pdf-processed')) {
        link.setAttribute('data-pdf-processed', 'true');

        // Create container
        const container = document.createElement('div');
        container.className = 'pdf-viewer-container';
        link.parentNode.insertBefore(container, link.nextSibling);

        renderPdf(pdfUrl, container);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processPdfContainers);
  } else {
    processPdfContainers();
  }

  // Re-process after dynamic content updates (for markdown preview)
  const observer = new MutationObserver(() => {
    processPdfContainers();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Expose renderPdf function globally for manual use
  window.renderPdf = renderPdf;
})();
