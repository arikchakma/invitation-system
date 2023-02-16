import { create } from 'zustand';

type DownKeysStore = {
  downKeys: Set<string>;
  addKey: (key: string) => void;
  removeKey: (key: string) => void;
  clearKeys: () => void;
};

export const useDownKeysStore = create<DownKeysStore>(set => ({
  downKeys: new Set(),
  addKey: key =>
    set(state => {
      const downKeys = new Set(state.downKeys);
      downKeys.add(key);
      return { downKeys };
    }),
  removeKey: key =>
    set(state => {
      const downKeys = new Set(state.downKeys);
      downKeys.delete(key);
      return { downKeys };
    }),
  clearKeys: () =>
    set(() => {
      return {downKeys: new Set()}
    }),
}));
