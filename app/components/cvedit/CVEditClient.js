'use client';
import React, { useState, useEffect } from 'react';
import { CssBaseline, Container, ThemeProvider, Box, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import CVEditor from './CVEditor';
import theme from '../../theme';

export default function CVEditClient() {
  const [cvData, setCvData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNavBar, setShowNavBar] = useState(false);
  const t = useTranslations('cvedit.editor');

  useEffect(() => {
    const fetchCVData = async () => {
      if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('cvUserId');
        if (userId) {
          try {
            const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch CV data');
            const data = await response.json();
            setCvData(data);
          } catch (error) {
            console.error("Error fetching CV data:", error.message);
          } finally {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    };
    
    fetchCVData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      transition: {
        ease: "easeInOut"
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', 
          background: theme.gradient.background,
        }}
      >
        <NavBar show={showNavBar} />
        <AnimatePresence mode="wait">
          <motion.div
            key="cv-editor-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Container
              component="main" 
              maxWidth="lg"
              sx={{
                mt: { xs: 8, sm: 12 }, 
                mb: 4,
                width: '90%',
                backgroundColor: 'background.paper',
                padding: { xs: 2, sm: 4 }, 
                borderRadius: '24px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <CircularProgress />
                  <span>{t('loading')}</span>
                </Box>
              ) : (
                <CVEditor 
                  cvData={cvData} 
                  setCvData={setCvData} 
                  setIsGeneratingPDF={setIsGeneratingPDF}
                  setShowNavBar={setShowNavBar}
                />
              )}
            </Container>
          </motion.div>
        </AnimatePresence>
        <Footer />
      </Box>
    </ThemeProvider>
  );
} 