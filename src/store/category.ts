import { create } from 'zustand'

interface IState {
	activeId: number
	setActiveId: (id: number) => void
}

export const useCategoryStore = create<IState>(set => ({
	activeId: 1,
	setActiveId: (activeId: number) => set({ activeId }),
}))
