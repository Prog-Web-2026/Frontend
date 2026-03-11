import { useState } from 'react';
import { Box, Button, IconButton, TextField, Tabs, Tab, Tooltip } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import { queryClient } from '../../../lib/queryClient';
import { useNavigate } from 'react-router-dom';
import { useProducts, useDeleteProduct } from '../../../hooks/useProducts';
import {
  useCategories,
  useDeleteCategory,
} from '../../../hooks/useCategories';
import { formatCurrency } from '../../../lib/formatters';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import LoadingScreen from '../../../components/common/LoadingScreen';
import CategoryForm from '../categories/CategoryForm';
import type { Product, Category } from '../../../types';

export default function CatalogPage() {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const handleCreateCategory = () => {
    setEditCategory(null);
    setFormOpen(true);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Produtos" />
          <Tab label="Categorias" />
        </Tabs>
        {tab === 0 && (
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/admin/products/new')}>
            Novo Produto
          </Button>
        )}
        {tab === 1 && (
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateCategory}>
            Nova Categoria
          </Button>
        )}
      </Box>
      {tab === 0 && <ProductsTab />}
      {tab === 1 && (
        <CategoriesTab
          formOpen={formOpen}
          editCategory={editCategory}
          setFormOpen={setFormOpen}
          setEditCategory={setEditCategory}
        />
      )}
    </>
  );
}

function ProductsTab() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data: products, isLoading } = useProducts(search ? { search } : {});
  const deleteProduct = useDeleteProduct();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const columns: GridColDef<Product>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome', flex: 1, minWidth: 200 },
    {
      field: 'price',
      headerName: 'Preço',
      width: 120,
      valueFormatter: (value: number) => formatCurrency(value),
    },
    { field: 'stock', headerName: 'Estoque', width: 100 },
    {
      field: 'category',
      headerName: 'Categoria',
      width: 150,
      valueGetter: (_value: unknown, row: Product) => row.category?.name ?? '-',
    },
    {
      field: 'isActive',
      headerName: 'Ativo',
      width: 80,
      valueFormatter: (value: boolean) => (value ? 'Sim' : 'Não'),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => navigate(`/admin/products/${params.row.id}/edit`)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleteId(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          placeholder="Buscar produtos..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
        <Tooltip title="Atualizar">
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      <DataGrid
        rows={products ?? []}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
      />
      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir Produto"
        message="Tem certeza que deseja excluir este produto?"
        onConfirm={() => {
          if (deleteId) deleteProduct.mutate(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}

interface CategoriesTabProps {
  formOpen: boolean;
  editCategory: Category | null;
  setFormOpen: (open: boolean) => void;
  setEditCategory: (cat: Category | null) => void;
}

function CategoriesTab({ formOpen, editCategory, setFormOpen, setEditCategory }: CategoriesTabProps) {
  const { data, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setFormOpen(true);
  };

  const columns: GridColDef<Category>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome', flex: 1, minWidth: 200 },
    { field: 'description', headerName: 'Descrição', flex: 1, minWidth: 200 },
    {
      field: 'isActive',
      headerName: 'Ativo',
      width: 100,
      valueFormatter: (value: boolean) => (value ? 'Sim' : 'Não'),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleteId(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <Tooltip title="Atualizar">
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ['categories'] })}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      <DataGrid
        rows={data?.categories ?? []}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
      />
      <CategoryForm
        open={formOpen}
        category={editCategory}
        onClose={() => setFormOpen(false)}
      />
      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir Categoria"
        message="Tem certeza que deseja excluir esta categoria?"
        onConfirm={() => {
          if (deleteId) deleteCategory.mutate(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
