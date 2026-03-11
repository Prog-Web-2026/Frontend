import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AddressState {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
  complemento: string;
  setAddress: (address: Partial<Omit<AddressState, 'setAddress' | 'clearAddress'>>) => void;
  clearAddress: () => void;
}

const initialState = {
  cep: '',
  logradouro: '',
  bairro: '',
  cidade: '',
  estado: '',
  numero: '',
  complemento: '',
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      ...initialState,
      setAddress: (address) => set((state) => ({ ...state, ...address })),
      clearAddress: () => set(initialState),
    }),
    {
      name: 'address-storage',
    }
  )
);
