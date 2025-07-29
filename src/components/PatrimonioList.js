import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
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
} from '@mui/material';
import { Edit, Delete, AdfScanner } from '@mui/icons-material';
import axios from 'axios';

const columns = [
  { id: 'unidade', label: 'UNIDADE' },
  { id: 'identificacao', label: 'IDENTIFICAÇÃO' },
  { id: 'acoes', label: 'AÇÕES' },
];

export function PatrimonioList({ text }) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios
      .get('https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/listar-todos-patrimonios')
      .then((res) => {
        setRows(res.data.response);
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
    <Box
      p={2}
      display="flex"
      justifyContent="center"
      sx={{ width: '100%' }}
    >
      <Box sx={{ width: '100%', maxWidth: isMobile ? '100%' : '900px' }}>
        <Typography variant="h6" mb={2}>
          {text}
        </Typography>

        <Paper sx={{ width: '100%', overflowX: 'auto', boxShadow: 3 }}>
          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ fontWeight: 'bold' }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.id_inventario}>
                      <TableCell>{row.id_unidade}</TableCell>
                      <TableCell>{row.id_pcs}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton
                            onClick={() => handleEdit(row.id_inventario)}
                            color="primary"
                            size={isMobile ? 'small' : 'medium'}
                          >
                            <Edit fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(row.id_inventario)}
                            color="error"
                            size={isMobile ? 'small' : 'medium'}
                          >
                            <Delete fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                          <IconButton
                            onClick={() => handleReport(row.id_inventario)}
                            color="secondary"
                            size={isMobile ? 'small' : 'medium'}
                          >
                            <AdfScanner fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                        </Box>
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
        </Paper>
      </Box>
    </Box>
  );
}
