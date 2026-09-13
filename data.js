/* ═════════════════════════════════════════════════════════ */
/* بيانات نظام جرد المختبر */
/* ═════════════════════════════════════════════════════════ */

// قائمة الموظفين (19 موظف)
const EMPLOYEES_LIST = [
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

// بيانات الأجهزة والمحاليل
const SUPPLY_DATA = {
  
  // ═══ جهاز Siemens Atellica ═══
  siemens_atellica: {
    id: "siemens_atellica",
    name: "Siemens Atellica",
    short: "Atellica",
    supplies: [
      { id: 1, name: "Glucose Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 2, name: "Urea Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 3, name: "Creatinine Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 4, name: "Total Protein Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 5, name: "Albumin Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 6, name: "Cholesterol Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 7, name: "Triglycerides Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 8, name: "ALT Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 9, name: "AST Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 10, name: "ALP Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 11, name: "CRP Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 12, name: "Glucose Calibrator", type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 13, name: "Multi Calibrator", type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 14, name: "QC Level 1", type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 15, name: "QC Level 2", type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 16, name: "ProCell", type: "solutions", qty: 0, minQty: 1, kitDays: 21 },
      { id: 17, name: "Cleaning Solution", type: "solutions", qty: 0, minQty: 1, kitDays: 14 }
    ]
  },

  // ═══ جهاز Cobas Pure ═══
  cobas_pure: {
    id: "cobas_pure",
    name: "Cobas Pure (C303 + e402)",
    short: "Pure",
    supplies: [
      { id: 1, name: "Glucose Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 2, name: "Urea Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 3, name: "Creatinine Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 4, name: "Total Protein Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 5, name: "Albumin Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 6, name: "TSH Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 7, name: "FT4 Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 8, name: "Cholesterol Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 9, name: "Triglycerides Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 10, name: "CRP Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 11, name: "CHEM Calibrator", type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 12, name: "IM Calibrator", type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 13, name: "CHEM QC", type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 14, name: "IM QC", type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 15, name: "C303 Cups", type: "solutions", qty: 0, minQty: 5, kitDays: 30 },
      { id: 16, name: "e402 Cartridge", type: "solutions", qty: 0, minQty: 2, kitDays: 30 }
    ]
  },

  // ═══ جهاز Cobas c311 ═══
  cobas_c311: {
    id: "cobas_c311",
    name: "Cobas c311",
    short: "c311",
    supplies: [
      { id: 1, name: "Glucose Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 2, name: "Urea Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 3, name: "Creatinine Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 4, name: "ALT Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 5, name: "AST Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 6, name: "ALP Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 7, name: "Total Bilirubin Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 8, name: "Cholesterol Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 9, name: "Triglycerides Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 10, name: "Calibrator", type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 11, name: "QC Level 1", type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 12, name: "QC Level 2", type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 13, name: "Washing Solution", type: "solutions", qty: 0, minQty: 2, kitDays: 14 }
    ]
  },

  // ═══ جهاز Cobas e411 ═══
  cobas_e411: {
    id: "cobas_e411",
    name: "Cobas e411",
    short: "e411",
    supplies: [
      { id: 1, name: "TSH Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 2, name: "FT4 Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 3, name: "FT3 Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 4, name: "Testosterone Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 5, name: "Estradiol Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 6, name: "HCG Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 7, name: "Prolactin Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 8, name: "Ferritin Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 9, name: "Vitamin B12 Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 10, name: "Vitamin D Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 11, name: "IM Calibrator", type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 12, name: "IM QC", type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 13, name: "Streptavidin Coated Beads", type: "solutions", qty: 0, minQty: 2, kitDays: 30 }
    ]
  },

  // ═══ جهاز Dimension EXL200 ═══
  dimension_exl200: {
    id: "dimension_exl200",
    name: "Dimension EXL 200",
    short: "EXL200",
    supplies: [
      { id: 1, name: "Glucose Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 2, name: "Urea Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 3, name: "Creatinine Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 4, name: "Total Protein Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 5, name: "Albumin Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 21 },
      { id: 6, name: "Cholesterol Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 7, name: "Triglycerides Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 8, name: "CRP Reagent", type: "reagents", qty: 0, minQty: 5, kitDays: 14 },
      { id: 9, name: "Calibrator", type: "calibrators", qty: 0, minQty: 2, kitDays: 7 },
      { id: 10, name: "QC Level 1", type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 11, name: "QC Level 2", type: "qc", qty: 0, minQty: 2, kitDays: 30 },
      { id: 12, name: "Dimcal", type: "solutions", qty: 0, minQty: 1, kitDays: 21 }
    ]
  },

  // ═══ جهاز Mini VIDAS ═══
  mini_vidas: {
    id: "mini_vidas",
    name: "Mini VIDAS",
    short: "VIDAS",
    supplies: [
      { id: 1, name: "Troponin Reagent", type: "reagents", qty: 0, minQty: 3, kitDays: 14 },
      { id: 2, name: "BNP Reagent", type: "reagents", qty: 0, minQty: 3, kitDays: 14 },
      { id: 3, name: "Myoglobin Reagent", type: "reagents", qty: 0, minQty: 3, kitDays: 14 },
      { id: 4, name: "D-Dimer Reagent", type: "reagents", qty: 0, minQty: 3, kitDays: 14 },
      { id: 5, name: "Ferritin Reagent", type: "reagents", qty: 0, minQty: 3, kitDays: 21 },
      { id: 6, name: "CRP Reagent", type: "reagents", qty: 0, minQty: 3, kitDays: 14 },
      { id: 7, name: "Calibrator", type: "calibrators", qty: 0, minQty: 1, kitDays: 7 },
      { id: 8, name: "QC", type: "qc", qty: 0, minQty: 1, kitDays: 30 },
      { id: 9, name: "Wash Solution", type: "solutions", qty: 0, minQty: 2, kitDays: 30 }
    ]
  },

  // ═══ جهاز VARIANT II ═══
  variant_ii: {
    id: "variant_ii",
    name: "VARIANT II",
    short: "VARIANT",
    supplies: [
      { id: 1, name: "HbA1c Reagent Pack", type: "reagents", qty: 0, minQty: 2, kitDays: 21 },
      { id: 2, name: "Control Level 1", type: "qc", qty: 0, minQty: 1, kitDays: 30 },
      { id: 3, name: "Control Level 2", type: "qc", qty: 0, minQty: 1, kitDays: 30 },
      { id: 4, name: "Calibration Kit", type: "calibrators", qty: 0, minQty: 1, kitDays: 90 },
      { id: 5, name: "Sample Cups", type: "solutions", qty: 0, minQty: 5, kitDays: 60 },
      { id: 6, name: "Waste Container", type: "parts", qty: 0, minQty: 1, kitDays: 30 },
      { id: 7, name: "Needle Protector", type: "parts", qty: 0, minQty: 1, kitDays: 30 }
    ]
  }
};

console.log('✅ تم تحميل البيانات بنجاح');
console.log('📊 عدد الموظفين:', EMPLOYEES_LIST.length);
console.log('🔧 عدد الأجهزة:', Object.keys(SUPPLY_DATA).length);
