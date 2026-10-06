export const SUPPORTED_VENDORS = ["soroush", "rubika"] as const;

export type Vendor = (typeof SUPPORTED_VENDORS)[number];

export const UNSPECIFIED_VENDOR = "unspecified";

export type VendorFilterValue = Vendor | typeof UNSPECIFIED_VENDOR;

export function isVendor(value: string): value is Vendor {
  return SUPPORTED_VENDORS.some((vendor) => vendor === value);
}

const VENDOR_LABELS: Record<VendorFilterValue, string> = {
  soroush: "سروش",
  rubika: "روبیکا",
  unspecified: "نامشخص",
};

export function vendorLabel(value: string): string {
  return isVendor(value) || value === UNSPECIFIED_VENDOR ? VENDOR_LABELS[value] : value;
}
