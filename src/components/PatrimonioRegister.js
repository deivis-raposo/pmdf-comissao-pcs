import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, FormControl, InputLabel, Select, MenuItem, TextField,
  FormGroup, FormControlLabel, Switch, Button, Box, Typography, IconButton,
  CircularProgress, useMediaQuery, useTheme, Stack, Tooltip, Snackbar, Alert
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { uploadData, getUrl } from 'aws-amplify/storage';

const PatrimonioRegister = ({ props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const userId = 'anonimo';

  // Estados para selects e dados
  const [listaCPRs, setListaCPRs] = useState([]);
  const [listaBPMs, setListaBPMs] = useState([]);
  const [listaPCSs, setListaPCSs] = useState([]);

  // Estados do formulário
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

  // Arquivos
  const [files, setFiles] = useState([]);

  // Estados de loading
  const [loading, setLoading] = useState(false);
  const [loadingLocalizacao, setLoadingLocalizacao] = useState(false);
  const [endereco, setEndereco] = useState('');

  // Snackbar
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Carregar CPRs
  useEffect(() => {
    fetch('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/listar-todos-cpr')
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
    fetch(`https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/listar-bpm-por-cpr?cpr=${ID_CPR}`)
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
    fetch(`https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/listar-pcs-por-bpm?bpm=${ID_BPM}`)
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
      fetch(`https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/consultar-patrimonio?cpr=${ID_CPR}&bpm=${ID_BPM}&pcs=${ID_PCS}`)
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
                nome: arq.NM_ARQUIVO,
                path: arq.URL_ARQUIVO_BUCKET,
                tipo: arq.TP_ARQUIVO,
                tamanho: arq.TAM_ARQUIVO,
                existente: true
              })));
            }
            showAlert(result.message, result.severity);
          } else {
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
          const fileName = `${userId}/${Date.now()}-${file.name}`;
          await uploadData({ key: fileName, data: file, options: { contentType: file.type } }).result;
          const { url } = await getUrl({ key: fileName });
          arquivosParaSalvar.push({
            nome: file.name,
            path: url.toString(),
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

      const res = await fetch('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/cadastrar-patrimonio', {
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
            {/* Select CPR */}
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

            {/* Select BPM */}
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

            {/* Select PCS */}
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
                          try {
                            const response = await fetch(
                              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                            );
                            const data = await response.json();
                            const fallback = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
                            const resolved = data?.display_name || fallback;
                            setEndereco(resolved);
                            setLocal(resolved);
                          } catch {
                            const fallback = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
                            setEndereco(fallback);
                            setLocal(fallback);
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

            {/* Arquivos existentes */}
            {files.some(f => f.existente) && (
              <Box>
                <Typography variant="subtitle2">Arquivos existentes:</Typography>
                <ul>
                  {files.filter(f => f.existente).map((file, idx) => (
                    <li key={idx}>
                      <a href={file.path} target="_blank" rel="noopener noreferrer">{file.nome}</a>
                    </li>
                  ))}
                </ul>
              </Box>
            )}

            {/* Upload arquivos novos */}
            <Button component="label" variant="outlined" fullWidth>
              Anexar Fotos/Arquivos
              <input type="file" hidden multiple onChange={(e) => {
                const novos = Array.from(e.target.files);
                setFiles(prev => [...prev, ...novos]);
              }} />
            </Button>
            <Typography variant="caption">{files.filter(f => !f.existente).length} arquivo(s) novo(s) selecionado(s)</Typography>

            {/* Botões */}
            <Button variant="contained" fullWidth color="primary" onClick={handleUpload} disabled={loading}>
              {loading ? 'Salvando...' : patrimonioExistente ? 'Atualizar Patrimônio' : 'Salvar Patrimônio'}
            </Button>
            <Button variant="outlined" fullWidth color="secondary" onClick={handleReset}>
              Limpar Formulário
            </Button>
          </Stack>

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
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatrimonioRegister;
