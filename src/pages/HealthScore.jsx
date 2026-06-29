import { useState } from 'react';
import ScoreRing from '../components/ui/ScoreRing';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { useCountry } from '../contexts/CountryContext';
import './Dashboard.css';

export default function HealthScore() {
  const { country } = useCountry();
  const totalWeight = country.healthCategories.reduce((sum, c) => sum + c.weight, 0);
  const rawScore = country.healthCategories.reduce((sum, c) => sum + c.score, 0);
  const totalScore = totalWeight > 0 ? Math.round((rawScore / totalWeight) * 100) : 0;
  const scoreLabel = totalScore >= 80 ? 'Healthy' : totalScore >= 60 ? 'Needs Attention' : 'At Risk';
  const scoreLabelColor = totalScore >= 80 ? 'var(--status-safe)' : totalScore >= 60 ? 'var(--status-warn)' : 'var(--status-danger)';
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(`My Themis Legal Health Score: ${totalScore}/100 -- ${country.healthCategories.filter(c => c.status === 'danger').length} critical issues found.`).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    });
  };

  return (
    <div>
      <div className="app-main__header">
        <h1 className="app-main__greeting">Legal Health Score</h1>
        <p className="app-main__subtitle">
          Comprehensive diagnostic across 8 critical legal dimensions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
        {/* Score Ring Column */}
        <div className="page-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-8)' }}>
          <ScoreRing score={totalScore} size={200} strokeWidth={10} />
          <div style={{ textAlign: 'center' }}>
            <strong style={{ fontSize: 'var(--text-lg)', color: scoreLabelColor }}>{scoreLabel}</strong>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
              {country.healthCategories.filter((c) => c.status === 'danger').length} critical issue(s) require immediate action.
            </p>
          </div>
          <Button variant="secondary" size="sm" style={{ width: '100%' }} onClick={handleShare}>
            {shared ? 'Link Copied!' : 'Share Score'}
          </Button>
        </div>

        {/* Category Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {country.healthCategories.map((cat) => (
            <div key={cat.name} className="page-panel" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{cat.name}</strong>
                  <StatusBadge status={cat.status}>
                    {cat.status === 'safe' ? 'Compliant' : cat.status === 'warn' ? 'Incomplete' : 'Missing'}
                  </StatusBadge>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  {cat.score}/{cat.weight}
                </span>
              </div>
              <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 'var(--space-3)' }}>
                <div style={{
                  height: '100%',
                  width: `${(cat.score / cat.weight) * 100}%`,
                  background: cat.status === 'safe' ? 'var(--status-safe)' : cat.status === 'warn' ? 'var(--status-warn)' : 'var(--status-danger)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.8s var(--ease-out)',
                }} />
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
