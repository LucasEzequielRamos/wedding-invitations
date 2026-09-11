/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateSectionConfig } from "../schemas/invitation-section.schema";

export function getSectionConfig(
  type: string,
  config: unknown,
) {
  return validateSectionConfig(
    type as any,
    config,
  );
}