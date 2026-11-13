import { useEffect, useState } from 'react';

type CaptionBounds = { left: number; top: number; width: number; height: number };

// Read the shared table's layout marker while keeping the caption above overlays.
export default function useTableVoiceCaptionBounds() {
  const [bounds, setBounds] = useState<CaptionBounds | null>(null);

  useEffect(() => {
    let frame: number | null = null;
    let region: Element | null = null;
    const publish = () => {
      frame = null;
      const nextRegion = document.getElementById('bridge-table-voice-caption-region');
      if (nextRegion !== region) {
        resize.disconnect();
        placement.disconnect();
        region = nextRegion;
        if (region) {
          resize.observe(region);
          placement.observe(region, { attributes: true, attributeFilter: ['style'] });
        }
      }
      const rect = region?.getBoundingClientRect();
      const next = rect
        ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
        : null;
      setBounds(current => current?.left === next?.left && current?.top === next?.top
        && current?.width === next?.width && current?.height === next?.height
        ? current : next);
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(publish);
    };
    const resize = new ResizeObserver(schedule);
    const placement = new MutationObserver(schedule);
    const tree = new MutationObserver(schedule);
    tree.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    publish();
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      resize.disconnect();
      placement.disconnect();
      tree.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
    };
  }, []);

  return bounds;
}
