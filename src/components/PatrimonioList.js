import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
  CircularProgress,
  Stack
} from '@mui/material';
import { Edit, Delete, AdfScanner } from '@mui/icons-material';
import axios from 'axios';

export function PatrimonioList({ text }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios
      .get('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/listar-todos-patrimonios')
      .then((res) => {
        setRows(res.data.response || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar dados:', err);
        setLoading(false);
      });
  }, []);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleEdit = (id) => console.log('Editar item:', id);
  const handleDelete = (id) => console.log('Excluir item:', id);
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
                      <TableCell sx={{ fontWeight: 'bold' }}>UNIDADE</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>IDENTIFICAÇÃO</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>AÇÕES</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow hover key={row.ID_PATRIMONIO}>
                          <TableCell>{row.ID_PCS}</TableCell>
                          <TableCell>{row.ID_CPR}</TableCell>
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
                                onClick={() => handleDelete(row.ID_PATRIMONIO)}
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
    </Box>
  );
}
