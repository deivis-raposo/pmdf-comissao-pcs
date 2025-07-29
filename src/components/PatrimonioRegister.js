import { Place } from '@mui/icons-material';
import { BottomNavigationAction, Button, Card, CardContent, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Switch, TextField, TextareaAutosize } from '@mui/material'
import React from 'react'

export function PatrimonioRegister(props) {
    
    const [unidade, setUnidade] = React.useState('');
    const [local, setLocal] = React.useState('');
    const [checkedModulo, setCheckedModulo] = React.useState(false);
    const [checkedBase, setCheckedBase] = React.useState(false);
    const [checkedTorre, setCheckedTorre] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);



    const handleChange = (event) => {
        setUnidade(event.target.value);
    };

    const handleChangeSwitchModulo = (event) => {
        setCheckedModulo(event.target.checked);
    };

    const handleChangeSwitchBase = (event) => {
        setCheckedBase(event.target.checked);
    };

    const handleChangeSwitchTorre = (event) => {
        setCheckedTorre(event.target.checked);
    };

    const handleLlocal = (event) => {
        setLocal('Lat: 123 - Long: 987');
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <Card>
            <CardContent>
                <div><h4>{props.text}</h4></div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{width: '40%', marginTop: '10px'}}>
                    <FormControl fullWidth>
                        <InputLabel id="unidade-select-label">Unidade</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={unidade}
                            label="Age"
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>1 BPM</MenuItem>
                            <MenuItem value={2}>2 BPM</MenuItem>
                            <MenuItem value={3}>3 BPM</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div style={{width: '40%', marginTop: '10px'}}>
                    <TextField fullWidth id="outlined-basic" label="Identificação PCS" variant="outlined" />
                </div>
                <div style={{width: '70%', marginTop: '10px'}}>
                    <TextField width="100%" value={local} id="lbl_local" label="Localização PCS" variant="outlined" />
                    <BottomNavigationAction onClick={handleLlocal} icon={<Place />} />
                </div>
                <div style={{width: '40%', marginTop: '10px'}}>
                    Patrimônio Localizado:
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={checkedModulo} onChange={handleChangeSwitchModulo}/>} label="Módulo" />
                        <FormControlLabel control={<Switch checked={checkedBase} onChange={handleChangeSwitchBase}/>} label="Base" />
                        <FormControlLabel control={<Switch checked={checkedTorre} onChange={handleChangeSwitchTorre}/>} label="Torre" />
                    </FormGroup>
                </div>
                <div style={{width: '40%', marginTop: '10px'}}></div>
                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        placeholder="Informações Gerais"
                        style={{ width: '300px' }}
                    />
                </div>
                <div style={{width: '40%', marginTop: '10px'}}>
                    <TextField
                        type="file"
                        onChange={handleFileChange}
                        inputProps={{ accept: '*/*', }}
                    />
                </div>
                <div style={{width: '100%', marginTop: '10px', display: 'flex', justifyContent: 'center'}}>
                    <Button variant="contained">Salvar</Button>
                </div>
            </CardContent>
        </Card>
      
    )
}
