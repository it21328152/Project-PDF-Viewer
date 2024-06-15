import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';

// Set the workerSrc for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState('');

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/pdfs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        });
        const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        setPdfUrl(url);
      } catch (err) {
        setError('Failed to load PDF');
      }
    };

    fetchPdf();

    // Cleanup object URL on component unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [id]);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      )}
    </div>
  );
};

export default PDFViewer;
