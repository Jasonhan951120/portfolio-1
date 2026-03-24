import React from 'react';

// 아무것도 의존하지 않는 가장 단순한 버전
export function ClinicSettings({ isOpen, onClose, templates, setTemplates }: any) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', color: 'black', width: '500px' }}>
        <h1 style={{ marginTop: 0 }}>🚨 긴급 복구 모드</h1>
        <p>일단 화면이 보인다면 외부 라이브러리(Store, Icons 등) 경로 문제입니다.</p>
        
        <button 
          onClick={() => setTemplates([...(templates || []), { id: Date.now().toString(), name: 'Test', price: 100 }])}
          style={{ padding: '10px 20px', backgroundColor: '#000', color: '#fff', borderRadius: '10px', cursor: 'pointer' }}
        >
          임시 ADD TEST
        </button>

        <div style={{ marginTop: '20px' }}>
          {(templates || []).map((t: any) => (
            <div key={t.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              {t.name} - £{t.price}
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{ marginTop: '20px', color: 'gray', border: 'none', background: 'none', cursor: 'pointer' }}>
          [닫기]
        </button>
      </div>
    </div>
  );
}
