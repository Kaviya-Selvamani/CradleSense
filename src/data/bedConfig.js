// =============================================================
// Bed Configuration — CradleSense
// Defines the 6 NICU bed slots and their associated device IDs.
// Device assignments are demonstration defaults, not real patients.
// =============================================================

export const BED_CONFIGS = {
  "BED-01": {
    bedId:    "BED-01",
    label:    "NICU Bed 01",
    unitType: "Incubator A",
    patientTag: "Neonate #101 · GA 32w",
    deviceId: "NCMS-001",
    shortId:  "01",
  },
  "BED-02": {
    bedId:    "BED-02",
    label:    "NICU Bed 02",
    unitType: "Incubator B",
    patientTag: "Neonate #102 · GA 34w",
    deviceId: "NCMS-002",
    shortId:  "02",
  },
  "BED-03": {
    bedId:    "BED-03",
    label:    "NICU Bed 03",
    unitType: "Radiant Warmer 1",
    patientTag: "Neonate #103 · GA 29w",
    deviceId: "NCMS-003",
    shortId:  "03",
  },
  "BED-04": {
    bedId:    "BED-04",
    label:    "NICU Bed 04",
    unitType: "Radiant Warmer 2",
    patientTag: "Neonate #104 · GA 36w",
    deviceId: "NCMS-004",
    shortId:  "04",
  },
  "BED-05": {
    bedId:    "BED-05",
    label:    "NICU Bed 05",
    unitType: "Step-Down Cot",
    patientTag: "Neonate #105 · GA 37w",
    deviceId: "NCMS-005",
    shortId:  "05",
  },
  "BED-06": {
    bedId:    "BED-06",
    label:    "NICU Bed 06",
    unitType: "Phototherapy Unit",
    patientTag: "Neonate #106 · GA 35w",
    deviceId: "NCMS-006",
    shortId:  "06",
  },
};

export const BED_IDS = Object.keys(BED_CONFIGS);
