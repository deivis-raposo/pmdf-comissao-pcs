import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, IconButton, useMediaQuery, useTheme,
  Paper, CircularProgress, Stack, Snackbar, Alert, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button
} from '@mui/material';
import { Edit, Delete, AdfScanner } from '@mui/icons-material';
import axios from 'axios';

export function PatrimonioList({ text }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Snackbar
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Dialog de confirmação
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleEdit = (id) => console.log('Editar item:', id);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    setConfirmOpen(false);
    try {
      const res = await axios.delete(`https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/excluir-patrimonio?id=${deleteId}`);
      showAlert(res.data.message, res.data.severity || 'info');
      if (res.data.success) {
        carregarPatrimonios();
      }
    } catch (error) {
      console.error(error);
      showAlert('Erro ao excluir patrimônio.', 'error');
    }
  };

  const handleReport = (id) => console.log('Detalhar item:', id);

  return (
    <Box sx={{ px: 2, py: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: 1000, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={3} textAlign="center">
            {text || 'Listagem de Patrimônios'}
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
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow hover key={row.ID_PATRIMONIO}>
                          <TableCell>{row.DS_CPR}</TableCell>
                          <TableCell>{row.DS_BPM}</TableCell>
                          <TableCell>{row.DS_PCS}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                onClick={() => handleEdit(row.ID_PATRIMONIO)}
                                color="primary"
                                size={isMobile ? 'small' : 'medium'}
                              >
                                <Edit fontSize={isMobile ? 'small' : 'medium'} />
                              </IconButton>
                              <IconButton
                                onClick={() => confirmDelete(row.ID_PATRIMONIO)}
                                color="error"
                                size={isMobile ? 'small' : 'medium'}
                              >
                                <Delete fontSize={isMobile ? 'small' : 'medium'} />
                              </IconButton>
                              <IconButton
                                onClick={() => handleReport(row.ID_PATRIMONIO)}
                                color="secondary"
                                size={isMobile ? 'small' : 'medium'}
                              >
                                <AdfScanner fontSize={isMobile ? 'small' : 'medium'} />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={rows.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este patrimônio e todos os arquivos vinculados?
            Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={executeDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

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
