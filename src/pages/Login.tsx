import { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../schemas/auth';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';
import AuthLayout from '../components/auth/AuthLayout';

export default function Login() {
  const [userType, setUserType] = useState<'customer' | 'delivery'>('customer');
  const { isAuthenticated, user } = useAuthStore();
  const login = useLogin(userType);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated) {
    if (user?.role === UserRole.ADMIN) return <Navigate to="/admin" replace />;
    if (user?.role === UserRole.DELIVERY) return <Navigate to="/delivery" replace />;
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Entrar
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Acesse sua conta para continuar
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

      <Box component="form" onSubmit={handleSubmit((data) => login.mutate(data))} noValidate>
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
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 2 }}
          disabled={login.isPending}
        >
          {login.isPending ? <CircularProgress size={24} /> : 'Entrar'}
        </Button>
      </Box>

      <Typography variant="body2" textAlign="center" mt={3}>
        Não tem conta?{' '}
        <Link to="/register" style={{ color: 'inherit', fontWeight: 600 }}>
          Cadastre-se
        </Link>
      </Typography>
    </AuthLayout>
  );
}
