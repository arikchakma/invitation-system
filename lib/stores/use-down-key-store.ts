import { create } from 'zustand';

type DownKeyStore = {
  downKey: Set<string>;
  addKey: (key: string) => void;
  removeKey: (key: string) => void;
};

export const useDownKeyStore = create<DownKeyStore>(set => ({
  downKey: new Set(),
  addKey: key =>
    set(state => {
      const downKey = new Set(state.downKey);
      downKey.add(key);
      return { downKey };
    }),
  removeKey: key =>
    set(state => {
      const downKey = new Set(state.downKey);
      downKey.delete(key);
      return { downKey };
    }),
}));
