import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, useMediaQuery, useTheme,
  CircularProgress, Snackbar, Alert,
  CardActionArea,
  Button
} from '@mui/material';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function EspelhoPatrimonios({ text }) {
  const [qtdRegitros, setQtdRegistros] = useState([]);
  const [qtdCPRs, setQtdCPRs] = useState([]);
  const [qtdBPMs, setQtdBPMs] = useState([]);
  const [qtdBases, setQtdBases] = useState([]);
  const [qtdModulos, setQtdModulos] = useState([]);
  const [qtdTorres, setQtdTorres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Snackbar
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

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
          setQtdRegistros(res.data.data || []);
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

  const carregarQtdCPRs = () => {
    axios
    .get('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/qtdCPRsVisitados')
    .then((res) => {
      if (res.data.success) {
        setQtdCPRs(res.data.data || []);
      } else {
        showAlert(res.data.message || 'Não foi possível carregar total de CPRs.', 'warning');
      }
    })
    .catch((err) => {
      console.error('Erro ao buscar total de CPRs visitados:', err);
      showAlert('Erro ao buscar total de CPRs visitados.', 'error');
    });
  };

  const carregarQtdBPMs = () => {
    axios
    .get('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/qtdBPMsVisitados')
    .then((res) => {
      if (res.data.success) {
        setQtdBPMs(res.data.data || []);
      } else {
        showAlert(res.data.message || 'Não foi possível carregar total de CPRs.', 'warning');
      }
    })
    .catch((err) => {
      console.error('Erro ao buscar total de CPRs visitados:', err);
      showAlert('Erro ao buscar total de CPRs visitados.', 'error');
    });
  };

   const carregarQtdBases = () => {
    axios
    .get('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/qtdBasesLocalizadas')
    .then((res) => {
      if (res.data.success) {
        setQtdBases(res.data.data || []);
      } else {
        showAlert(res.data.message || 'Não foi possível carregar total de Bases Localizadas.', 'warning');
      }
    })
    .catch((err) => {
      console.error('Erro ao buscar total de Bases Localizadas:', err);
      showAlert('Erro ao buscar total de Bases Localizadas.', 'error');
    });
  };

  const carregarQtdModulos = () => {
    axios
    .get('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/qtdModulosLocalizados')
    .then((res) => {
      if (res.data.success) {
        setQtdModulos(res.data.data || []);
      } else {
        showAlert(res.data.message || 'Não foi possível carregar total de Modulos Localizadas.', 'warning');
      }
    })
    .catch((err) => {
      console.error('Erro ao buscar total de Modulos Localizadas:', err);
      showAlert('Erro ao buscar total de Modulos Localizadas.', 'error');
    });
  };

  const carregarQtdTorres = () => {
    axios
    .get('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/qtdTorresLocalizadas')
    .then((res) => {
      if (res.data.success) {
        setQtdTorres(res.data.data || []);
      } else {
        showAlert(res.data.message || 'Não foi possível carregar total de Torres Localizadas.', 'warning');
      }
    })
    .catch((err) => {
      console.error('Erro ao buscar total de Torres Localizadas:', err);
      showAlert('Erro ao buscar total de Torres Localizadas.', 'error');
    });
  };

  useEffect(() => {
    carregarPatrimonios();
    carregarQtdCPRs();
    carregarQtdBPMs();
    carregarQtdBases();
    carregarQtdModulos();
    carregarQtdTorres();
  }, []);

  const handleDetalheCPR = () => {
    navigate('/listar');
  };

  const handleDetalheBPM = () => {
    navigate('/relatoriosBPM');
  };

  return (
    <Box sx={{ px: 2, py: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: 1000, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={3} textAlign="center">
            {text || 'Resumo Patrimônios Cadastrados'}
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : qtdRegitros.length === 0 ? (
            <Box py={5}>
              <Typography textAlign="center" color="text.secondary">
                Nenhum registro localizado na base de dados.
              </Typography>
            </Box>
          ) : (
            
              <>
                <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
                  <Card sx={{ width: 250, boxShadow: 3 }}>
                    
                      <CardContent>
                        <Typography variant="subtitle1" textAlign="center" gutterBottom>
                          CPR's Visitados
                        </Typography>
                        <Typography variant="h4" textAlign="center" color="primary">
                          {qtdCPRs.length}
                        </Typography>
                      </CardContent>
                    
                  </Card>

                  <Card sx={{ width: 250, boxShadow: 3 }}>
                    <CardActionArea>
                      <CardContent onClick={handleDetalheBPM}>
                        <Typography variant="subtitle1" textAlign="center" gutterBottom>
                          BPM's Visitados
                        </Typography>
                        <Typography variant="h4" textAlign="center" color="primary">
                          {qtdBPMs.length}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>

                  <Card sx={{ width: 250, boxShadow: 3 }}>
                    <CardActionArea>
                      <CardContent onClick={handleDetalheCPR}>
                          <Typography variant="subtitle1" textAlign="center" gutterBottom>
                            PCS's Registrados
                          </Typography>
                          <Typography variant="h4" textAlign="center" color="primary">
                              {qtdRegitros.length}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                  </Card>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
                    <Card sx={{ width: 250, boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="subtitle1" textAlign="center" gutterBottom>
                         Bases Localizadas
                        </Typography>
                        <Typography variant="h4" textAlign="center" color="success">
                          {qtdBases.length}  / {qtdRegitros.length}
                        </Typography>
                
                      </CardContent>
                    </Card>

                    <Card sx={{ width: 250, boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="subtitle1" textAlign="center" gutterBottom>
                          Módulos Localizados
                        </Typography>
                        <Typography variant="h4" textAlign="center" color="success">
                          {qtdModulos.length} / {qtdRegitros.length}
                        </Typography>
                     
                      </CardContent>
                    </Card>

                    <Card sx={{ width: 250, boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="subtitle1" textAlign="center" gutterBottom>
                          Torres Localizadas
                        </Typography>
                        <Typography variant="h4" textAlign="center" color="success">
                          {qtdTorres.length} / {qtdRegitros.length}
                        </Typography>
                      
                      </CardContent>
                    </Card>
                </Box>
              </>
          )}

            <Button variant="contained" fullWidth color="primary"  disabled={loading}>
                {loading ? 'Gerando Relatório Sintético...' : ''}
                Gerar Relatório Sintético
              </Button>

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
