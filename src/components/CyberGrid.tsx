import React from 'react';

const CyberGrid: React.FC = () => {
  return (
    <div id="cyber_grid_bg" className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-black">
      {/* Dynamic scanlines */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 147, 255, 0.3) 50%, transparent 50%)',
          backgroundSize: '100% 4px'
        }}
      />
      {/* Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(59, 130, 246) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(59, 130, 246) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)'
        }}
      />
      {/* Background neon radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] bg-indigo-500/5 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[140px] bg-rose-500/5 animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[40%] left-[60%] w-[35vw] h-[35vw] rounded-full blur-[100px] bg-emerald-500/5 animate-pulse" style={{ animationDuration: '10s' }} />
    </div>
  );
};

export default CyberGrid;
