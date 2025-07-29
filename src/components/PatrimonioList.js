import { AdfScanner, Delete, Details, DetailsSharp, Edit, Report, ReportGmailerrorred } from '@mui/icons-material';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import axios from 'axios';
import React from 'react'

const columns = [
    { id: 'unidade', label: 'UNIDADE', minWidth: 130 },
    { id: 'identificacao', label: 'IDENTIFICAÇÃO', minWidth: 130 },
    { id: 'modulo', label: 'MÓDULO', minWidth: 70 },
    { id: 'base', label: 'BASE', minWidth: 70 },
    { id: 'torre', label: 'TORRE', minWidth: 70 },
    { id: 'acoes', label: 'AÇÕES', minWidth: 70 }
    
  ];

  function createData(id, unidade, identificacao, modulo, base, torre, acoes) {
    return {id, unidade, identificacao, modulo, base, torre, acoes };
  }

export function PatrimonioList(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = (id) => {
        // Lógica para editar o item com o ID fornecido
        console.log('Editar item:', id);
      };
    
      const handleDelete = (id) => {
        // Lógica para excluir o item com o ID fornecido
        console.log('Excluir item:', id);
      };

      const handleReport = (id) => {
        // Lógica para excluir o item com o ID fornecido
        console.log('Detalhar o item:', id);
      };

      const [rows, setRows] = React.useState([]);
      React.useEffect(() => {
        axios.get("https://glu9nz6t07.execute-api.us-east-1.amazonaws.com/listar-todos-patrimonios").then(
            r => {
                setRows(r.data.response)
            }
        )
      }, [])

    return (
        <div>
            <h4>{props.text}</h4>
            <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ top: 10, minWidth: column.minWidth }}
                        >
                        {column.label}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                        return (
                        <TableRow key={row.id_inventario}>
                            <TableCell>{row.id_unidade}</TableCell>
                            <TableCell>{row.id_pcs}</TableCell>
                            <TableCell>{row.st_modulo === 1 ? 'Sim' : 'Não'}</TableCell>
                            <TableCell>{row.st_base === 1 ? 'Sim' : 'Não'}</TableCell>
                            <TableCell>{row.st_torre === 1 ? 'Sim' : 'Não'}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEdit(row.id_inventario)} aria-label="edit">
                                <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(row.id_inventario)} aria-label="delete">
                                <Delete />
                                </IconButton>
                                <IconButton onClick={() => handleReport(row.id_inventario)} aria-label="report">
                                <AdfScanner />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Paper>
        </div>
    )
}
