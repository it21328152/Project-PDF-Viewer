import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Button, Container, List, ListItem, ListItemText, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useDropzone } from 'react-dropzone';

//test 

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(8),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(4),
}));

const UploadBox = styled(Box)(({ theme, isDragActive }) => ({
  border: '2px dashed #ccc',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  transition: 'background-color 0.3s',
  backgroundColor: isDragActive ? '#e0f7fa' : 'transparent',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '150px', // Adjust height as needed
}));

const ArrowContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '10%', // Adjust to position the arrow inside the box
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  animation: 'bounce 2s infinite',
}));

const Arrow = styled('div')(({ theme }) => ({
  width: '0',
  height: '0',
  borderLeft: '10px solid transparent',
  borderRight: '10px solid transparent',
  borderBottom: '20px solid #3f51b5',
}));

const Home = () => {
  const [pdfs, setPdfs] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPdfs = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/pdfs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPdfs(res.data.pdfs);
    };
    fetchPdfs();
  }, []);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('pdf', file);
    const token = localStorage.getItem('token');
    try {
      setUploading(true);
      await axios.post('http://localhost:5000/api/pdfs/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      // Refetch PDFs
      const res = await axios.get('http://localhost:5000/api/pdfs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPdfs(res.data.pdfs);
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/pdf' });

  return (
    <Container component="main" maxWidth="md">
      <Root>
        <StyledCard>
          <CardContent>
            <Typography component="h1" variant="h5">
              Upload PDF
            </Typography>
            <UploadBox {...getRootProps({ isDragActive })}>
              <ArrowContainer>
                <Arrow />
              </ArrowContainer>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <Typography>Drop the file here ...</Typography> :
                  <Typography>Drag 'n' drop a file here, or click to select a file</Typography>
              }
            </UploadBox>
            {file && <Typography variant="body1" style={{ marginTop: '10px' }}>{file.name}</Typography>}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{ marginTop: '10px' }}
            >
              {uploading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardContent>
            <Typography component="h2" variant="h6">
              <b>Uploaded PDFs</b>
            </Typography>
            <List>
              {pdfs.map((pdf) => (
                <ListItem button component={Link} to={`/pdf/${pdf._id}`} key={pdf._id}>
                  <ListItemText primary={pdf.filename} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </StyledCard>
      </Root>
    </Container>
  );
};

export default Home;
