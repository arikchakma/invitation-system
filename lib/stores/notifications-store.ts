import { PendingInvitationsProps } from '@/types/project';
import { create } from 'zustand';

type Notification = {
  count: number;
  increase: () => void;
  reset: () => void;
};

export const useNotificationsStore = create<Notification>(set => ({
  count: 0,
  increase: () => set(state => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
