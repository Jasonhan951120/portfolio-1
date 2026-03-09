import React from 'react';
import TreatmentCard from './TreatmentCard';

export default function VerifyUI() {
    const mockTreatments = [
        {
            id: '1',
            service_name: 'Invisalign Essentials',
            benefit_text: 'The gold standard in clear aligners',
            description: 'Achieve a perfectly aligned smile with our customized Invisalign treatment plan. Includes all scans, aligners, and post-treatment retainers.',
            price: 3500,
            image_url: 'https://res.cloudinary.com/dvmxeaefb/image/upload/v1771946506/hf_20260224_151749_3de2a6c0-90c0-4902-9cfd-1ce20cf8c437_uvtxfi.jpg'
        },
        {
            id: '2',
            service_name: 'Premium Boutique Whitening',
            benefit_text: '8 shades brighter in just one session',
            description: 'Experience professional-grade results with our boutique whitening system. Safe, effective, and tailored to your sensitive needs.',
            price: 495,
            image_url: null // Testing Fallback
        },
        {
            id: '3',
            service_name: 'Composite Bonding',
            benefit_text: 'Sculpt your perfect smile in a single visit',
            description: 'Artistic restoration of chips, gaps, and stains using ultra-high-end composite materials. No drilling, no pain, immediate results.',
            price: 250,
            image_url: 'https://res.cloudinary.com/dvmxeaefb/image/upload/v1771948285/hf_20260224_154924_46b8f778-f5be-4742-bbea-e005b5f4a077_vfsryh.jpg'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FBFBFB] p-12 lg:p-24">
            <div className="max-w-6xl mx-auto">
                <div className="mb-20">
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2 uppercase tracking-tight">UI Verification: Clinical Luxury Spec</h1>
                    <p className="text-gray-500 font-medium italic">Inspecting TreatmentCard components for Harrods-style aesthetic fidelity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {mockTreatments.map(t => (
                        <div key={t.id} className="h-[500px]">
                            <TreatmentCard treatment={t} onClick={(data) => console.log('Clicked:', data)} />
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Specs Checklist:</h2>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li>✅ <span className="font-bold text-gray-900">Refined Geometry</span>: p-7 padding implemented.</li>
                        <li>✅ <span className="font-bold text-gray-900">Premium Shadows</span>: 0.03 opacity base, 0.06 opacity hover.</li>
                        <li>✅ <span className="font-bold text-gray-900">Clinical Motion</span>: -translate-y-1.5 lift with 500ms ease-out.</li>
                        <li>✅ <span className="font-bold text-gray-900">Frosted Fallback</span>: Stethoscope icon at 30% opacity on premium gradient.</li>
                        <li>✅ <span className="font-bold text-gray-900">Luxury Pricing</span>: font-extrabold with tracking-tighter for price numeric.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
