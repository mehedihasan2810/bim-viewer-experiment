'use client';

import { CameraControls, Center, Grid, Html, Sky, StatsGl, useGLTF, useProgress } from '@react-three/drei';
import dynamic from 'next/dynamic';
import { Suspense, memo, useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useControls } from 'leva';

// const Model3d = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Model3d), { ssr: false });
const Model = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Model), {
  ssr: false,
  // loading: () => (
  //   <div className='fixed flex h-screen w-full flex-col items-center justify-center'>
  //     <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
  //       <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
  //       <path
  //         className='opacity-75'
  //         fill='currentColor'
  //         d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
  //       />
  //     </svg>
  //   </div>
  // ),
});
useGLTF.preload('/futuristic_building/scene.gltf');
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='fixed flex h-screen w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
});

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

// useGLTF.preload('/futuristic_building/scene.gltf');

const planeColor = new THREE.Color('#9d4b4b');

// const Model = () => {
//   // const model = useGLTF('/futuristic_building/scene.gltf');

//   const generalSettings = useControls(
//     'General settings             ',
//     {
//       ['grid']: true,
//       ['grass']: false,
//       dollyToCursor: { value: false, label: 'dolly to cursor' },
//       // preset: {
//       //   value: preset,
//       //   options: ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby'],

//       //   onChange: (value) => startTransition(() => setPreset(value)),
//       // },
//     },
//     { collapsed: true },
//   );
//   const modelOperations = useControls(
//     'Cut model',
//     {
//       planeVisivility: {
//         value: false,
//         label: 'show plane',
//       },
//       modelSide: {
//         value: 'left',
//         options: ['left', 'right', 'top', 'bottom', 'front', 'back'],
//         label: 'side',
//       },

//       cutPlanePosition: {
//         value: 0,
//         min: -100,
//         max: 100,
//         step: 0.01,
//         onChange: (v) => {
//           console.log(v);
//           xPlane.constant = v;
//         },
//         label: 'position',
//       },
//     },
//     { collapsed: true },
//   );
//   const directionalLight = useControls(
//     'Directional light',
//     {
//       // visible: true,
//       // color: '#dddddd',
//       intensity: {
//         value: 2,
//         min: 0,
//         max: 5,
//         step: 0.1,
//       },
//     },
//     { collapsed: true },
//   );
//   const ambientLight = useControls(
//     'Ambient light',
//     {
//       // visible: true,
//       // color: '#cccccc',
//       intensity: {
//         value: 0.5,
//         min: 0,
//         max: 5,
//         step: 0.1,
//       },
//     },
//     { collapsed: true },
//   );

//   const [xPlane] = useState(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

//   const orbitRef = useRef<null | any>(null);
//   const persPectiveCamRef = useRef(null);
//   const modelRef = useRef(null);

//   useEffect(() => {
//     const orbitControls = orbitRef.current;
//     orbitControls?.listenToKeyEvents(document.body);

//     // return () => {
//     //   orbitControls?.stopListenToKeyEvents()
//     // }
//   }, [orbitRef]);

//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       const camera = persPectiveCamRef.current;
//       const controls = orbitRef.current;
//       if (!camera || !controls) return;
//       console.log(controls.target);
//       console.log(e.code);

//       const sensitivity = 3;

//       const p = new THREE.Vector3(); // camera's position
//       camera.getWorldPosition(p);
//       const t = controls.target; // target point
//       const newTarget = t.clone();

//       if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
//         // keep camera's position uchanged, rotate to left (q) or right (e) around y-axis
//         // thus it changes target(lookAt) point
//         const ANGLE = sensitivity; // angle in degree
//         let theta = (Math.PI * ANGLE) / 180; // angle in radians
//         if (e.code === 'ArrowLeft') {
//           theta = theta; // rotate to left
//         }
//         if (e.code === 'ArrowRight') {
//           theta = -theta; // rotate to right
//         }
//         newTarget.x = (t.x - p.x) * Math.cos(theta) - (t.z - p.z) * Math.sin(theta) + p.x;
//         newTarget.z = (t.z - p.z) * Math.cos(theta) + (t.x - p.x) * Math.sin(theta) + p.z;
//         controls.target = newTarget;
//         controls.update();
//       } else if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
//         // keep camera's position uchanged, rotate to left (q) or right (e) around y-axis
//         // thus it changes target(lookAt) point's y value
//         const ANGLE2 = sensitivity; // angle in degree
//         let theta2 = (Math.PI * ANGLE2) / 180; // angle in radians
//         const distVec = new THREE.Vector3(t.x - p.x, t.y - p.y, t.z - p.z); // distance vector from p to t
//         const dist = distVec.length();
//         const deltaY = t.y - p.y;
//         if (e.code === 'ArrowDown') {
//           // z: rotate down
//           theta2 = theta2;
//         }
//         if (e.code === 'ArrowUp') {
//           // z: rotate up
//           theta2 = -theta2;
//         }
//         const angle = Math.asin(deltaY / dist) + theta2;
//         if (angle < -Math.PI / 2 || angle > Math.PI / 2) {
//           return; // cannot rotate that much
//         }
//         const newDeltaY = Math.sin(angle) * dist;
//         newTarget.y = t.y + (newDeltaY - deltaY);
//         controls.target = newTarget;
//         controls.update();
//       } else if (e.code === 'KeyW') {
//         // go forward
//         const ALPHA = sensitivity * 0.01;
//         const dist = p.distanceTo(t);
//         if (dist < camera.near) {
//           // If distance is too close, better to move target position forward too, so camera can keep moving forward,
//           // rather than stop at the lookAt position. Let's move it to be 'camera.near' away from camera.
//           controls.target.lerp(p, -camera.near / dist);
//         }
//         p.lerp(t, ALPHA);
//         camera.position.set(p.x, p.y, p.z);
//       } else if (e.code === 'KeyS') {
//         // go backward
//         const ALPHA = sensitivity * 0.01;
//         p.lerp(t, -ALPHA);
//         camera.position.set(p.x, p.y, p.z);
//       }
//     };

//     window.addEventListener('keydown', onKeyDown);

//     return () => {
//       window.removeEventListener('keydown', onKeyDown);
//     };
//   }, []);

//   //  ---------------------------

//   const [capMaterialList, setCapMaterialList] = useState([]);
//   const [planeSize, setPlaneSize] = useState(50);

//   const update: () => void = useCallback(() => {
//     const meshChildren: THREE.Mesh[] = [];
//     const capMatList: THREE.Material[] = [];
//     const rootGroup = modelRef.current;
//     if (rootGroup) {
//       rootGroup.traverse((child: any) => {
//         if (child.isMesh && child.material && !child.isBrush) {
//           child.matrixAutoUpdate = false;
//           child.geometry.computeBoundingBox();
//           //
//           // Add clipping planes to each mesh and make sure that the material is
//           // double sided. This is needed to create PlaneStencilGroup for the
//           // mesh.
//           //
//           if (Array.isArray(child.material)) {
//             child.material.forEach((mat: THREE.Material) => {
//               mat.clippingPlanes = [xPlane];
//               mat.side = THREE.DoubleSide;
//             });
//           } else {
//             child.material.clippingPlanes = [xPlane];
//             child.material.side = THREE.DoubleSide;
//           }
//           meshChildren.push(child);
//           //
//           // Create material for the cap based on the stencil created by
//           // PlaneStencilGroup for the mesh.
//           //
//           // :TODO: This implementation does not work if the mesh uses and array
//           // of materials. This needs to be fixed.
//           //
//           const capMaterial = Array.isArray(child.material) ? child.material[0].clone() : child.material.clone();
//           capMaterial.clippingPlanes = null;
//           capMaterial.stencilWrite = true;
//           capMaterial.stencilRef = 0;
//           capMaterial.side = THREE.DoubleSide;
//           capMaterial.stencilFunc = THREE.NotEqualStencilFunc;
//           capMaterial.stencilFail = THREE.ReplaceStencilOp;
//           capMaterial.stencilZFail = THREE.ReplaceStencilOp;
//           capMaterial.stencilZPass = THREE.ReplaceStencilOp;
//           capMatList.push(capMaterial);
//         }
//       });
//       //
//       const bbox = new THREE.Box3();
//       bbox.setFromObject(rootGroup);
//       //
//       const boxSize = new THREE.Vector3();
//       bbox.getSize(boxSize);
//       // console.log('boxSize ', boxSize);
//       // console.log(bbox);
//       //
//       // setPlaneSize(Math.ceil(boxSize.length()));

//       planeHelperRef.current.size = Math.ceil(boxSize.length());
//     }
//     //
//     // Update the list of children that are meshes.
//     //
//     // setMeshList(meshChildren);
//     //
//     // Dispose old cap materials.
//     //
//     capMaterialList.forEach((item: THREE.Material) => item.dispose());
//     //
//     // Save the new cap material list.
//     //
//     // setCapMaterialList(capMatList);
//     //
//     // Cleanup function for when this component is unmounted
//     //
//     // return () => {
//     //   capMaterialList.forEach((item: THREE.material) => item.dispose());
//     // };
//   }, [modelRef.current]);

//   useEffect(() => void update(), []);

//   console.log('RENDER');
//   // console.log(meshList)

//   const planeHelperRef = useRef(null);

//   useEffect(() => {
//     // planeHelperRef.current.geometry.setDrawRange(0, 1);
//     console.log(planeHelperRef.current);

//     const positions = /*[ 1, - 1, 1, - 1, 1, 1, - 1, - 1, 1,*/ [
//       1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
//       //, 0, 0, 1
//     ];

//     const geometry = new THREE.BufferGeometry();
//     geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//     geometry.computeBoundingSphere();

//     planeHelperRef.current.geometry = geometry;

//     planeHelperRef.current.material = new THREE.LineBasicMaterial({ color: planeColor });

//     const positions2 = [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1];

//     const geometry2 = new THREE.BufferGeometry();
//     geometry2.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3));
//     geometry2.computeBoundingSphere();

//     planeHelperRef.current.children[0].geometry = geometry2;

//     planeHelperRef.current.children[0].material = new THREE.MeshBasicMaterial({
//       // color: 0xffff00,
//       color: planeColor,
//       opacity: 0.2,
//       transparent: true,
//       depthWrite: true,
//     });
//   }, [planeSize]);

//   // useHelper(modelRef, THREE.BoxHelper, 'red');

//   useEffect(() => {
//     if (!modelRef.current) return;
//     console.log(xPlane);
//     console.log(modelOperations.modelSide);
//     const side = modelOperations.modelSide;
//     const sideX = side === 'left' ? 1 : side === 'right' ? -1 : 0;
//     const sideY = side === 'top' ? -1 : side === 'bottom' ? 1 : 0;
//     const sideZ = side === 'front' ? -1 : side === 'back' ? 1 : 0;

//     const bbox = new THREE.Box3();
//     bbox.setFromObject(modelRef.current);
//     //
//     const boxSize = new THREE.Vector3();
//     bbox.getSize(boxSize);
//     console.log('boxSize ', boxSize);
//     // console.log(bbox);

//     const constant =
//       side === 'left'
//         ? boxSize.x / 2
//         : side === 'right'
//           ? boxSize.x / 2
//           : side === 'top'
//             ? boxSize.y / 2
//             : side === 'bottom'
//               ? boxSize.y / 2
//               : side === 'front'
//                 ? boxSize.z / 2
//                 : side === 'back'
//                   ? boxSize.y / 2
//                   : 0;

//     xPlane.normal = new THREE.Vector3(sideX, sideY, sideZ);

//     console.log(sideX, sideY, sideZ);
//     console.log(Math.ceil(constant));

//     xPlane.constant = Math.ceil(constant) + 5;
//   }, [modelOperations.modelSide]);

//   return (
//     <>
//       <Center top={!modelOperations.planeVisivility}>
//         {/* <primitive
//           ref={modelRef}
//           // onDoubleClick={onModelClick}
//           // onUpdate={() => console.log('update')}
//           object={model.scene}
//           // scale={0.8}
//           position={[50, 0, 0]}
//           // rotation={[0, 0, 0]}
//         /> */}

//         <group ref={modelRef}>
//           <Model3d />
//         </group>
//       </Center>
//       <planeHelper ref={planeHelperRef} args={[xPlane, 50]} visible={modelOperations.planeVisivility} />

//       {/* <Environment preset={null} background={false}/> */}

//       <Ground isGridVisible={generalSettings.grid && !modelOperations.planeVisivility} />

//       <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />

//       {/* <OrbitControls
//         ref={orbitRef}
//         enableDamping
//         dampingFactor={0.5}
//         keyPanSpeed={10}
//         keys={{
//           LEFT: 'KeyA', // left arrow
//           UP: 'Space', // up arrow
//           RIGHT: 'KeyD', // right arrow
//           BOTTOM: 'ControlLeft', // down arrow
//         }}
//         listenToKeyEvents={(a) => console.log(a)}
//         // onChange={(e) => console.log(e)}
//       />

//       <PerspectiveCamera
//         ref={persPectiveCamRef}
//         makeDefault
//         fov={45}
//         position={[0, 20, 100]}
//         near={0.5}
//         far={30000}
//         // lookAt={() => new THREE.Vector3(0, 0, 0)}
//       /> */}

//       <CameraControls makeDefault distance={50} polarAngle={1} dollyToCursor={generalSettings.dollyToCursor} />

//       <directionalLight
//         //color={0xffffff}
//         // visible={directionalLight.visible}
//         // color={directionalLight.color}
//         intensity={directionalLight.intensity}
//         position={[0, -5, 10]}
//       />

//       <ambientLight
//         // color={0x303030}
//         // visible={ambientLight.visible}
//         // color={ambientLight.color}
//         intensity={ambientLight.intensity}
//       />

//       <hemisphereLight color={0xffffff} groundColor={0xdddddd} intensity={3} />

//       <StatsGl />
//     </>
//   );
// };

export default function Page() {
  return (
    // @ts-ignore
    <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
      <Suspense fallback={<Loader />}>
        <Model />
      </Suspense>
    </View>
  );
}

// function Ground({ isGridVisible }) {
//   const gridConfig = {
//     cellSize: 0.5,
//     cellThickness: 0.5,
//     cellColor: '#6f6f6f',
//     sectionSize: 3,
//     sectionThickness: 1,
//     sectionColor: '#9d4b4b',
//     fadeDistance: 100,
//     fadeStrength: 1,
//     followCamera: false,
//     infiniteGrid: true,
//   };
//   return <Grid visible={isGridVisible} position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />;
// }

const SuspenseLoader = () => {
  return (
    <div className='fixed flex h-screen w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  );
};
