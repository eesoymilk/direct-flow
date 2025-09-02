import { getFieldLabel as getLabel } from '~/utils/fieldLabels';

/**
 * Composable for getting field labels
 */
export const useFieldLabel = (fieldPath: string): string => {
  return getLabel(fieldPath);
};