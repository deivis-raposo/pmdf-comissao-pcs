import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Stack,
  Tooltip,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { uploadData } from 'aws-amplify/storage';

const PatrimonioRegister = ({ props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const userId = 'anonimo';
  const [coordenadas, setCoordenadas] = useState({ lat: '', lng: '' });
  const [endereco, setEndereco] = useState('');
  const [loadingLocalizacao, setLoadingLocalizacao] = useState(false);
  const [listaCPRs, setListaCPRs] = useState([]);
  const [listaBPMs, setListaBPMs] = useState([]);
  const [listaPCSs, setListaPCSs] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ID_CPR, setID_CPR] = useState('');
  const [DS_CPR, setDS_CPR] = useState('');
  const [ID_PCS, setID_PCS] = useState('');
  const [DS_PCS, setDS_PCS] = useState('');
  const [ID_BPM, setID_BPM] = useState('');
  const [DS_BPM, setBPM] = useState('');
  const [local, setLocal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [checkedModulo, setCheckedModulo] = useState(false);
  const [checkedBase, setCheckedBase] = useState(false);
  const [checkedTorre, setCheckedTorre] = useState(false);

  useEffect(() => {
    const carregarCPRs = async () => {
      try {
        const response = await fetch('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/listar-todos-cpr');
        if (response.ok) {
          const data = await response.json();
          setListaCPRs(data.response);
        } else {
          console.error('Erro ao carregar CPRs');
        }
      } catch (error) {
        console.error('Erro na requisição de CPRs:', error);
      }
    };
    carregarCPRs();
  }, []);

  useEffect(() => {
    const carregarBPMs = async () => {
      if (!ID_CPR) return;
      try {
        const response = await fetch(
          `https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/listar-bpm-por-cpr?cpr=${encodeURIComponent(ID_CPR)}`
        );
        if (response.ok) {
          const data = await response.json();
          setListaBPMs(data.response || []);
        } else {
          console.error('Erro ao carregar BPM');
          setListaBPMs([]);
        }
      } catch (error) {
        console.error('Erro na requisição de BPM:', error);
        setListaBPMs([]);
      }
    };
    carregarBPMs();
  }, [ID_CPR]);

  useEffect(() => {
    const carregarPCSs = async () => {
      if (!ID_BPM) return;
      try {
        const response = await fetch(
          `https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/listar-pcs-por-bpm?bpm=${encodeURIComponent(ID_BPM)}`
        );
        if (response.ok) {
          const data = await response.json();
          setListaPCSs(data.response || []);
        } else {
          console.error('Erro ao carregar PCS');
          setListaPCSs([]);
        }
      } catch (error) {
        console.error('Erro na requisição de PCS:', error);
        setListaPCSs([]);
      }
    };
    carregarPCSs();
  }, [ID_BPM]);

  const handleReset = () => {
    setFiles([]);
    setID_CPR('');
    setDS_CPR('');
    setID_BPM('');
    setBPM('');
    setID_PCS('');
    setDS_PCS('');
    setListaBPMs([]);
    setListaPCSs([]);
    setLocal('');
    setObservacoes('');
    setCheckedModulo(false);
    setCheckedBase(false);
    setCheckedTorre(false);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Nenhum arquivo selecionado.");
      return;
    }

    setLoading(true);
    const arquivosParaSalvar = [];

    try {
      for (const file of files) {
        const fileName = `${userId}/${Date.now()}-${file.name}`;
        await uploadData({ key: fileName, data: file, options: { contentType: file.type } }).result;
        arquivosParaSalvar.push({
          nome: file.name,
          path: `public/${fileName}`,
          tipo: file.type,
          tamanho: file.size,
        });
      }

      const response = await fetch(
        'https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/upload-arquivos-bucket',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            DS_CPR,
            DS_PCS,
            local,
            observacoes,
            localizacao: {
              modulo: checkedModulo,
              base: checkedBase,
              torre: checkedTorre,
            },
            arquivos: arquivosParaSalvar,
          }),
        }
      );

      if (response.ok) {
        alert('Registro Inserido com Sucesso!');
        handleReset();
      } else {
        alert('Erro ao registrar os arquivos no banco de dados.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro durante upload ou comunicação com o servidor.');
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
            <FormControl fullWidth>
              <InputLabel id="cpr-select-label">CPR</InputLabel>
              <Select
                labelId="cpr-select-label"
                value={ID_CPR}
                label="CPR"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setID_CPR(selectedId);
                  const cprSelecionado = listaCPRs.find((cpr) => cpr.ID_CPR === selectedId);
                  setDS_CPR(cprSelecionado?.DS_CPR || '');
                }}
              >
                <MenuItem value=""><em>Selecione um CPR</em></MenuItem>
                {listaCPRs.map((cpr) => (
                  <MenuItem key={cpr.ID_CPR} value={cpr.ID_CPR}>{cpr.DS_CPR}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="bpm-select-label">BPM</InputLabel>
              <Select
                labelId="bpm-select-label"
                value={ID_BPM}
                label="BPM"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setID_BPM(selectedId);
                  const bpmSelecionado = listaBPMs.find((bpm) => bpm.ID_BPM === selectedId);
                  setBPM(bpmSelecionado?.DS_BPM || '');
                }}
              >
                <MenuItem value=""><em>Selecione um BPM</em></MenuItem>
                {listaBPMs.map((bpm) => (
                  <MenuItem key={bpm.ID_BPM} value={bpm.ID_BPM}>{bpm.DS_BPM}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="pcs-select-label">PCS</InputLabel>
              <Select
                labelId="pcs-select-label"
                value={DS_PCS}
                label="PCS"
                onChange={(e) => setDS_PCS(e.target.value)}
              >
                <MenuItem value=""><em>Selecione um PCS</em></MenuItem>
                {listaPCSs.map((pcs) => (
                  <MenuItem key={pcs.ID_PCS} value={pcs.DS_PCS}>{pcs.DS_PCS}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                fullWidth
                label="Localização PCS"
                variant="outlined"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
              />
              <Tooltip title={endereco || 'Clique para obter localização'}>
                <span>
                  <IconButton onClick={async () => {
                    if (!navigator.geolocation) {
                      alert('Geolocalização não é suportada neste navegador.');
                      return;
                    }
                    setLoadingLocalizacao(true);
                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        const { latitude, longitude } = position.coords;
                        setCoordenadas({ lat: latitude, lng: longitude });
                        try {
                          const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                          );
                          const data = await response.json();
                          const fallback = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
                          const resolved = data?.display_name || fallback;
                          setEndereco(resolved);
                          setLocal(resolved);
                        } catch (error) {
                          const fallback = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
                          setEndereco(fallback);
                          setLocal(fallback);
                        } finally {
                          setLoadingLocalizacao(false);
                        }
                      },
                      (error) => {
                        console.error(error);
                        alert('Erro ao obter localização. Verifique permissões.');
                        setLoadingLocalizacao(false);
                      }
                    );
                  }}>
                    {loadingLocalizacao ? <CircularProgress size={24} /> : <PlaceIcon color="error" />}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Patrimônio Localizado:</Typography>
              <FormGroup row sx={{ gap: 2 }}>
                <FormControlLabel control={<Switch checked={checkedModulo} onChange={() => setCheckedModulo(!checkedModulo)} />} label="Módulo" />
                <FormControlLabel control={<Switch checked={checkedBase} onChange={() => setCheckedBase(!checkedBase)} />} label="Base" />
                <FormControlLabel control={<Switch checked={checkedTorre} onChange={() => setCheckedTorre(!checkedTorre)} />} label="Torre" />
              </FormGroup>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Observações Gerais"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />

            <Button component="label" variant="outlined" fullWidth>
              Anexar Fotos/Arquivos
              <input type="file" hidden multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
            </Button>
            <Typography variant="caption" color="text.secondary">
              {files.length} arquivo(s) selecionado(s)
            </Typography>

            <Button variant="contained" fullWidth color="primary" onClick={handleUpload} disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
              {loading ? 'Salvando...' : 'Salvar Patrimônio'}
            </Button>

            <Button variant="outlined" fullWidth color="secondary" onClick={handleReset}>
              Limpar Formulário
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatrimonioRegister;
