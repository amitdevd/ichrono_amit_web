import { Slot } from 'expo-router';
import DealerShell from '@/components/dealer/DealerShell';

/** Signed-in dealer pages share the header + sidebar shell. */
export default function DealerPanelLayout() {
  return (
    <DealerShell>
      <Slot />
    </DealerShell>
  );
}
