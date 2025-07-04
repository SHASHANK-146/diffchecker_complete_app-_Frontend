import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { FaUniversity } from 'react-icons/fa';

function App() {
  const [inputFile, setInputFile] = useState(null);
  const [bankFile, setBankFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputRef = useRef();
  const bankRef = useRef();

  const handleUpload = async () => {
    if (!inputFile || !bankFile) {
      setMessage('⚠️ Please select both input and bank files');
      return;
    }

    const formData = new FormData();
    formData.append('input', inputFile);
    formData.append('bank', bankFile);

    try {
      setLoading(true);
      setMessage('');
      setSuccess(false);

      const response = await axios.post('http://localhost:5000/upload', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'comparison_output.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Reset input fields
      inputRef.current.value = '';
      bankRef.current.value = '';
      setInputFile(null);
      setBankFile(null);

      setMessage('✅ Report download started');
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <FaUniversity className="header-icon" />
        <h1>Bank Statement Comparator</h1>
      </header>

      <div className="form-grid">
        <div>
          <label>Input Statement</label>
          <input type="file" ref={inputRef} onChange={(e) => setInputFile(e.target.files[0])} />
        </div>
        <div>
          <label>Bank Statement</label>
          <input type="file" ref={bankRef} onChange={(e) => setBankFile(e.target.files[0])} />
        </div>
        <div className="button-wrapper">
          <button onClick={handleUpload} disabled={loading}>
            {loading ? 'Comparing...' : 'Compare and Download Report'}
          </button>
        </div>
      </div>

      {loading && <div className="progress-bar"><div className="progress"></div></div>}

      {success && (
        <div className="success-animation">
          <div className="checkmark">&#10004;</div>
          <p className="message success">{message}</p>
        </div>
      )}

      {!success && !loading && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
