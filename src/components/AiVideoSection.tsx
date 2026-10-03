import React from 'react';
import { BusinessAiSection } from './BusinessAiSection';

interface AiVideoSectionProps {
  onOpenDemoModal: () => void;
}

export const AiVideoSection: React.FC<AiVideoSectionProps> = ({ onOpenDemoModal }) => {
  return <BusinessAiSection onOpenDemoModal={onOpenDemoModal} />;
};
