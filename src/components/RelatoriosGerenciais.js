import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, useMediaQuery, useTheme,
  Paper, CircularProgress, Stack, Snackbar, Alert, Tooltip
} from '@mui/material';
import { AdfScanner } from '@mui/icons-material';
import axios from 'axios';

export function RelatoriosGerenciais({ text }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Snackbar
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const carregarBPMsVisitados = () => {
    setLoading(true);
    axios
      .get('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/qtdBPMsVisitados')
      .then((res) => {
        if (res.data.success) {
          setRows(res.data.data || []);
        }
        showAlert(res.data.message, res.data.severity || 'info');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar dados:', err);
        showAlert('Erro ao buscar dados no servidor.', 'error');
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarBPMsVisitados();
  }, []);

  // Gerar relatório PDF

  // Gerar relatório PDF
  const handleReport = (id) => {
      const newTab = window.open('', '_blank'); // sem noopener/noreferrer no iOS
      if (!newTab) {
        showAlert('Permita pop-ups para abrir o relatório.', 'warning');
        return;
      }

      const endpoint =  'https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/gerar-relatorio-bpm';
      const html = `
    <!doctype html>
    <html lang="pt-br">
    <head>
      <meta charset="utf-8" />
      <title>Gerando relatório…</title>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <style>
        body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:24px}
      </style>
    </head>
    <body>
      <p>Gerando relatório…</p>
      <script>
        (async () => {
          try {
            const resp = await fetch('${endpoint}?id=${encodeURIComponent(id)}', { method: 'POST' });
            const data = await resp.json();
            if (data && data.success && data.data && data.data.url) {
              location.replace(data.data.url);
            } else {
              document.body.innerHTML = '<p>Falha ao gerar relatório.</p>';
            }
          } catch (err) {
            document.body.innerHTML = '<p>Erro ao gerar relatório.</p>';
          }
        })();
      </script>
    </body>
    </html>`;
      newTab.document.open();
      newTab.document.write(html);
      newTab.document.close();
    };
  
  return (
    <Box sx={{ px: 2, py: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: 1000, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={3} textAlign="center">
            {text || 'Relatórios Gerenciais'}
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : rows.length === 0 ? (
            <Box py={5}>
              <Typography textAlign="center" color="text.secondary">
                Nenhum registro localizado na base de dados.
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>CPR</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>BPM</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>PDF</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .map((row) => (
                        <TableRow hover key={row.ID_BPM}>
                          <TableCell>{row.DS_CPR}</TableCell>
                          <TableCell>{row.DS_BPM}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Gerar PDF por BPM">
                                <span>
                                  <IconButton
                                    onClick={() => handleReport(row.ID_BPM)}
                                    color="secondary"
                                    size={isMobile ? 'small' : 'medium'}
                                  >
                                    <AdfScanner fontSize={isMobile ? 'small' : 'medium'} />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
