import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

// 진료 항목 데이터 타입 정의 (Project Schema mapping)
interface Treatment {
    id: string;
    name: string;          // Maps to service_name
    marketing_copy?: string; // Maps to benefit_text
    description?: string;
    price: number;        // Maps to price
    image_url?: string | null;
}

interface TreatmentCardProps {
    treatment: any; // Input is the raw DB record
    onClick?: (treatment: any) => void;
}

export const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment: t, onClick }) => {
    const [imageError, setImageError] = useState(false);

    // Mapping logic: Normalize DB record to the User's requested prop names
    const treatment: Treatment = {
        id: t.id,
        name: t.service_name || t.name,
        marketing_copy: t.benefit_text || t.marketing_copy,
        description: t.description,
        price: t.price || 0,
        image_url: t.image_url
    };

    const hasImage = treatment.image_url && !imageError && treatment.image_url !== 'null' && treatment.image_url !== '';

    return (
        <motion.div
            onClick={() => onClick && onClick(t)}
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
            className="group bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full cursor-pointer transition-shadow"
        >
            {/* 이미지 영역 (Apple Health 스타일 그라데이션 Fallback) */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-5">
                {hasImage ? (
                    <img
                        src={treatment.image_url!}
                        alt={treatment.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
                    >
                        <Stethoscope strokeWidth={1.5} className="text-slate-400 opacity-60 w-10 h-10" />
                    </div>
                )}
            </div>

            {/* 텍스트 컨텐츠 영역 */}
            <div className="flex flex-col flex-grow">
                <h3 className="text-slate-800 text-lg font-medium tracking-wide group-hover:text-[#4ca1af] transition-colors duration-300">
                    {treatment.name}
                </h3>

                {treatment.marketing_copy && (
                    <p className="text-[#4ca1af] text-xs font-medium mt-1 mb-2">
                        {treatment.marketing_copy}
                    </p>
                )}

                <p className="text-slate-500 text-sm mt-2 leading-relaxed line-clamp-2">
                    {treatment.description || "상세 진료 내용을 입력해주세요."}
                </p>

                {/* 가격 정보 (명품 프라이싱 스펙 적용) */}
                <div className="mt-auto pt-6 flex items-baseline justify-between">
                    <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">From</span>
                    <span className="tabular-nums font-black text-3xl tracking-tighter text-slate-900">
                        £{treatment.price.toLocaleString()}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default TreatmentCard;
