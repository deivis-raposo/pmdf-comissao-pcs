import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, FormControl, InputLabel, Select, MenuItem, TextField,
  FormGroup, FormControlLabel, Switch, Button, Box, Typography, IconButton,
  CircularProgress, useMediaQuery, useTheme, Stack, Tooltip, Snackbar, Alert,
  Grid, Paper
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import DeleteIcon from '@mui/icons-material/Delete';

const API_BASE = 'https://glu9nz6t07.execute-api.us-east-1.amazonaws.com';

const PatrimonioRegister = ({ props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [listaCPRs, setListaCPRs] = useState([]);
  const [listaBPMs, setListaBPMs] = useState([]);
  const [listaPCSs, setListaPCSs] = useState([]);
  const [ID_CPR, setID_CPR] = useState('');
  const [DS_CPR, setDS_CPR] = useState('');
  const [ID_BPM, setID_BPM] = useState('');
  const [DS_BPM, setDS_BPM] = useState('');
  const [ID_PCS, setID_PCS] = useState('');
  const [local, setLocal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [checkedModulo, setCheckedModulo] = useState(false);
  const [checkedBase, setCheckedBase] = useState(false);
  const [checkedTorre, setCheckedTorre] = useState(false);
  const [patrimonioExistente, setPatrimonioExistente] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocalizacao, setLoadingLocalizacao] = useState(false);
  const [endereco, setEndereco] = useState('');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Converte arquivo para Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Carregar CPRs
  useEffect(() => {
    fetch(`${API_BASE}/listar-todos-cpr`)
      .then(res => res.json())
      .then(result => {
        if (result.success) setListaCPRs(result.data || []);
        else showAlert(result.message, result.severity);
      })
      .catch(() => showAlert("Erro ao carregar CPRs", "error"));
  }, []);

  // Carregar BPMs
  useEffect(() => {
    if (!ID_CPR) { setListaBPMs([]); setID_BPM(''); return; }
    fetch(`${API_BASE}/listar-bpm-por-cpr?cpr=${ID_CPR}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) setListaBPMs(result.data || []);
        else showAlert(result.message, result.severity);
      })
      .catch(() => showAlert("Erro ao carregar BPMs", "error"));
  }, [ID_CPR]);

  // Carregar PCS
  useEffect(() => {
    if (!ID_BPM) { setListaPCSs([]); setID_PCS(''); return; }
    fetch(`${API_BASE}/listar-pcs-por-bpm?bpm=${ID_BPM}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) setListaPCSs(result.data || []);
        else showAlert(result.message, result.severity);
      })
      .catch(() => showAlert("Erro ao carregar PCSs", "error"));
  }, [ID_BPM]);

  // Consultar patrimônio existente
  useEffect(() => {
    if (ID_CPR && ID_BPM && ID_PCS) {
      fetch(`${API_BASE}/consultar-patrimonio?cpr=${ID_CPR}&bpm=${ID_BPM}&pcs=${ID_PCS}`)
        .then(res => res.json())
        .then(result => {
          if (!result.success) {
            showAlert(result.message, result.severity);
            return;
          }
          if (result.data.encontrado) {
            const p = result.data.patrimonio;
            setPatrimonioExistente(p.ID_PATRIMONIO);
            setLocal(p.TX_LOCALIZACAO || '');
            setObservacoes(p.TX_OBSERVACAO || '');
            setCheckedModulo(!!p.ST_MODULO_LOCALIZADO);
            setCheckedBase(!!p.ST_BASE_LOCALIZADO);
            setCheckedTorre(!!p.ST_TORRE_LOCALIZADO);

            if (p.arquivos && p.arquivos.length > 0) {
              setFiles(p.arquivos.map(arq => ({
                id: arq.ID_ARQUIVO,
                nome: arq.NM_ARQUIVO,
                url: arq.URL_ARQUIVO_BUCKET,
                tipo: arq.TP_ARQUIVO,
                tamanho: arq.TAM_ARQUIVO,
                existente: true
              })));
            }
            showAlert(result.message, result.severity);
          } else {
            // Limpa apenas dados, mantendo seleções
            setPatrimonioExistente(null);
            setLocal('');
            setObservacoes('');
            setCheckedModulo(false);
            setCheckedBase(false);
            setCheckedTorre(false);
            setFiles([]);
          }
        })
        .catch(() => showAlert("Erro ao consultar patrimônio", "error"));
    }
  }, [ID_CPR, ID_BPM, ID_PCS]);

  const handleReset = () => {
    setFiles([]);
    setID_CPR('');
    setDS_CPR('');
    setID_BPM('');
    setDS_BPM('');
    setID_PCS('');
    setListaBPMs([]);
    setListaPCSs([]);
    setLocal('');
    setObservacoes('');
    setCheckedModulo(false);
    setCheckedBase(false);
    setCheckedTorre(false);
    setPatrimonioExistente(null);
  };

  const handleRemoveFile = async (index) => {
    const file = files[index];
    if (file.existente && file.id) {
      try {
        const res = await fetch(`${API_BASE}/excluir-arquivo?id=${file.id}`, { method: "DELETE" });
        const result = await res.json();
        showAlert(result.message, result.severity);
        if (result.success) {
          setFiles(prev => prev.filter((_, i) => i !== index));
        }
      } catch (error) {
        console.error("Erro ao excluir arquivo:", error);
        showAlert("Erro ao excluir arquivo.", "error");
      }
    } else {
      setFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleUpload = async () => {
    if (!ID_CPR || !ID_BPM || !ID_PCS) {
      showAlert('Por favor, selecione CPR, BPM e PCS.', 'warning');
      return;
    }

    setLoading(true);
    const arquivosParaSalvar = [];

    try {
      for (const file of files) {
        if (!file.existente) {
          const base64 = await fileToBase64(file);
          arquivosParaSalvar.push({
            nome: file.name,
            base64,
            tipo: file.type,
            tamanho: file.size
          });
        }
      }

      const payload = {
        ID_CPR,
        ID_BPM,
        ID_PCS,
        TX_LOCALIZACAO: local || null,
        ST_MODULO_LOCALIZADO: checkedModulo ? 1 : 0,
        ST_BASE_LOCALIZADO: checkedBase ? 1 : 0,
        ST_TORRE_LOCALIZADO: checkedTorre ? 1 : 0,
        TX_OBSERVACAO: observacoes || null,
        arquivos: arquivosParaSalvar
      };

      const res = await fetch(`${API_BASE}/cadastrar-patrimonio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      showAlert(result.message, result.severity);
      if (result.success) handleReset();

    } catch (error) {
      console.error(error);
      showAlert('Erro durante o processo de cadastro.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ px: 2, py: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: 600, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={3} textAlign="center">
            {props || 'Cadastro de Patrimônio'}
          </Typography>

          <Stack spacing={2}>
            {/* CPR */}
            <FormControl fullWidth>
              <InputLabel id="cpr-select-label">CPR</InputLabel>
              <Select
                labelId="cpr-select-label"
                value={ID_CPR}
                onChange={(e) => {
                  setID_CPR(e.target.value);
                  const cpr = listaCPRs.find(c => c.ID_CPR === e.target.value);
                  setDS_CPR(cpr?.DS_CPR || '');
                }}
              >
                <MenuItem value=""><em>Selecione um CPR</em></MenuItem>
                {listaCPRs.map(cpr => <MenuItem key={cpr.ID_CPR} value={cpr.ID_CPR}>{cpr.DS_CPR}</MenuItem>)}
              </Select>
            </FormControl>

            {/* BPM */}
            <FormControl fullWidth>
              <InputLabel id="bpm-select-label">BPM</InputLabel>
              <Select
                labelId="bpm-select-label"
                value={ID_BPM}
                onChange={(e) => {
                  setID_BPM(e.target.value);
                  const bpm = listaBPMs.find(b => b.ID_BPM === e.target.value);
                  setDS_BPM(bpm?.DS_BPM || '');
                }}
              >
                <MenuItem value=""><em>Selecione um BPM</em></MenuItem>
                {listaBPMs.map(bpm => <MenuItem key={bpm.ID_BPM} value={bpm.ID_BPM}>{bpm.DS_BPM}</MenuItem>)}
              </Select>
            </FormControl>

            {/* PCS */}
            <FormControl fullWidth>
              <InputLabel id="pcs-select-label">PCS</InputLabel>
              <Select
                labelId="pcs-select-label"
                value={ID_PCS}
                onChange={(e) => setID_PCS(e.target.value)}
              >
                <MenuItem value=""><em>Selecione um PCS</em></MenuItem>
                {listaPCSs.map(pcs => <MenuItem key={pcs.ID_PCS} value={pcs.ID_PCS}>{pcs.DS_PCS}</MenuItem>)}
              </Select>
            </FormControl>

            {/* Localização */}
            <Box display="flex" alignItems="center" gap={1}>
              <TextField fullWidth label="Localização PCS" value={local} onChange={(e) => setLocal(e.target.value)} />
              <Tooltip title={endereco || 'Clique para obter localização'}>
                <span>
                <IconButton
                    onClick={() => {
                      if (!navigator.geolocation) {
                        showAlert('Geolocalização não suportada.', 'warning');
                        return;
                      }
                      setLoadingLocalizacao(true);
                      navigator.geolocation.getCurrentPosition(
                        async (position) => {
                          const { latitude, longitude } = position.coords;

                          // ✅ Monta a URL do Google Maps (abre app no mobile)
                          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

                          try {
                            // (Opcional) ainda busca o endereço humano pra mostrar no tooltip
                            const response = await fetch(
                              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                            );
                            const data = await response.json();
                            const human = data?.display_name;

                            setEndereco(human || mapsUrl); // tooltip
                            setLocal(mapsUrl);             // ⬅️ salva o link do Google Maps no campo
                          } catch {
                            setEndereco(mapsUrl);
                            setLocal(mapsUrl);
                          } finally {
                            setLoadingLocalizacao(false);
                          }
                        },
                        () => {
                          showAlert('Erro ao obter localização.', 'error');
                          setLoadingLocalizacao(false);
                        }
                      );
                    }}
                  >
                    {loadingLocalizacao ? <CircularProgress size={24} /> : <PlaceIcon color="error" />}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            {/* Switches */}
            <Box>
              <Typography variant="subtitle2">Patrimônio Localizado:</Typography>
              <FormGroup row sx={{ gap: 2 }}>
                <FormControlLabel control={<Switch checked={checkedModulo} onChange={() => setCheckedModulo(!checkedModulo)} />} label="Módulo" />
                <FormControlLabel control={<Switch checked={checkedBase} onChange={() => setCheckedBase(!checkedBase)} />} label="Base" />
                <FormControlLabel control={<Switch checked={checkedTorre} onChange={() => setCheckedTorre(!checkedTorre)} />} label="Torre" />
              </FormGroup>
            </Box>

            {/* Observações */}
            <TextField fullWidth multiline rows={4} label="Observações Gerais" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />

            {/* Lista de arquivos */}
            {files.length > 0 && (
              <Grid container spacing={2}>
                {files.map((file, idx) => (
                  <Grid item xs={6} key={idx}>
                    <Paper sx={{ p: 1, position: 'relative' }}>
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 0, right: 0, color: 'red' }}
                        onClick={() => handleRemoveFile(idx)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>

                      {/* Link clicável para abrir o arquivo/imagem */}
                      <a
                        href={file.url || URL.createObjectURL(file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        {file.tipo?.startsWith('image') || file.type?.startsWith('image') ? (
                          <img
                            src={file.url || URL.createObjectURL(file)}
                            alt={file.nome || file.name}
                            style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: 4 }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              wordBreak: 'break-word',
                              textAlign: 'center',
                              color: 'primary.main',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            {file.nome || file.name}
                          </Typography>
                        )}
                      </a>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}


            {/* Upload arquivos novos */}
            <Button component="label" variant="outlined" fullWidth>
              Anexar Fotos/Arquivos
              <input type="file" hidden multiple onChange={(e) => {
                const novos = Array.from(e.target.files);
                setFiles(prev => [...prev, ...novos]);
              }} />
            </Button>

            {/* Botões */}
            <Button variant="contained" fullWidth color="primary" onClick={handleUpload} disabled={loading}>
              {loading ? 'Salvando...' : patrimonioExistente ? 'Atualizar Patrimônio' : 'Salvar Patrimônio'}
            </Button>
            <Button variant="outlined" fullWidth color="secondary" onClick={handleReset}>
              Limpar Formulário
            </Button>
          </Stack>

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
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatrimonioRegister;
