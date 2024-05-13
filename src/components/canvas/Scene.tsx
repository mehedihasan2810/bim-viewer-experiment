'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { r3f } from '@/helpers/global';
import * as THREE from 'three';

export default function Scene({ ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  // const [dpr, setDpr] = useState(1.5)
  return (
    <Canvas
      {...props}
      onCreated={(state) => ((state.gl.toneMapping = THREE.AgXToneMapping), (state.gl.localClippingEnabled = true))}
      // gl={{ logarithmicDepthBuffer: true }}
      // dpr={dpr}

      // frameloop='demand'
    >
      {/* <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} /> */}
      {/* @ts-ignore */}
      <r3f.Out />
      <Preload all />
    </Canvas>
  );
}
