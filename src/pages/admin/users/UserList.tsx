import { useState } from 'react';
import { Box, Checkbox, Chip, FormControl, InputLabel, MenuItem, Select, IconButton, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { queryClient } from '../../../lib/queryClient';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useUsers, useToggleUserStatus } from '../../../hooks/useUsers';
import { formatDateShort } from '../../../lib/formatters';
import { UserRole } from '../../../types';
import type { User } from '../../../types';
import LoadingScreen from '../../../components/common/LoadingScreen';

export default function UserList() {
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const { data, isLoading } = useUsers({
    ...(roleFilter && { role: roleFilter }),
    ...(activeFilter && { isActive: activeFilter }),
  });
  const toggleStatus = useToggleUserStatus();

  const columns: GridColDef<User>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome', flex: 1, minWidth: 200 },
    { field: 'email', headerName: 'E-mail', flex: 1, minWidth: 200 },
    {
      field: 'role',
      headerName: 'Papel',
      width: 130,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="info" />
      ),
    },
    {
      field: 'isActive',
      headerName: 'Ativo',
      width: 80,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={() =>
            toggleStatus.mutate({ id: params.row.id, isActive: !params.value })
          }
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Criado em',
      width: 130,
      valueFormatter: (value: string) => formatDateShort(value),
    },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Papel</InputLabel>
            <Select label="Papel" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              {Object.values(UserRole).map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Ativo</MenuItem>
              <MenuItem value="false">Inativo</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Tooltip title="Atualizar">
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      <DataGrid
        rows={data ?? []}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
      />
    </>
  );
}
