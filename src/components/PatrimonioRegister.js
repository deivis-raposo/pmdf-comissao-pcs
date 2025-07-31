import React, { useState } from 'react';
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
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { uploadData } from 'aws-amplify/storage';

const PatrimonioRegister = ({ props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const userId = 'anonimo';

  // Estados dos campos
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unidade, setUnidade] = useState('');
  const [identificacao, setIdentificacao] = useState('');
  const [local, setLocal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [checkedModulo, setCheckedModulo] = useState(false);
  const [checkedBase, setCheckedBase] = useState(false);
  const [checkedTorre, setCheckedTorre] = useState(false);

  const handleReset = () => {
    setFiles([]);
    setUnidade('');
    setIdentificacao('');
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
        'https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/cadastrar-imagens',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            unidade,
            identificacao,
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
        alert('Upload completo e arquivos registrados no banco!');
        handleReset(); // ✅ limpar formulário
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
              <InputLabel id="unidade-select-label">Unidade</InputLabel>
              <Select
                labelId="unidade-select-label"
                value={unidade}
                label="Unidade"
                onChange={(e) => setUnidade(e.target.value)}
              >
                <MenuItem value={1}>1 BPM</MenuItem>
                <MenuItem value={2}>2 BPM</MenuItem>
                <MenuItem value={3}>3 BPM</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Identificação PCS"
              variant="outlined"
              value={identificacao}
              onChange={(e) => setIdentificacao(e.target.value)}
            />

            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                fullWidth
                label="Localização PCS"
                variant="outlined"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
              />
              <IconButton onClick={() => alert('Funcionalidade futura')}>
                <PlaceIcon color="error" />
              </IconButton>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Patrimônio Localizado:
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={checkedModulo} onChange={() => setCheckedModulo(!checkedModulo)} />}
                  label="Módulo"
                />
                <FormControlLabel
                  control={<Switch checked={checkedBase} onChange={() => setCheckedBase(!checkedBase)} />}
                  label="Base"
                />
                <FormControlLabel
                  control={<Switch checked={checkedTorre} onChange={() => setCheckedTorre(!checkedTorre)} />}
                  label="Torre"
                />
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

            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={handleUpload}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Salvando...' : 'Salvar Patrimônio'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatrimonioRegister;
