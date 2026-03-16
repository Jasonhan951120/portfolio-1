import React, { useEffect } from 'react';

interface GoogleOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GoogleOnboardingModal: React.FC<GoogleOnboardingModalProps> = ({ isOpen, onClose }) => {
  // 1. 배경 스크롤 잠금 (Body Scroll Lock)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // 모달 언마운트 시 스크롤 복구
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 2. 실제 Google OAuth 2.0 리다이렉트 로직
  const handleGoogleAuthRedirect = () => {
    const clientId = "401672125235-qu53kh0tnu8guolq1u6ksjsc7bl9uah6.apps.googleusercontent.com";
    const redirectUri = "https://www.hanlanoc.com/admin";
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile`;
    
    window.location.href = oauthUrl;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* 최상위 고정 컨테이너: 대통령 계급장 z-[100]으로 무조건 최상단 노출 */}
      {/* 까만색 반투명 배경 (Dark Overlay) */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 하얀색 모달 박스 알맹이: 배경보다 한 칸 위인 z-[101] 부여 */}
      <div className="relative z-[101] max-w-md w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all p-8 flex flex-col gap-6">
        
        {/* 모달 헤더 및 텍스트 */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Unlock the Financial Value of Your Reputation
          </h2>
          <p className="mt-3 text-sm font-medium text-slate-500">
            Connect your Google Business account to automatically sync 5-star reviews and track ROI.
          </p>
        </div>

        {/* 액션 버튼 푸터 */}
        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100 pt-5">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleGoogleAuthRedirect}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            CONNECT SAFELY WITH GOOGLE
          </button>
        </div>
      </div>
    </div>
  );
};
