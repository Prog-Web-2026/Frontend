import { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, ToggleButtonGroup, ToggleButton, Collapse } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from '../schemas/auth';
import { useRegister } from '../hooks/useAuth';
import AuthLayout from '../components/auth/AuthLayout';

export default function Register() {
  const [userType, setUserType] = useState<'customer' | 'delivery'>('customer');
  const registerMutation = useRegister(userType);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = ({ confirmPassword, vehicle, ...data }: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <AuthLayout>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Cadastre-se
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Crie sua conta para começar
      </Typography>

      <ToggleButtonGroup
        value={userType}
        exclusive
        onChange={(_, value) => value && setUserType(value)}
        fullWidth
        sx={{ mb: 3 }}
      >
        <ToggleButton value="customer">Cliente</ToggleButton>
        <ToggleButton value="delivery">Entregador</ToggleButton>
      </ToggleButtonGroup>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="E-mail"
          type="email"
          fullWidth
          margin="normal"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          label="Confirmar Senha"
          type="password"
          fullWidth
          margin="normal"
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        <Collapse in={userType === 'delivery'}>
          <TextField
            label="Telefone"
            fullWidth
            margin="normal"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          <TextField
            label="Veículo (opcional)"
            fullWidth
            margin="normal"
            {...register('vehicle')}
            error={!!errors.vehicle}
            helperText={errors.vehicle?.message}
          />
        </Collapse>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 2 }}
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? <CircularProgress size={24} /> : 'Cadastrar'}
        </Button>
      </Box>

      <Typography variant="body2" textAlign="center" mt={3}>
        Já tem conta?{' '}
        <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
          Entrar
        </Link>
      </Typography>
    </AuthLayout>
  );
}
