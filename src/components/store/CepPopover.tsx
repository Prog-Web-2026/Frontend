import { useState } from 'react';
import {
  Popover,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAddressStore } from '../../stores/addressStore';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../api/client';

interface CepPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function CepPopover({ anchorEl, onClose }: CepPopoverProps) {
  const { setAddress, numero, complemento } = useAddressStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { enqueueSnackbar } = useSnackbar();
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [found, setFound] = useState<ViaCepResponse | null>(null);
  const [error, setError] = useState('');
  const [localNumero, setLocalNumero] = useState(numero);
  const [localComplemento, setLocalComplemento] = useState(complemento);

  const handleSearch = async () => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return;
    }
    setLoading(true);
    setError('');
    setFound(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data: ViaCepResponse = await res.json();
      if (data.erro) {
        setError('CEP não encontrado');
      } else {
        setFound(data);
      }
    } catch {
      setError('Erro ao buscar CEP');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!found) return;

    setAddress({
      cep: found.cep,
      logradouro: found.logradouro,
      bairro: found.bairro,
      cidade: found.localidade,
      estado: found.uf,
      numero: localNumero,
      complemento: localComplemento,
    });

    if (isAuthenticated) {
      setSaving(true);
      try {
        await api.put('/users/me/address', {
          street: found.logradouro,
          number: localNumero,
          complement: localComplemento,
          neighborhood: found.bairro,
          city: found.localidade,
          state: found.uf,
          zipCode: found.cep,
        });
        enqueueSnackbar('Endereço atualizado!', { variant: 'success' });
      } catch {
        enqueueSnackbar('Erro ao salvar endereço no servidor', { variant: 'error' });
      } finally {
        setSaving(false);
      }
    }

    onClose();
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Box sx={{ p: 2, width: 320 }}>
        <Typography variant="subtitle2" gutterBottom>
          Atualizar endereço
        </Typography>
        <Box display="flex" gap={1} mb={1}>
          <TextField
            label="CEP"
            size="small"
            value={cep}
            onChange={(e) => setCep(formatCep(e.target.value))}
            fullWidth
            placeholder="00000-000"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={20} /> : 'Buscar'}
          </Button>
        </Box>
        {error && (
          <Typography color="error" variant="body2" mb={1}>
            {error}
          </Typography>
        )}
        {found && (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {found.logradouro}, {found.bairro} - {found.localidade}/{found.uf}
            </Typography>
            <TextField
              label="Número"
              size="small"
              fullWidth
              value={localNumero}
              onChange={(e) => setLocalNumero(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="Complemento"
              size="small"
              fullWidth
              value={localComplemento}
              onChange={(e) => setLocalComplemento(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} /> : 'Salvar endereço'}
            </Button>
          </Box>
        )}
      </Box>
    </Popover>
  );
}
