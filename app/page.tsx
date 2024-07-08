'use client';
import { useState } from 'react';
import Image from 'next/image'; // Import the Image component
import logo from '../public/SalesplayX.png'; // Import the logo image

export default function Home() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateContent = async () => {
    setLoading(true);
    setError('');
    setContent('');
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate content');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value);
          setContent((prev) => prev + decoder.decode(value));
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
      // Assert the error type as Error
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Add the logo image */}
      <Image src={logo} alt="SalesplayX Logo" width={134} height={134} style={styles.logo} />
      <div style={styles.contentBox}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic"
          style={styles.input}
        />
        <textarea
          value={content}
          readOnly
          placeholder="Generated content will appear here..."
          style={styles.textArea}
          rows={20}
        />
        <button onClick={handleGenerateContent} disabled={loading} style={styles.button}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
        {error && (
          <div style={styles.error}>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'white', // Change background to white
    color: 'black', // Change text color to black for better contrast
    fontFamily: 'Arial, sans-serif',
    marginBottom: '0.5in', // Add a margin at the bottom
  },
  logo: {
    marginBottom: '1rem', // Add some margin below the logo
  },
  contentBox: {
    width: '80%',
    height: '80%',
    padding: '2rem',
    background: '#f0f0f0', // Change background to a light color for contrast
    borderRadius: '8px',
    boxShadow: '5px 5px 10px #ccc, -5px -5px 10px #fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center align children
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    fontSize: '1rem',
    color: '#333',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    boxShadow: 'inset 2px 2px 5px #ddd, inset -2px -2px 5px #fff',
  },
  textArea: {
    flexGrow: 1,
    marginBottom: '1rem',
    padding: '1rem',
    fontSize: '1rem',
    color: '#333', // Change text color for better contrast
    background: '#fff', // Change background to white
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    resize: 'none',
    boxShadow: 'inset 2px 2px 5px #ddd, inset -2px -2px 5px #fff',
    width: '100%', // Make the text area take the full width
    display: 'block', // Ensure block display
    whiteSpace: 'pre-wrap', // Ensure text wraps correctly
    overflowWrap: 'break-word', // Ensure words wrap correctly
    fontFamily: 'Arial, sans-serif', // Ensure correct font is applied
    writingMode: 'horizontal-tb', // Ensure horizontal text direction
    direction: 'ltr', // Ensure left-to-right text direction
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    color: '#fff',
    background: '#0070f3',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    alignSelf: 'flex-end',
  },
  buttonHover: {
    background: '#005bb5',
  },
  error: {
    marginTop: '1rem',
    color: 'red',
  },
};
