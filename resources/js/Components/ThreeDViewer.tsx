import React, { Suspense, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useProgress, Html } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface ThreeDViewerProps {
    url: string;
    color?: string;
}

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary-500 animate-spin"></div>
                <div className="text-xs font-bold text-slate-500">{progress.toFixed(0)}%</div>
            </div>
        </Html>
    );
}

function Model({ url, color = '#e8d2ac' }: { url: string; color?: string }) {
    // Load STL file
    const geometry = useLoader(STLLoader, url);

    // Create material for the dental model - usually a mat, slightly reflective surface
    const material = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.4,
            metalness: 0.1,
        });
    }, [color]);

    return (
        <mesh geometry={geometry} material={material} castShadow receiveShadow />
    );
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ThreeDViewer Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center p-6 text-center w-full h-full min-h-[400px] bg-slate-900 rounded-xl border border-red-500/30">
                    <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-red-400 font-bold mb-2">Failed to load 3D Model</h3>
                    <p className="text-slate-400 text-xs max-w-sm line-clamp-3">
                        {this.state.error?.message || "An unknown rendering error occurred."}
                    </p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function ThreeDViewer({ url, color }: ThreeDViewerProps) {
    if (!url) return <div className="p-8 text-center text-gray-500">Model URL not provided</div>;

    return (
        <ErrorBoundary>
            <div className="w-full h-full min-h-[400px] bg-slate-900 rounded-xl overflow-hidden shadow-inner relative">
                <Canvas shadows camera={{ position: [0, 0, 100], fov: 50 }}>
                    <color attach="background" args={['#0f172a']} />
                    <Suspense fallback={<Loader />}>
                        <Stage environment="city" intensity={0.6} castShadow={false}>
                            <Model url={url} color={color} />
                        </Stage>
                    </Suspense>

                    <OrbitControls
                        makeDefault
                        autoRotate={false}
                        enablePan={true}
                        enableZoom={true}
                        minDistance={10}
                        maxDistance={300}
                    />
                </Canvas>
                <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700 pointer-events-none">
                    <p className="text-[10px] text-slate-300 font-medium">Left Click: Rotate &bull; Right Click: Pan &bull; Scroll: Zoom</p>
                </div>
            </div>
        </ErrorBoundary>
    );
}
