import React from 'react';
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  BottomNavigationAction,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  TextareaAutosize,
  Box,
} from '@mui/material';
import Place from '@mui/icons-material/Place';

export function PatrimonioRegister(props) {
    
  const [unidade, setUnidade] = React.useState('');
  const [local, setLocal] = React.useState('');
  const [checkedModulo, setCheckedModulo] = React.useState(false);
  const [checkedBase, setCheckedBase] = React.useState(false);
  const [checkedTorre, setCheckedTorre] = React.useState(false);

  const handleChange = (event) => {
    setUnidade(event.target.value);
  };

  const handleLlocal = () => {
    // ação para localizar o patrimônio
  };

  const handleChangeSwitchModulo = () => {
    setCheckedModulo((prev) => !prev);
  };

  const handleChangeSwitchBase = () => {
    setCheckedBase((prev) => !prev);
  };

  const handleChangeSwitchTorre = () => {
    setCheckedTorre((prev) => !prev);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
  };

  return (
    <Card sx={{ maxWidth: '100%', overflowX: 'hidden', padding: 2 }}>
      <CardContent>
        <Box mb={2}>
          <h4>{props.text}</h4>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Box width="100%" maxWidth="400px">
            <FormControl fullWidth>
              <InputLabel id="unidade-select-label">Unidade</InputLabel>
              <Select
                labelId="unidade-select-label"
                id="unidade-select"
                value={unidade}
                label="Unidade"
                onChange={handleChange}
              >
                <MenuItem value={1}>1 BPM</MenuItem>
                <MenuItem value={2}>2 BPM</MenuItem>
                <MenuItem value={3}>3 BPM</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box width="100%" maxWidth="400px">
            <TextField
              fullWidth
              id="outlined-basic"
              label="Identificação PCS"
              variant="outlined"
            />
          </Box>

          <Box
            width="100%"
            maxWidth="400px"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <TextField
              fullWidth
              value={local}
              id="lbl_local"
              label="Localização PCS"
              variant="outlined"
            />
            <BottomNavigationAction
                onClick={handleLlocal}
                icon={<Place />}
                sx={{ color: 'red' }}
            />

          </Box>

          <Box width="100%" maxWidth="400px">
            Patrimônio Localizado:
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedModulo}
                    onChange={handleChangeSwitchModulo}
                  />
                }
                label="Módulo"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedBase}
                    onChange={handleChangeSwitchBase}
                  />
                }
                label="Base"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedTorre}
                    onChange={handleChangeSwitchTorre}
                  />
                }
                label="Torre"
              />
            </FormGroup>
          </Box>

          <Box width="100%" maxWidth="400px">
            <TextareaAutosize
              aria-label="Informações gerais"
              minRows={5}
              placeholder="Observações Gerais"
              style={{
                width: '100%',
                maxWidth: '100%',
                borderRadius: '4px',
                padding: '8px',
                borderColor: '#ccc',
              }}
            />
          </Box>

          <Box width="100%" maxWidth="400px">
            <TextField
              type="file"
              onChange={handleFileChange}
              inputProps={{ accept: '*/*' }}
              fullWidth
            />
          </Box>

          <Box width="100%" display="flex" justifyContent="center" mt={2}>
            <Button variant="contained">Salvar</Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default PatrimonioRegister;