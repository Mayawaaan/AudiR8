import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import presetColors from '../data/presetColor';
import { degToRad } from 'three/src/math/MathUtils.js';

// Helper function to convert hex string to number
const hexToNumber = (hex) => {
    if (typeof hex === 'number') return hex;
    if (typeof hex === 'string') {
        // Remove # if present
        const cleaned = hex.replace('#', '');
        return parseInt(cleaned, 16);
    }
    return 0x1a1a2e; // default color
};

// Turntable animation component - rotates the car on Y-axis
function Turntable({ children }) {
    const groupRef = useRef();
    const timeRef = useRef(0);
    
    useFrame((state, delta) => {
        if (groupRef.current) {
            // Accumulate time for smooth rotation
            timeRef.current += delta * 0.3; // Rotation speed (0.5 = moderate speed, adjust as needed)
            
            // Rotate the car on Y-axis (turntable effect)
            groupRef.current.rotation.y = timeRef.current;
        }
    });
    
    return <group ref={groupRef}>{children}</group>;
}

// Custom loader component to be shown during model download
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
                <p className="text-white text-lg mt-4 font-serif">
                    Loading {progress.toFixed(2)}%
                </p>
            </div>
        </Html>
    );
}

function Model({ carColor, ...props }) {
    const { scene } = useGLTF('/Audi.glb');
    
    // Clone the scene once and apply materials
    const clonedScene = useMemo(() => {
        if (!scene) return null;
        return scene.clone();
    }, [scene]);
    
    useEffect(() => {
        if (!clonedScene) return;
        
        // Convert carColor to number
        const bodyColor = hexToNumber(carColor);
        
        // Color mapping for different car parts
        const colorMap = {
            // Body parts - main car color (dynamic)
            'o_Body_Plane': { color: bodyColor, roughness: 0.2, metalness: 0.9 },
            'o_Doors_Plane004': { color: bodyColor, roughness: 0.2, metalness: 0.9 },
            'o_Roof_Plane021': { color: bodyColor, roughness: 0.2, metalness: 0.9 },
            
            // Carbon fiber parts - dark matte
            'o_CarbonTop_Plane014': { color: 0x0a0a0a, roughness: 0.8, metalness: 0.1 },
            'o_CarbonBack_Plane019': { color: 0x0a0a0a, roughness: 0.8, metalness: 0.1 },
            'o_CarbonFront_Plane010': { color: 0x0a0a0a, roughness: 0.8, metalness: 0.1 },
            
            // Wheels - dark metallic
            'o_Wheel_Circle004': { color: 0x1a1a1a, roughness: 0.3, metalness: 0.7 },
            'o_Wheel001_Circle009': { color: 0x1a1a1a, roughness: 0.3, metalness: 0.7 },
            'o_Wheel002_Circle012': { color: 0x1a1a1a, roughness: 0.3, metalness: 0.7 },
            'o_Wheel003_Circle019': { color: 0x1a1a1a, roughness: 0.3, metalness: 0.7 },
            
            // Tyres - black rubber
            'o_Tyre(Front)_Circle': { color: 0x0a0a0a, roughness: 0.9, metalness: 0.0 },
            'o_Tyre(Front)001_Circle010': { color: 0x0a0a0a, roughness: 0.9, metalness: 0.0 },
            'o_Tyre(Front)002_Circle011': { color: 0x0a0a0a, roughness: 0.9, metalness: 0.0 },
            'o_Tyre(Front)003_Circle020': { color: 0x0a0a0a, roughness: 0.9, metalness: 0.0 },
            
            // Brakes - red calipers
            'o_Brake_Plane006': { color: 0xff0000, roughness: 0.4, metalness: 0.3 },
            'o_Brake001_Plane009': { color: 0xff0000, roughness: 0.4, metalness: 0.3 },
            'o_Brake002_Plane011': { color: 0xff0000, roughness: 0.4, metalness: 0.3 },
            'o_Brake003_Plane012': { color: 0xff0000, roughness: 0.4, metalness: 0.3 },
            
            // Brake discs - metallic gray
            'o_BrakeDisc_Cylinder001': { color: 0x666666, roughness: 0.5, metalness: 0.8 },
            'o_BrakeDisc001_Cylinder000': { color: 0x666666, roughness: 0.5, metalness: 0.8 },
            'o_BrakeDisc002_Cylinder002': { color: 0x666666, roughness: 0.5, metalness: 0.8 },
            'o_BrakeDisc003_Cylinder003': { color: 0x666666, roughness: 0.5, metalness: 0.8 },
            
            // Glass - transparent blue
            'o_Windscreen(Front)_Plane023': { color: 0x88ccff, roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.7 },
            'o_Windscreen(Back)_Plane022': { color: 0x88ccff, roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.3 },
            'o_GlassFrontHighlight_Plane007': { color: 0x88ccff, roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.2 },
            'o_GlassBackHighlight_Plane015': { color: 0x88ccff, roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.2 },
            'o_MirrorsGlass_Plane017': { color: 0x88ccff, roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.3 },
            'o_MirrorsLightGlass_Plane018': { color: 0x88ccff, roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.3 },
            'o_Doors001_Plane026': { color: 0x88ccff, roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.3 },

            
            // Lights - yellow/white
            'o_LightFrontHighlight_Plane008': { color: 0xffffaa, roughness: 0.2, metalness: 0.0, emissive: 0xffffaa, emissiveIntensity: 1.5 },
            'o_LightBackHighlight_Plane028': { color: 0xff4444, roughness: 0.2, metalness: 0.0, emissive: 0xff4444, emissiveIntensity: 1.5 },
            'o_FarLightBall_Icosphere001': { color: 0xffffff, roughness: 0.1, metalness: 0.0, emissive: 0xffffff, emissiveIntensity: 2.0 },
            'o_MirrorsLED_Icosphere': { color: 0x00ff00, roughness: 0.1, metalness: 0.0, emissive: 0x00ff00, emissiveIntensity: 1.5 },
            
            // Mirrors - body color (dynamic)
            'o_Mirrors_Plane016': { color: bodyColor, roughness: 0.2, metalness: 0.9 },
            
            // Audi Logos - chrome/silver
            'o_AudiLogo(Front)_Circle007': { color: 0xcccccc, roughness: 0.1, metalness: 0.9 },
            'o_AudiLogo(Back)_Circle021': { color: 0xcccccc, roughness: 0.1, metalness: 0.9 },
            'o_AudiLogo(Wheel)_Circle008': { color: 0xcccccc, roughness: 0.1, metalness: 0.9 },
            'o_AudiLogo(Wheel)001_Circle001': { color: 0xcccccc, roughness: 0.1, metalness: 0.9 },
            'o_AudiLogo(Wheel)002_Circle015': { color: 0xcccccc, roughness: 0.1, metalness: 0.9 },
            'o_AudiLogo(Wheel)003_Circle016': { color: 0xcccccc, roughness: 0.1, metalness: 0.9 },
            
            // Exhaust - dark metallic
            'o_ExhaustSystem_Plane024': { color: 0x2a2a2a, roughness: 0.4, metalness: 0.8 },
            
            // Honeycomb grilles - dark gray
            'o_Honeycomb(front)_honeycomb001': { color: 0x1a1a1a, roughness: 0.6, metalness: 0.3 },
            'o_Honeycomb(ModdleBack)_honeycomb002': { color: 0x1a1a1a, roughness: 0.6, metalness: 0.3 },
            'o_Honeycomb(TopBack)_honeycomb003': { color: 0x1a1a1a, roughness: 0.6, metalness: 0.3 },
            'o_Honeycomb(BottomBack)_honeycomb004': { color: 0x1a1a1a, roughness: 0.6, metalness: 0.3 },
            'o_Honeycomb(Top)_honeycomb006': { color: 0x1a1a1a, roughness: 0.6, metalness: 0.3 },
            'o_Honeycomb(FrontSide)_honeycomb007': { color: 0x1a1a1a, roughness: 0.6, metalness: 0.3 },
            'o_HoneycombAirInput_honeycomb008': { color: 0x1a1a1a, roughness: 0.6, metalness: 0.3 },
            
            // Air inputs - dark
            'o_AirInput_Plane013': { color: 0x1a1a1a, roughness: 0.5, metalness: 0.4 },
            'o_AirInputFrontDetail_Plane025': { color: 0x1a1a1a, roughness: 0.5, metalness: 0.4 },
            'o_AirBackOutput_Plane020': { color: 0x1a1a1a, roughness: 0.5, metalness: 0.4 },
            
            // Number plates - white
            'o_NumbrePlateAudiR8(Font)_NumernSchildAudiR8': { color: 0xffffff, roughness: 0.7, metalness: 0.0 },
            'o_NumbrePlateAudiR8(Back)_NumernSchildAudiR8001': { color: 0xffffff, roughness: 0.7, metalness: 0.0 },
            
            // V10 text - accent color
            'o_v10_Text': { color: 0xff6600, roughness: 0.3, metalness: 0.7 },
            
            // Bolts - metallic
            'o_Bolt_Circle005': { color: 0x888888, roughness: 0.3, metalness: 0.8 },
            'o_Bolt001_Circle003': { color: 0x888888, roughness: 0.3, metalness: 0.8 },
            'o_Bolt002_Circle013': { color: 0x888888, roughness: 0.3, metalness: 0.8 },
            'o_Bolt003_Circle018': { color: 0x888888, roughness: 0.3, metalness: 0.8 },
            
            // Wheel centers - chrome/silver
            'o_WheelCentre_Circle006': { color: 0xcccccc, roughness: 0.2, metalness: 0.9 },
            'o_WheelCentre001_Circle002': { color: 0xcccccc, roughness: 0.2, metalness: 0.9 },
            'o_WheelCentre002_Circle014': { color: 0xcccccc, roughness: 0.2, metalness: 0.9 },
            'o_WheelCentre003_Circle017': { color: 0xcccccc, roughness: 0.2, metalness: 0.9 },
        };

        clonedScene.traverse((child) => {
            // Apply colors to meshes
            if (child.isMesh) {
                const materialConfig = colorMap[child.name];
                if (materialConfig) {
        child.material = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(materialConfig.color),
                        roughness: materialConfig.roughness,
                        metalness: materialConfig.metalness,
                        transparent: materialConfig.transparent || false,
                        opacity: materialConfig.opacity !== undefined ? materialConfig.opacity : 1.0,
                        emissive: materialConfig.emissive ? new THREE.Color(materialConfig.emissive) : 0x000000,
                        emissiveIntensity: materialConfig.emissiveIntensity || 0.0,
                    });
                }
        child.castShadow = true;
        child.receiveShadow = true;
      }
            
            if (child.isGroup) {
                child.traverse((groupChild) => {
                    if (groupChild.isMesh) {
                        const materialConfig = colorMap[child.name] || colorMap[groupChild.name];
                        if (materialConfig) {
                            groupChild.material = new THREE.MeshStandardMaterial({
                                color: new THREE.Color(materialConfig.color),
                                roughness: materialConfig.roughness,
                                metalness: materialConfig.metalness,
                                transparent: materialConfig.transparent || false,
                                opacity: materialConfig.opacity !== undefined ? materialConfig.opacity : 1.0,
                                emissive: materialConfig.emissive ? new THREE.Color(materialConfig.emissive) : 0x000000,
                                emissiveIntensity: materialConfig.emissiveIntensity || 0.0,
                            });
                        }
                        groupChild.castShadow = true;
                        groupChild.receiveShadow = true;
                    }
                });
            }
        });
    }, [clonedScene, carColor]); // Re-run the effect if the cloned scene or carColor changes.

    if (!clonedScene) return null;

  // The <primitive> component renders the entire scene graph.
    return <primitive object={clonedScene} {...props} />;
}

const AudiModel = ({ carColor, setCarColor }) => {
  // Create a memoized gradient texture that updates when the car color changes.
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0.8, carColor); // Top color (matches car)
    gradient.addColorStop(0.5, '#1a1a1a'); // Bottom color (dark gray)
    context.fillStyle = gradient;
    context.fillRect(0, 10, 1, 254);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [carColor]);

  return (
    <div className='absolute top-0 left-0 w-full h-full'>
      {/* Color Picker UI */}
      <div className='absolute bottom-10 left-1/2 -translate-x-1/2 z-10 bg-black/70 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/10 flex items-center gap-6'>
        {/* Current Color Display */}
        <div className='flex items-center gap-3 pr-6 border-r border-white/20'>
          <div 
            className='w-8 h-8 rounded-full border-2 border-white/50'
            style={{ backgroundColor: carColor }}
          />
          <span className='text-white text-md font-serif w-28'>
            {presetColors.find(p => p.value === carColor)?.name || 'Custom'}
          </span>
        </div>

        {/* Preset Colors */}
        <div className='flex items-center gap-3'>
          {presetColors.slice(0, 6).map((preset) => ( // Show first 6 presets
            <button
              key={preset.value}
              onClick={() => setCarColor(preset.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                carColor === preset.value 
                  ? 'border-white ring-2 ring-white/50' 
                  : 'border-white/30 hover:border-white/60'
              }`}
              style={{ backgroundColor: preset.value }}
              title={preset.name}
            />
          ))}
        </div>

        {/* Custom Color Picker */}
        <div className='flex items-center gap-3 pl-6 border-l border-white/20'>
          <input
            type='color'
            value={carColor}
            onChange={(e) => setCarColor(e.target.value)}
            className='w-10 h-10 rounded-full cursor-pointer border-2 border-white/20 appearance-none bg-transparent'
            title="Custom Color"
          />
          <input
            type='text'
            value={carColor}
            onChange={(e) => setCarColor(e.target.value)}
            className='bg-transparent text-white px-2 py-1 rounded border border-transparent focus:outline-none focus:border-white/40 w-24 font-mono text-sm'
            placeholder='#1a1a2e'
          />
        </div>
      </div>

      <Canvas  shadows camera={{ position: [8, 6, 6], fov: 75 }}>
        <EffectComposer>
            <Bloom 
                intensity={0.5} // The bloom intensity.
                luminanceThreshold={0.6} // luminance threshold. Raise this to mask out darker elements in the scene.
                luminanceSmoothing={0.9} // smoothness of the luminance threshold.
                height={300} // render height
            />
            <ambientLight intensity={2} />
            <directionalLight
              castShadow
              position={[10, 10, 5]}
              intensity={2}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            {/* This group wraps the car and pedestal to move them together */}
            <group position={[4, 2, -4]} rotation={[ degToRad(8),degToRad(-8) ,degToRad(8)]}>
              <Suspense fallback={<Loader />}>
                <Turntable>
                  <Model scale={1.8} position={[0, 0, 1]} carColor={carColor} />
                </Turntable>
              </Suspense>
              <mesh receiveShadow position={[0, -0.1, 0]}>
                <cylinderGeometry args={[5, 0, 0, 64]}/>
                <meshStandardMaterial 
                  map={gradientTexture} 
                  roughness={0.1} 
                  metalness={0.3} 
                  emissive={carColor} 
                  emissiveIntensity={0.2}/>
              </mesh>
            </group>
        </EffectComposer>
      </Canvas>
    </div>
  );
};

useGLTF.preload('/Audi.glb');

export default AudiModel;