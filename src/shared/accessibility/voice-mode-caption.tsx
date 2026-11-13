import { useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import Text from '@/components/app-text';
import { responsiveHeightFontSize, TEXT_FRAME_RATIO } from '@/lib/interface-scale';
import { useVoiceMode } from './voice-mode';
import { observeVoiceCaption } from './voice-caption-observer';
import useTableVoiceCaptionBounds from './use-table-voice-caption-bounds';

function VisibleVoiceModeCaption() {
  const [text, setText] = useState('');
  const captionRef = useRef<HTMLDivElement>(null);
  const tableBounds = useTableVoiceCaptionBounds();
  const { width, height } = useWindowDimensions();
  const fontSize = responsiveHeightFontSize(height * 0.020, width, height, width < 820);

  useEffect(() => observeVoiceCaption(document, setText), []);
  useEffect(() => { captionRef.current?.scrollTo({ top: 0 }); }, [text]);

  if (!text || tableBounds && (tableBounds.width <= 0 || tableBounds.height <= 0)) return null;
  return (
    <div
      ref={captionRef}
      data-voice-caption
      aria-hidden="true"
      inert
      tabIndex={-1}
      style={{
        position: 'fixed',
        ...(tableBounds ?? { bottom: 0, left: 0, right: 0 }),
        zIndex: 10000,
        pointerEvents: 'none',
        display: 'flex', alignItems: tableBounds ? 'flex-start' : undefined,
        overflowY: tableBounds ? 'auto' : undefined,
        overflowX: tableBounds ? 'hidden' : undefined,
        overscrollBehavior: tableBounds ? 'contain' : undefined,
      }}
    >
      <Text
        accessible={false}
        aria-hidden
        style={{
          flex: 1,
          fontSize,
          lineHeight: fontSize * TEXT_FRAME_RATIO,
          fontWeight: '400',
          color: '#4b7198',
          textAlign: 'center',
        }}
      >
        {text}
      </Text>
    </div>
  );
}

export default function VoiceModeCaption() {
  const { enabled } = useVoiceMode();
  return enabled && typeof document !== 'undefined' ? <VisibleVoiceModeCaption /> : null;
}
