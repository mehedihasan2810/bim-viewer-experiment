import { createContext, useContext } from 'react'
import { createStore, useStore as useZustandStore } from 'zustand'
import { PreloadedStoreInterface } from './StoreProvider'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

export interface StoreInterface {
    lastUpdate: number
  //   light: boolean
  //   count: number
  //   tick: (lastUpdate: number) => void
  //   increment: () => void
  //   decrement: () => void
  //   reset: () => void

  orbitControls: null | typeof OrbitControls
  perspectiveCam: null | typeof PerspectiveCamera
  isGetWorldPos: boolean
  setIsGetWorldPos: (isGetWorldPos: boolean) => void
  //   setOrbitControls: (orbit: typeof OrbitControls) => void
}

function getDefaultInitialState() {
  return {
    orbitControls: null,
    perspectiveCam: null,
    isGetWorldPos: false,
    
    lastUpdate: new Date(1970, 1, 1).getTime(),
    // light: false,
    // count: 0,
  } as const
}

export type StoreType = ReturnType<typeof initializeStore>

const storeContext = createContext<StoreType | null>(null)

export const Provider = storeContext.Provider

export function useStore<T>(selector: (state: StoreInterface) => T) {
  const store = useContext(storeContext)

  if (!store) throw new Error('Store is missing the provider')

  return useZustandStore(store, selector)
}

export function initializeStore(preloadedState: PreloadedStoreInterface) {
  return createStore<StoreInterface>((set, get) => ({
    ...getDefaultInitialState(),
    ...preloadedState,
    setIsGetWorldPos: (isGetWorldPos) => set({ isGetWorldPos }),
    // setOrbitControls: (orbitControls) => set({ orbitControls }),
    // tick: (lastUpdate) =>
    //   set({
    //     lastUpdate,
    //     light: !get().light,
    //   }),
    // increment: () =>
    //   set({
    //     count: get().count + 1,
    //   }),
    // decrement: () =>
    //   set({
    //     count: get().count - 1,
    //   }),
    // reset: () =>
    //   set({
    //     count: getDefaultInitialState().count,
    //   }),
  }))
}
