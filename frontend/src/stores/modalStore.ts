import { create } from 'zustand';

interface ModalState {
  activeModal: string | null;
  modalData: any;
  isOpen: boolean;

  // Actions
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalData: null,
  isOpen: false,

  openModal: (modalId, data) => set({
    activeModal: modalId,
    modalData: data,
    isOpen: true
  }),

  closeModal: () => set({
    activeModal: null,
    modalData: null,
    isOpen: false
  }),
}));