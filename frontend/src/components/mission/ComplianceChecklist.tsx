import React from 'react';
import type { ComplianceItem } from '../../hooks/useMissionControl';

interface Props {
  title: string;
  items: ComplianceItem[];
  onToggle: (id: string) => void;
  onAction?: (item: ComplianceItem) => void;
}

const ACTION_LABELS: Record<string, string> = {
  'gdpr-1': 'Configure',
  'gdpr-2': 'Test Delete',
  'gdpr-3': 'Test Export',
  'gdpr-4': 'Preview Banner',
  'gdpr-5': 'View Log',
  'ai-1': 'View Models',
  'ai-2': 'Upload PDF',
  'ai-3': 'Set Classification',
  'ai-4': 'Configure',
  'ai-5': 'View Log',
  'ai-6': 'View Incidents',
};

export default function ComplianceChecklist({ title, items, onToggle, onAction }: Props) {
  const completed = items.filter(i => i.completed).length;

  return (
    <div className="compliance-checklist">
      <div className="compliance-checklist__header">
        <h3 className="compliance-checklist__title">{title}</h3>
        <div className="compliance-checklist__progress">
          <div className="compliance-checklist__progress-bar">
            <div
              className="compliance-checklist__progress-fill"
              style={{ width: `${(completed / items.length) * 100}%` }}
            />
          </div>
          <span className="compliance-checklist__progress-text">{completed}/{items.length}</span>
        </div>
      </div>

      <div className="compliance-checklist__items">
        {items.map(item => (
          <div key={item.id} className={`compliance-item ${item.completed ? 'completed' : ''}`}>
            <button
              className="compliance-item__checkbox"
              onClick={() => onToggle(item.id)}
              title={item.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {item.completed ? '✓' : ''}
            </button>
            <div className="compliance-item__body">
              <div className="compliance-item__top">
                <span className="compliance-item__title">{item.title}</span>
                {onAction && (
                  <button
                    className="compliance-item__action"
                    onClick={() => onAction(item)}
                  >
                    {ACTION_LABELS[item.id] || 'Configure'}
                  </button>
                )}
              </div>
              <p className="compliance-item__desc">{item.description}</p>
              <span className="compliance-item__meta">
                Last updated: {item.lastUpdated} · {item.updatedBy}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
