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

  const carregarPatrimonios = () => {
    setLoading(true);
    axios
      .get('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/listar-todos-patrimonios')
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
    carregarPatrimonios();
  }, []);

  // Gerar relatório PDF
  const handleReport = async (id) => {
    try {
      showAlert('Gerando relatório...', 'info');
      const resp = await axios.post(
        'https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/gerar-relatorio-patrimonio',
        null,
        { params: { id } }
      );
      if (resp.data.success) {
        const url = resp.data.data?.url;
        showAlert('Relatório pronto!', 'success');
        if (url) window.open(url, '_blank');
      } else {
        showAlert(resp.data.message || 'Falha ao gerar relatório.', 'warning');
      }
    } catch (e) {
      console.error(e);
      showAlert('Erro ao gerar relatório.', 'error');
    }
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
                      <TableCell sx={{ fontWeight: 'bold' }}>PCS</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .map((row) => (
                        <TableRow hover key={row.ID_PATRIMONIO}>
                          <TableCell>{row.DS_CPR}</TableCell>
                          <TableCell>{row.DS_BPM}</TableCell>
                          <TableCell>{row.DS_PCS}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Gerar PDF">
                                <span>
                                  <IconButton
                                    onClick={() => handleReport(row.ID_PATRIMONIO)}
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
