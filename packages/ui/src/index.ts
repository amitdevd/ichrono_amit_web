/**
 * @ichrono/ui – shared building blocks used by every portal (User Web, Dealer, Admin).
 * Import from '@ichrono/ui' (or '@/components', which forwards here).
 *
 * Portal-specific pieces (page frames, shells, cards) live in
 * src/components/{user,dealer,admin}.
 */

// Layout helpers
export { useBreakpoint, useHydrated, Breakpoints } from './hooks/useBreakpoint';

// Basics
export { default as Icon } from './Icon';
export { default as ClientOnly } from './ClientOnly';
export { default as Btn, type BtnVariant } from './Btn';
export { default as AppModal } from './AppModal';

// Form controls
export { default as Field, FieldLabel, ErrorText } from './Field';
export { default as SelectField, type Option } from './SelectField';
export { default as MultiSelectField } from './MultiSelectField';
export { default as DateField } from './DateField';
export { default as OptionChips } from './OptionChips';
export { default as RangeSlider } from './RangeSlider';
export { default as OtpInput } from './OtpInput';
export { ToggleSwitch, CheckBox, Radio } from './Controls';
export { pickImage, AvatarUpload, DocumentBox } from './ImageUpload';

// Data display
export { default as DataTable, type Column } from './DataTable';
