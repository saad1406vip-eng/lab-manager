/* ═══════════════════════════════════════════════════════════
   نظام جرد المختبر — data.js
   البيانات الأساسية: الموظفون + الأجهزة + المحاليل
   ═══════════════════════════════════════════════════════════ */

/* ─── قائمة الموظفين (19 موظف) ─── */
var EMPLOYEES_LIST = [
  "سعد علي سعد القرني",
  "مسفر عائض محمد القرني",
  "محمد دخيل الله محمد الغامدي",
  "محمد خلف أحمد الخثعمي",
  "محمد سهلان سعد العليياني",
  "فهد عبد الله محمد القرني",
  "سلطان محمد دخيل القرني",
  "محمد سعد عبد الله القرني",
  "نايف عبد الله محبوب القرني",
  "حاتم خليفة كرار",
  "سعد عيد سعيد آل سعد القرني",
  "حسام سعيد عبد الله القرني",
  "محمد ناصر محمد القرني",
  "عبدالرحمن صالح عبدالرحمن القرني",
  "بدر محمد ماكن القرني",
  "عبدالعزيز راشد جديع البريدي",
  "منصور محمد منصور القرني",
  "نايف محمد عبد الله العليياني",
  "محمد صالح محمد الخثعمي"
];

/* ─── أنواع المحاليل ─── */
var SUPPLY_TYPES = {
  reagents:    { label: "كاشفات",        icon: "🧪", color: "#1565c0" },
  calibrators: { label: "معايرات",        icon: "⚖️", color: "#6a1b9a" },
  qc:          { label: "ضبط الجودة",     icon: "🔬", color: "#00897b" },
  solutions:   { label: "محاليل التشغيل", icon: "💧", color: "#0277bd" },
  parts:       { label: "قطع وإلكترودات", icon: "⚙️", color: "#5d4037" }
};

/* ─── بيانات الأجهزة ─── */
var SUPPLY_DATA = {

  /* ═══ Siemens Atellica ═══ */
  "siemens_atellica": {
    id: "siemens_atellica",
    name: "Siemens Atellica",
    short: "Atellica",
    company: "Siemens",
    supplies: [
      /* كاشفات */
      { id: 1,  name: "Glucose",        type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 2,  name: "Urea",           type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 3,  name: "Creatinine",     type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 4,  name: "Total Protein",  type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 5,  name: "Albumin",        type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 6,  name: "Cholesterol",    type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 7,  name: "Triglycerides",  type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 8,  name: "ALT",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 9,  name: "AST",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 10, name: "ALP",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 11, name: "CRP",            type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      /* معايرات */
      { id: 12, name: "Glucose Cal",    type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 13, name: "Multi Cal",      type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      /* QC */
      { id: 14, name: "QC Level 1",     type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 15, name: "QC Level 2",     type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      /* محاليل */
      { id: 16, name: "ProCell",        type: "solutions", qty: 0, minQty: 1, kitDays: 21 },
      { id: 17, name: "Cleaning Sol",   type: "solutions", qty: 0, minQty: 1, kitDays: 14 }
    ]
  },

  /* ═══ Cobas Pure ═══ */
  "cobas_pure": {
    id: "cobas_pure",
    name: "Cobas Pure (C303 + e402)",
    short: "Pure",
    company: "Roche",
    supplies: [
      { id: 1,  name: "Glucose",        type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 2,  name: "Urea",           type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 3,  name: "Creatinine",     type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 4,  name: "Total Protein",  type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 5,  name: "Albumin",        type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 6,  name: "TSH",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 7,  name: "FT4",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 8,  name: "Cholesterol",    type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 9,  name: "Triglycerides",  type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 10, name: "CRP",            type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 11, name: "CHEM Cal",       type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 12, name: "IM Cal",         type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 13, name: "CHEM QC",        type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 14, name: "IM QC",          type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 15, name: "C303 Cups",      type: "solutions", qty: 0, minQty: 5, kitDays: 30 },
      { id: 16, name: "e402 Cartridge", type: "solutions", qty: 0, minQty: 2, kitDays: 30 }
    ]
  },

  /* ═══ Cobas c311 ═══ */
  "cobas_c311": {
    id: "cobas_c311",
    name: "Cobas c311",
    short: "c311",
    company: "Roche",
    supplies: [
      { id: 1,  name: "Glucose",        type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 2,  name: "Urea",           type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 3,  name: "Creatinine",     type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 4,  name: "ALT",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 5,  name: "AST",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 6,  name: "ALP",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 7,  name: "Total Bilirubin",type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 8,  name: "Cholesterol",    type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 9,  name: "Triglycerides",  type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 10, name: "Calibrator",     type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 11, name: "QC Level 1",     type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 12, name: "QC Level 2",     type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 13, name: "Washing Sol",    type: "solutions", qty: 0, minQty: 2, kitDays: 14 }
    ]
  },

  /* ═══ Cobas e411 ═══ */
  "cobas_e411": {
    id: "cobas_e411",
    name: "Cobas e411",
    short: "e411",
    company: "Roche",
    supplies: [
      { id: 1,  name: "TSH",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 2,  name: "FT4",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 3,  name: "FT3",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 4,  name: "Testosterone",   type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 5,  name: "Estradiol",      type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 6,  name: "HCG",            type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 7,  name: "Prolactin",      type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 8,  name: "Ferritin",       type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 9,  name: "Vitamin B12",    type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 10, name: "Vitamin D",      type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 11, name: "IM Cal",         type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 12, name: "IM QC",          type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 13, name: "Beads",          type: "solutions", qty: 0, minQty: 2, kitDays: 30 }
    ]
  },

  /* ═══ Dimension EXL200 ═══ */
  "dimension_exl200": {
    id: "dimension_exl200",
    name: "Dimension EXL 200",
    short: "EXL200",
    company: "Siemens",
    supplies: [
      { id: 1,  name: "Glucose",        type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 2,  name: "Urea",           type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 3,  name: "Creatinine",     type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 4,  name: "Total Protein",  type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 5,  name: "Albumin",        type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 6,  name: "Cholesterol",    type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 7,  name: "Triglycerides",  type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 8,  name: "CRP",            type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 9,  name: "Calibrator",     type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 10, name: "QC Level 1",     type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 11, name: "QC Level 2",     type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 12, name: "Dimcal",         type: "solutions", qty: 0, minQty: 1, kitDays: 21 }
    ]
  },

  /* ═══ Mini VIDAS ═══ */
  "mini_vidas": {
    id: "mini_vidas",
    name: "Mini VIDAS",
    short: "VIDAS",
    company: "bioMérieux",
    supplies: [
      { id: 1, name: "Troponin",    type: "reagents", qty: 0, minQty: 3, kitDays: 14 },
      { id: 2, name: "BNP",         type: "reagents", qty: 0, minQty: 3, kitDays: 14 },
      { id: 3, name: "Myoglobin",   type: "reagents", qty: 0, minQty: 3, kitDays: 14 },
      { id: 4, name: "D-Dimer",     type: "reagents", qty: 0, minQty: 3, kitDays: 14 },
      { id: 5, name: "Ferritin",    type: "reagents", qty: 0, minQty: 3, kitDays: 21 },
      { id: 6, name: "CRP",         type: "reagents", qty: 0, minQty: 3, kitDays: 14 },
      { id: 7, name: "Calibrator",  type: "calibrators", qty: 0, minQty: 1, kitDays: 7 },
      { id: 8, name: "QC",          type: "qc", qty: 0, minQty: 1, kitDays: 30 },
      { id: 9, name: "Wash Sol",    type: "solutions", qty: 0, minQty: 2, kitDays: 30 }
    ]
  },

  /* ═══ VARIANT II ═══ */
  "variant_ii": {
    id: "variant_ii",
    name: "VARIANT II",
    short: "VARIANT",
    company: "Bio-Rad",
    supplies: [
      { id: 1, name: "HbA1c Reagent",  type: "reagents", qty: 0, minQty: 2, kitDays: 21 },
      { id: 2, name: "Control L1",     type: "qc", qty: 0, minQty: 1, kitDays: 30 },
      { id: 3, name: "Control L2",     type: "qc", qty: 0, minQty: 1, kitDays: 30 },
      { id: 4, name: "Calibration Kit",type: "calibrators", qty: 0, minQty: 1, kitDays: 90 },
      { id: 5, name: "Sample Cups",    type: "solutions", qty: 0, minQty: 5, kitDays: 60 },
      { id: 6, name: "Waste Container",type: "parts", qty: 0, minQty: 1, kitDays: 30 },
      { id: 7, name: "Needle Protector",type: "parts", qty: 0, minQty: 1, kitDays: 30 }
    ]
  }

};

/* ─── إعدادات ─── */
var APP_CONFIG = {
  storageKey: "lab_inventory_v3",
  warnDaysExpiry: 30,
  warnDaysExpirySoon: 7,
  warnKitDays: 7,
  facilityName: "تجمع عسير الصحي - مستشفى سبت العلايا",
  systemName: "نظام جرد المختبر"
};

/* ─── نهاية data.js ─── */
