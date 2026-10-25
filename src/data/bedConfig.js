// =============================================================
// Bed Configuration — CradleSense
// Defines the 6 NICU bed slots and their associated device IDs.
// Device assignments are demonstration defaults, not real patients.
// =============================================================

export const BED_CONFIGS = {
  "BED-01": {
    bedId:    "BED-01",
    label:    "NICU Bed 01",
    deviceId: "NCMS-001",
    shortId:  "01",
  },
  "BED-02": {
    bedId:    "BED-02",
    label:    "NICU Bed 02",
    deviceId: "NCMS-002",
    shortId:  "02",
  },
  "BED-03": {
    bedId:    "BED-03",
    label:    "NICU Bed 03",
    deviceId: "NCMS-003",
    shortId:  "03",
  },
  "BED-04": {
    bedId:    "BED-04",
    label:    "NICU Bed 04",
    deviceId: "NCMS-004",
    shortId:  "04",
  },
  "BED-05": {
    bedId:    "BED-05",
    label:    "NICU Bed 05",
    deviceId: "NCMS-005",
    shortId:  "05",
  },
  "BED-06": {
    bedId:    "BED-06",
    label:    "NICU Bed 06",
    deviceId: "NCMS-006",
    shortId:  "06",
  },
};

export const BED_IDS = Object.keys(BED_CONFIGS);
