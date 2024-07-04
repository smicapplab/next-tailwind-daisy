import React from 'react';
import DocumentIcon from './DocumentIcon';

const DocumentBadgeWithTooltip = ({ count, tooltipText }) => {
  return (
    <div className="badge badge-error text-white flex items-center tooltip" data-tip={tooltipText}>
      <span>{count}</span>
      <DocumentIcon dimension={4} />
    </div>
  );
};

export default DocumentBadgeWithTooltip;