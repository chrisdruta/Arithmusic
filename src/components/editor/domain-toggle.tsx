import { useState } from 'react';

type DomainMode = 'time' | 'beat';

export default function DomainToggle() {
  const [domain, setDomain] = useState<DomainMode>('time');

  return (
    <div className="flex items-center">
      <span className="mr-2 text-[11px] tracking-widest text-muted-foreground">Domain:</span>
      <div className="domain-toggle">
        <button
          className={`domain-toggle-option ${domain === 'time' ? 'active' : ''}`}
          onClick={() => setDomain('time')}
        >
          TIME
        </button>
        <button
          className={`domain-toggle-option ${domain === 'beat' ? 'active' : ''}`}
          onClick={() => setDomain('beat')}
        >
          BEAT
        </button>
        <div className={`domain-toggle-indicator ${domain === 'beat' ? 'right' : ''}`} />
      </div>
    </div>
  );
}
