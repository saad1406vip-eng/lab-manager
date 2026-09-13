/* ═══════════════════════════════════════════════════════════
   Lab Manager Pro v2 — data.js
   الجزء 1: الإعدادات العامة + Atellica + Cobas Pure
   ═══════════════════════════════════════════════════════════ */

/* ─── معلومات المنشأة ─── */
var REPORT_INFO = {
  name: "سعد علي سعد القرني",
  title: "فني مختبر",
  facility: "تجمع عسير الصحي - مستشفى سبت العلايه",
  dept: "المختبر - قسم الكيمياء الحيويه والهرمونات"
};

/* ─── إعدادات التنبيهات ─── */
var WARN_DAYS = 30;         // تنبيه صلاحية قبل 30 يوم
var WARN_KIT_DAYS = 7;      // تنبيه نفاد الكتة قبل 7 أيام

/* ═══════════════════════════════════════════════════════════
   الأجهزة — التعريف الكامل
   ═══════════════════════════════════════════════════════════ */
var DEVICES = {
  atellica: {
    id: "atellica",
    name: "Siemens Atellica Solution",
    short: "Atellica",
    company: "Siemens",
    type: "both",              // كيمياء + هرمون
    typeLabel: "كيمياء + هرمون",
    description: "CH + IM مدمج",
    sharedWith: null,
    isActive: true
  },
  cobas_pure: {
    id: "cobas_pure",
    name: "Cobas Pure (C303 + e402)",
    short: "Pure",
    company: "Roche",
    type: "both",
    typeLabel: "كيمياء + هرمون",
    description: "C303 + e402 مدمج",
    sharedWith: null,
    isActive: true
  },
  c311: {
    id: "c311",
    name: "Cobas c311",
    short: "c311",
    company: "Roche",
    type: "chem",
    typeLabel: "كيمياء",
    description: "جهاز كيمياء مستقل",
    sharedWith: "c303",
    sharedTypes: ["Calibrator", "QC"],
    isActive: true
  },
  e411: {
    id: "e411",
    name: "Cobas e411",
    short: "e411",
    company: "Roche",
    type: "hormone",
    typeLabel: "هرمونات + فيروسات",
    description: "جهاز هرمونات مستقل",
    sharedWith: "e402",
    sharedTypes: ["Calibrator", "QC"],
    isActive: true
  },
  dimension: {
    id: "dimension",
    name: "Dimension EXL 200",
    short: "EXL200",
    company: "Siemens",
    type: "chem",
    typeLabel: "كيمياء",
    description: "جهاز كيمياء",
    sharedWith: null,
    isActive: true
  },
  vidas: {
    id: "vidas",
    name: "Mini VIDAS",
    short: "VIDAS",
    company: "bioMérieux",
    type: "emergency",
    typeLabel: "طوارئ",
    description: "طوارئ — bHCG + Troponin فقط",
    sharedWith: null,
    isActive: true
  },
  variant: {
    id: "variant",
    name: "VARIANT II",
    short: "VARIANT",
    company: "Bio-Rad",
    type: "chem",
    typeLabel: "HbA1c",
    description: "جهاز HbA1c",
    sharedWith: null,
    isActive: true
  }
  // ملاحظة: Stratus CS 200 مستبعد — لا يعمل
};

/* ─── أسماء مختصرة للأجهزة (للجدول) ─── */
var DEVICE_SHORT = {
  atellica: "Atellica",
  cobas_pure: "Pure",
  c311: "c311",
  e411: "e411",
  dimension: "EXL200",
  vidas: "VIDAS",
  variant: "VARIANT"
};

/* ═══════════════════════════════════════════════════════════
   قواعد الربط بين الأجهزة
   ═══════════════════════════════════════════════════════════ */
var SHARED_RULES = {
  "c311": {
    with: "c303",
    displayName: "Cobas C303",
    shares: ["Calibrator", "QC"],
    note: "نفس محاليل المعايرة والـQC"
  },
  "cobas_pure_c303": {
    with: "c311",
    displayName: "Cobas c311",
    shares: ["Calibrator", "QC"],
    note: "نفس محاليل المعايرة والـQC"
  },
  "e411": {
    with: "e402",
    displayName: "Cobas e402",
    shares: ["Calibrator", "QC"],
    note: "نفس محاليل المعايرة والـQC"
  },
  "cobas_pure_e402": {
    with: "e411",
    displayName: "Cobas e411",
    shares: ["Calibrator", "QC"],
    note: "نفس محاليل المعايرة والـQC"
  }
};

/* ═══════════════════════════════════════════════════════════
   تصنيفات الاختبارات (أساسية / طوارئ / نادرة)
   ═══════════════════════════════════════════════════════════ */
var ROUTINE_CHEM = [
  "GLU","UREA","CREA","UA","Na","K","Cl","Ca","PHOS","Mg",
  "ALT","AST","ALP","GGT","TBIL","DBIL","TP","ALB",
  "CHOL","TG","HDL","LDL","CK","CK-MB","LDH","AMY","LIP",
  "CRP","Fe","UIBC"
];

var ROUTINE_HORMONE = [
  "TSH","FT4","FT3","LH","FSH","Prolactin","Testosterone",
  "Estradiol","Progesterone","Cortisol","HCG-Beta",
  "Ferritin","Vitamin-B12","Vitamin-D","Folate","PSA",
  "CEA","AFP","CA-125","CA-15-3","CA-19-9"
];

var EMERGENCY_TESTS = [
  "Troponin","Troponin-I","bHCG","HCG-Beta","GLU","UREA","CREA",
  "Na","K","Cl","Amylase","AMY","Lipase","LIP","CK-MB","CRP"
];

var RARE_TESTS = [
  "NH3","Lactate","TIBC","IBCT","PTH","C-peptide","Insulin",
  "DHEA-S","Her-2","CA-72-3","Anti-Tg","aTgII","Procalcitonin",
  "PCT","NT-proBNP","PBNP","Vitamin B12","Folate","Estradiol-E2"
];

/* ═══════════════════════════════════════════════════════════
   أنواع العينات (فلاتر)
   ═══════════════════════════════════════════════════════════ */
var SAMPLE_TYPES = [
  { id: "all",        label: "الكل",         icon: "📋", priority: 0 },
  { id: "emergency",  label: "طوارئ",        icon: "🚨", priority: 1 },
  { id: "urgent",     label: "مستعجل",       icon: "⏱️", priority: 2 },
  { id: "centers",    label: "مراكز",        icon: "🏥", priority: 3 },
  { id: "routine",    label: "غير مستعجل",   icon: "🕐", priority: 4 }
];

/* ═══════════════════════════════════════════════════════════
   أيقونات وأنواع المواد
   ═══════════════════════════════════════════════════════════ */
var TYPE_ICON = {
  Reagent:    "🧪",
  Calibrator: "⚖️",
  QC:         "🔬",
  Solution:   "💧",
  Part:       "⚙️"
};

var TYPE_AR = {
  Reagent:    "كاشف",
  Calibrator: "معايرة",
  QC:         "ضبط جودة",
  Solution:   "محلول تشغيل",
  Part:       "قطعة / إلكترود"
};

/* ═══════════════════════════════════════════════════════════
   أعمار الكتات الافتراضية حسب نوع الاختبار (بالأيام)
   ═══════════════════════════════════════════════════════════ */
var DEFAULT_KIT_DAYS = {
  "GLU": 14, "HbA1c": 21, "UREA": 14, "CREA": 14, "UA": 21,
  "NH3": 30, "TP": 21, "ALB": 21, "ALT": 21, "AST": 21,
  "TBIL": 21, "DBIL": 30, "GGT": 21, "ALP": 21, "LIP": 21,
  "AMY": 21, "LDH": 21, "CK": 14, "CK-MB": 14,
  "CHOL": 14, "TG": 14, "HDL": 14, "LDL": 14,
  "Na": 30, "K": 30, "Cl": 30,
  "Ca": 21, "PHOS": 21, "Mg": 21, "Fe": 21, "UIBC": 21,
  "CRP": 14, "TSH": 21, "FT4": 21, "FT3": 21,
  "LH": 21, "FSH": 21, "Prolactin": 21,
  "Testosterone": 21, "Estradiol": 21, "Progesterone": 21,
  "Cortisol": 21, "DHEA-S": 30, "PTH": 30,
  "Insulin": 21, "C-peptide": 30,
  "Vitamin-B12": 21, "Vitamin-D": 21, "Folate": 30,
  "Ferritin": 21, "AFP": 21, "CA-125": 21,
  "CA-15-3": 21, "CA-19-9": 21, "CA-72-3": 21,
  "CEA": 21, "PSA": 21, "HCG-Beta": 14,
  "Troponin": 14, "Troponin-I": 14, "bHCG": 14,
  "HBsII": 21, "aHCV": 21, "CHIV": 21, "SYPH": 21
};

/* ═══════════════════════════════════════════════════════════
   ═══════════════ بيانات الأجهزة ═══════════════
   كل جهاز له مصفوفة أصناف، كل صنف فيه:
   id, name, type, qty, minQty, lot, expiry, openDate, kitDays, note, location
   ═══════════════════════════════════════════════════════════ */

var SUPPLY_DATA = {

  /* ─────────────────────────────────────────────
     Siemens Atellica Solution (CH + IM)
     ───────────────────────────────────────────── */
  atellica: [

    /* ══ ATELLICA CH — كواشف الاختبارات ══ */
    { id: "atellica_ch_0",  name: "Ammonia (AMM)",        type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "CH" },
    { id: "atellica_ch_1",  name: "Albumin (ALB)",         type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_2",  name: "Calcium (CA)",          type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_3",  name: "Cholesterol (CHOL_2)",  type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "CH" },
    { id: "atellica_ch_4",  name: "Creatinine (CREA_2)",   type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "CH" },
    { id: "atellica_ch_5",  name: "Glucose (GluH_3)",      type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "CH" },
    { id: "atellica_ch_6",  name: "Iron (Iron_2)",         type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_7",  name: "Magnesium (Mg)",        type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_8",  name: "Inorganic Phosphate (IP)", type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_9",  name: "Total Protein (TP_2)",  type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_10", name: "Triglycerides (Trig_2)", type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "CH" },
    { id: "atellica_ch_11", name: "Uric Acid (UA)",        type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_12", name: "Urea Nitrogen (UN_c)",  type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "CH" },
    { id: "atellica_ch_13", name: "Direct Bilirubin (DBil_2)", type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "CH" },
    { id: "atellica_ch_14", name: "Total Bilirubin (TBil_2)", type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_15", name: "Amylase (AMY_2)",       type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_16", name: "Lactate (Lac_3)",       type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH — نادر" },
    { id: "atellica_ch_17", name: "TIBC",                  type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_18", name: "Alkaline Phosphatase (ALP_2)", type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_19", name: "GGT_2",                 type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_20", name: "Lactate Dehydrogenase (LDH)", type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_21", name: "Lipase (LIP)",          type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_22", name: "ALT",                   type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_23", name: "AST",                   type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_24", name: "Creatine Kinase (CK_L)", type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "CH" },
    { id: "atellica_ch_25", name: "HDL Cholesterol (HDL)", type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "CH — يُخزن -15 إلى -25°C" },
    { id: "atellica_ch_26", name: "LDL Cholesterol (LDL)", type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "CH — يُخزن -15 إلى -25°C" },
    { id: "atellica_ch_27", name: "Electrolytes (Na, K, Cl)", type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "CH" },
    { id: "atellica_ch_28", name: "Hemoglobin A1C (A1C_E)", type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_29", name: "C-Reactive Protein (RCRP)", type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "CH" },
    { id: "atellica_ch_30", name: "Microalbumin (uALB)",   type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },
    { id: "atellica_ch_31", name: "Urine/CSF Protein (UCFP)", type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "CH" },

    /* ══ ATELLICA CH — معايرات ══ */
    { id: "atellica_ch_cal_0", name: "CHEM CAL",          type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة كيمياء عامة" },
    { id: "atellica_ch_cal_1", name: "BILI CAL",          type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة البيليروبين" },
    { id: "atellica_ch_cal_2", name: "SPCL CHEM CAL",     type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة كيمياء خاصة" },
    { id: "atellica_ch_cal_3", name: "ENZ 1 CAL",         type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة إنزيمات 1" },
    { id: "atellica_ch_cal_4", name: "ENZ 2 CAL",         type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة إنزيمات 2" },
    { id: "atellica_ch_cal_5", name: "ENZ 3 CAL",         type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة إنزيمات 3" },
    { id: "atellica_ch_cal_6", name: "CHDLC CAL",         type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة HDL" },
    { id: "atellica_ch_cal_7", name: "LDLC CAL",          type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة LDL" },
    { id: "atellica_ch_cal_8", name: "A1C_E CAL",         type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة HbA1c" },
    { id: "atellica_ch_cal_9", name: "RCRP CAL",          type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة CRP" },
    { id: "atellica_ch_cal_10", name: "uALB CAL",         type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة Microalbumin" },
    { id: "atellica_ch_cal_11", name: "UCFP CAL",         type: "Calibrator", qty: 0, minQty: 5, kitDays: 60, note: "معايرة Urine Protein" },

    /* ══ ATELLICA CH — QC ══ */
    { id: "atellica_ch_qc_0", name: "CHEM CAL QC",        type: "QC", qty: 0, minQty: 3, kitDays: 30, note: "QC كيمياء" },
    { id: "atellica_ch_qc_1", name: "CH QC",              type: "QC", qty: 0, minQty: 3, kitDays: 30, note: "QC كيمياء عامة Level 2 & 3" },
    { id: "atellica_ch_qc_2", name: "A1c QC",             type: "QC", qty: 0, minQty: 3, kitDays: 30, note: "QC HbA1c" },
    { id: "atellica_ch_qc_3", name: "RCRP QC",            type: "QC", qty: 0, minQty: 3, kitDays: 30, note: "QC CRP" },
    { id: "atellica_ch_qc_4", name: "Specific Protein QC", type: "QC", qty: 0, minQty: 3, kitDays: 30, note: "QC بروتينات" },
    { id: "atellica_ch_qc_5", name: "Urine QC",           type: "QC", qty: 0, minQty: 3, kitDays: 30, note: "QC بولي" },

    /* ══ ATELLICA IM — كواشف الاختبارات ══ */
    { id: "atellica_im_0",  name: "TSH3UL",               type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — الغدة الدرقية" },
    { id: "atellica_im_1",  name: "FT3",                  type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — الغدة الدرقية" },
    { id: "atellica_im_2",  name: "FT4",                  type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — الغدة الدرقية" },
    { id: "atellica_im_3",  name: "LH",                   type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — التكاثر" },
    { id: "atellica_im_4",  name: "FSH",                  type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — التكاثر" },
    { id: "atellica_im_5",  name: "Prolactin (PRL)",      type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM" },
    { id: "atellica_im_6",  name: "Human Chorionic Gonadotropin (THCG)", type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "IM" },
    { id: "atellica_im_7",  name: "Vitamin B12 (VB12)",   type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — فيتامينات" },
    { id: "atellica_im_8",  name: "Ferritin (FER)",       type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM" },
    { id: "atellica_im_9",  name: "Alpha-feto protein (AFP)", type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — أورام" },
    { id: "atellica_im_10", name: "CEA",                  type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — أورام" },
    { id: "atellica_im_11", name: "Progesterone (PRGE)",  type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM" },
    { id: "atellica_im_12", name: "Cortisol (CORP)",      type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM" },
    { id: "atellica_im_13", name: "PSA",                  type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — أورام" },
    { id: "atellica_im_14", name: "Free PSA (fPSA)",      type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — أورام" },
    { id: "atellica_im_15", name: "Estradiol (E2)",       type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM" },
    { id: "atellica_im_16", name: "Folate (Fol)",         type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "IM — فيتامينات" },
    { id: "atellica_im_17", name: "Testosterone (TSTII)", type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM" },
    { id: "atellica_im_18", name: "Parathyroid Hormone (PTH)", type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "IM — نادر" },
    { id: "atellica_im_19", name: "Vitamin D (VITD)",     type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — فيتامينات" },
    { id: "atellica_im_20", name: "Creatine kinase MB (CKMB)", type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "IM — قلبي" },
    { id: "atellica_im_21", name: "NT-proBNP (PBNP)",     type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — قلبي" },
    { id: "atellica_im_22", name: "High-Sensitivity Troponin I (TNI)", type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "IM — قلبي" },
    { id: "atellica_im_23", name: "Anti-Thyroglobulin II (aTgII)", type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — نادر" },
    { id: "atellica_im_24", name: "Procalcitonin (PCT)",  type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — نادر" },
    { id: "atellica_im_25", name: "Hepatitis B surface Antigen II (HBsII)", type: "Reagent", qty: 0, minQty: 3, kitDays: 21, note: "IM — فيروسات" },
    { id: "atellica_im_26", name: "Hepatitis C (aHCV)",   type: "Reagent", qty: 0, minQty: 3, kitDays: 21, note: "IM — فيروسات" },
    { id: "atellica_im_27", name: "HIV Ag/Ab Combo (CHIV)", type: "Reagent", qty: 0, minQty: 3, kitDays: 21, note: "IM — فيروسات" },
    { id: "atellica_im_28", name: "Syphilis (SYPH)",      type: "Reagent", qty: 0, minQty: 3, kitDays: 21, note: "IM — فيروسات" },
    { id: "atellica_im_29", name: "Anti-Hepatitis B surface Antigen 2 (aHBs2)", type: "Reagent", qty: 0, minQty: 3, kitDays: 21, note: "IM — فيروسات" },
    { id: "atellica_im_30", name: "C-peptide (Cps)",      type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "IM — نادر" },
    { id: "atellica_im_31", name: "Insulin (IRI)",        type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — نادر" },
    { id: "atellica_im_32", name: "CA19-9",               type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — أورام" },
    { id: "atellica_im_33", name: "CA15-3",               type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — أورام" },
    { id: "atellica_im_34", name: "CA125",                type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — أورام" },
    { id: "atellica_im_35", name: "Her-2/neu (H2n)",      type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "IM — أورام نادر" },

    /* ══ ATELLICA IM — معايرات ══ */
    { id: "atellica_im_cal_0",  name: "TSH CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — داخل الكيت عادة" },
    { id: "atellica_im_cal_1",  name: "FT3 CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_2",  name: "FT4 CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_3",  name: "LH CAL",           type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — CALB مشترك" },
    { id: "atellica_im_cal_4",  name: "FSH CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — CALB مشترك" },
    { id: "atellica_im_cal_5",  name: "PRL CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_6",  name: "THCG CAL",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_7",  name: "VB12 CAL",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_8",  name: "FER CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_9",  name: "AFP CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_10", name: "CEA CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_11", name: "PRGE CAL",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_12", name: "CORP CAL",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_13", name: "PSA CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_14", name: "fPSA CAL",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_15", name: "E2 CAL",           type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_16", name: "FOL CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_17", name: "TSTII CAL",        type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_18", name: "PTH CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_19", name: "VITD CAL",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_20", name: "CKMB CAL",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_21", name: "PBNP CAL",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_22", name: "TNI CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_23", name: "aTgII CAL",        type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — نادر" },
    { id: "atellica_im_cal_24", name: "PCT CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — نادر" },
    { id: "atellica_im_cal_25", name: "HBsII CAL",        type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — فيروسات" },
    { id: "atellica_im_cal_26", name: "aHCV CAL",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — فيروسات" },
    { id: "atellica_im_cal_27", name: "CHIV CAL",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — فيروسات" },
    { id: "atellica_im_cal_28", name: "SYPH CAL",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — فيروسات" },
    { id: "atellica_im_cal_29", name: "aHBs2 CAL",        type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — فيروسات" },
    { id: "atellica_im_cal_30", name: "Cps CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — نادر" },
    { id: "atellica_im_cal_31", name: "IRI CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — نادر" },
    { id: "atellica_im_cal_32", name: "CA19-9 CAL",       type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_33", name: "CA15-3 CAL",       type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_34", name: "CA125 CAL",        type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_35", name: "H2n CAL",          type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — نادر" },
    { id: "atellica_im_cal_36", name: "Multi-Dil 1",      type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM — مخفف مشترك" },
    { id: "atellica_im_cal_37", name: "Multi-Dil 2",      type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_38", name: "Multi-Dil 3",      type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_39", name: "Multi-Dil 10",     type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_40", name: "Multi-Dil 11",     type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_41", name: "Multi-Dil 13",     type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },
    { id: "atellica_im_cal_42", name: "Multi-Dil 15",     type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "IM" },

    /* ══ ATELLICA IM — QC ══ */
    { id: "atellica_im_qc_0", name: "PTH QC",             type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_qc_1", name: "VITD QC",            type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_qc_2", name: "PCT QC",             type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_qc_3", name: "CRD QC",             type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM — قلبي" },
    { id: "atellica_im_qc_4", name: "HBsII QC",           type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM — فيروسات" },
    { id: "atellica_im_qc_5", name: "aHCV QC",            type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM — فيروسات" },
    { id: "atellica_im_qc_6", name: "CHIV QC",            type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM — فيروسات" },
    { id: "atellica_im_qc_7", name: "SYPH QC",            type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM — فيروسات" },
    { id: "atellica_im_qc_8", name: "aHBs2 QC",           type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM — فيروسات" },
    { id: "atellica_im_qc_9", name: "ATGII QC",           type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM — نادر" },
    { id: "atellica_im_qc_10", name: "IA Premium 1",      type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM — QC عام" },
    { id: "atellica_im_qc_11", name: "IA Premium 3",      type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM — QC عام" },
    { id: "atellica_im_qc_12", name: "TMR QC",            type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "IM" },

    /* ══ ATELLICA — مواد مساعدة IM ══ */
    { id: "atellica_im_aux_0", name: "APW1",              type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "IM — محلول غسيل" },
    { id: "atellica_im_aux_1", name: "APW3",              type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "IM — محلول غسيل" },
    { id: "atellica_im_aux_2", name: "PW3",               type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "IM — محلول غسيل" },
    { id: "atellica_im_aux_3", name: "VB12 Dil",          type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM — مخفف B12" },
    { id: "atellica_im_aux_4", name: "VB12 DTT/REL",      type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_5", name: "T3/T4/VB12 ANC",    type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_6", name: "THCG Dil",          type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_7", name: "CEA Dil",           type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_8", name: "E2 Dil",            type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_9", name: "FPSA CAL/Dil",      type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_10", name: "Fol DTT/REL",      type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_11", name: "Fol DIL",          type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_12", name: "Folserum",         type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_13", name: "RBC Fol",          type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_14", name: "19-9 DIL",         type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_15", name: "VITD Dil",         type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_16", name: "CKMB Dil",         type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },
    { id: "atellica_im_aux_17", name: "IRI DILI",         type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "IM" },

    /* ══ ATELLICA — قطع وقطع غيار ══ */
    { id: "atellica_part_0", name: "Tips",                type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "أطراف" },
    { id: "atellica_part_1", name: "Cups",                type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "أنابيب" },
    { id: "atellica_part_2", name: "Cell Wash Reaction",  type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "غسيل خلايا" },
    { id: "atellica_part_3", name: "Lamp",                type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "لمبة" },
    { id: "atellica_part_4", name: "Sensor",              type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "حساس" },
    { id: "atellica_part_5", name: "Standard A",          type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "محلول قياسي A" },
    { id: "atellica_part_6", name: "Standard B",          type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "محلول قياسي B" },
    { id: "atellica_part_7", name: "Standard F",          type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "محلول قياسي F" },
    { id: "atellica_part_8", name: "Salt",                type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "محلول ملحي" },
    { id: "atellica_part_9", name: "Diluent",             type: "Solution", qty: 0, minQty: 2, kitDays: 30, note: "مخفف" }
  ],

  /* ─────────────────────────────────────────────
     Cobas Pure (C303 + e402)
     ───────────────────────────────────────────── */
  cobas_pure: [
    /* ══ C303 — كواشف كيمياء ══ */
    { id: "pure_c303_0",  name: "GLU",     type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "C303" },
    { id: "pure_c303_1",  name: "UREA",    type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "C303" },
    { id: "pure_c303_2",  name: "CREA",    type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "C303" },
    { id: "pure_c303_3",  name: "UA",      type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_4",  name: "TP",      type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_5",  name: "ALB",     type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_6",  name: "ALT",     type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_7",  name: "AST",     type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_8",  name: "TBIL",    type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_9",  name: "DBIL",    type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "C303" },
    { id: "pure_c303_10", name: "GGT",     type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_11", name: "ALP",     type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_12", name: "LIP",     type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_13", name: "AMY",     type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_14", name: "LDH",     type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_15", name: "CK",      type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "C303" },
    { id: "pure_c303_16", name: "CK-MB",   type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "C303" },
    { id: "pure_c303_17", name: "CHOL",    type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "C303" },
    { id: "pure_c303_18", name: "TG",      type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "C303" },
    { id: "pure_c303_19", name: "HDL",     type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "C303" },
    { id: "pure_c303_20", name: "LDL",     type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "C303" },
    { id: "pure_c303_21", name: "Ca",      type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_22", name: "PHOS",    type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_23", name: "Mg",      type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_24", name: "Fe-Iron", type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_25", name: "UIBC",    type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_26", name: "NH3",     type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "C303 — نادر" },
    { id: "pure_c303_27", name: "CRP",     type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "C303" },
    { id: "pure_c303_28", name: "HbA1c",   type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "C303" },
    { id: "pure_c303_29", name: "ALBU2",   type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "C303 — Microalbumin" },
    { id: "pure_c303_30", name: "TPU3",    type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "C303 — Urine Protein" },

    /* ══ e402 — كواشف هرمونات ══ */
    { id: "pure_e402_0",  name: "TSH",                    type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_1",  name: "FT4",                    type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_2",  name: "FT3",                    type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_3",  name: "HCG-Beta",               type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "e402" },
    { id: "pure_e402_4",  name: "Prolactin",              type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_5",  name: "LH",                     type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_6",  name: "FSH",                    type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_7",  name: "Testosterone (Total)",   type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_8",  name: "Estradiol (E2)",         type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_9",  name: "Progesterone",           type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_10", name: "Cortisol (AM)",          type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_11", name: "DHEA-S",                 type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "e402" },
    { id: "pure_e402_12", name: "PTH",                    type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "e402 — نادر" },
    { id: "pure_e402_13", name: "Insulin (Fasting)",      type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402 — نادر" },
    { id: "pure_e402_14", name: "C-peptide",              type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "e402 — نادر" },
    { id: "pure_e402_15", name: "PSA (Total)",            type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_16", name: "Vitamin B12",            type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_17", name: "Vitamin D Total",        type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_18", name: "Folate",                 type: "Reagent", qty: 0, minQty: 5, kitDays: 30, note: "e402" },
    { id: "pure_e402_19", name: "Ferritin",               type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_20", name: "AFP",                    type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_21", name: "CA-125",                 type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_22", name: "CA 15-3",                type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_23", name: "CA 19-9",                type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_24", name: "CA 72-3",                type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402 — نادر" },
    { id: "pure_e402_25", name: "CEA",                    type: "Reagent", qty: 0, minQty: 5, kitDays: 21, note: "e402" },
    { id: "pure_e402_26", name: "TnI",                    type: "Reagent", qty: 0, minQty: 5, kitDays: 14, note: "e402 — قلبي" },

    /* ══ C303 — معايرات (مشتركة مع c311) ══ */
    { id: "pure_c303_cal_0",  name: "CFAS",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "C303" },
    { id: "pure_c303_cal_1",  name: "MB Cal",       type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "C303" },
    { id: "pure_c303_cal_2",  name: "Protein Cal",  type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "C303" },
    { id: "pure_c303_cal_3",  name: "Fe Cal",       type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "C303" },
    { id: "pure_c303_cal_4",  name: "Lipid Cal",    type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "C303" },
    { id: "pure_c303_cal_5",  name: "A1c Cal",      type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "C303" },
    { id: "pure_c303_cal_6",  name: "PUC Cal",      type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "C303 — Urine" },
    { id: "pure_c303_cal_7",  name: "AMM Cal",      type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "C303" },
    { id: "pure_c303_cal_8",  name: "ISE Low Cal",  type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "C303 — إلكتروليتات" },
    { id: "pure_c303_cal_9",  name: "ISE High Cal", type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "C303 — إلكتروليتات" },
    { id: "pure_c303_cal_10", name: "Fe Standard",  type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "C303" },

    /* ══ e402 — معايرات (مشتركة مع e411) ══ */
    { id: "pure_e402_cal_0",  name: "TSH Cal",            type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_1",  name: "FT4 Cal",            type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_2",  name: "FT3 Cal",            type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_3",  name: "HCG Cal",            type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_4",  name: "Prolactin Cal",      type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_5",  name: "LH Cal",             type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_6",  name: "FSH Cal",            type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_7",  name: "Testosterone Cal",   type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_8",  name: "E2 Cal",             type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_9",  name: "Progesterone Cal",   type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_10", name: "Cortisol Cal",       type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_11", name: "DHEA-S Cal",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_12", name: "PTH Cal",            type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_13", name: "Insulin Cal",        type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_14", name: "C-peptide Cal",      type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_15", name: "PSA Cal",            type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_16", name: "VB12 Cal",           type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_17", name: "VitD Cal",           type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_18", name: "Folate Cal",         type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_19", name: "Ferritin Cal",       type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_20", name: "AFP Cal",            type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_21", name: "Tumor Marker Cal",   type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402 — أورام" },
    { id: "pure_e402_cal_22", name: "CEA Cal",            type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402" },
    { id: "pure_e402_cal_23", name: "TnI Cal",            type: "Calibrator", qty: 0, minQty: 3, kitDays: 60, note: "e402 — قلبي" },

    /* ══ C303 — QC (مشترك مع c311) ══ */
    { id: "pure_c303_qc_0", name: "PreciControl TM L1",   type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "C303" },
    { id: "pure_c303_qc_1", name: "PreciControl MM",      type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "C303" },
    { id: "pure_c303_qc_2", name: "PreciControl Vit-D",   type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "C303" },
    { id: "pure_c303_qc_3", name: "PCC1",                 type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "C303" },
    { id: "pure_c303_qc_4", name: "PCC2",                 type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "C303" },
    { id: "pure_c303_qc_5", name: "Control V",            type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "C303" },
    { id: "pure_c303_qc_6", name: "Control U",            type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "C303" },
    { id: "pure_c303_qc_7", name: "Control MM",           type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "C303" },

    /* ══ e402 — QC (مشترك مع e411) ══ */
    { id: "pure_e402_qc_0", name: "PreciControl TM L1 (e402)", type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "e402" },
    { id: "pure_e402_qc_1", name: "PreciControl MM (e402)",    type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "e402" },
    { id: "pure_e402_qc_2", name: "PreciControl Vit-D (e402)", type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "e402" },
    { id: "pure_e402_qc_3", name: "Control V (e402)",          type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "e402" },
    { id: "pure_e402_qc_4", name: "Control U (e402)",          type: "QC", qty: 0, minQty: 2, kitDays: 30, note: "e402" },

    /* ══ C303 — محاليل تشغيل ══ */
    { id: "pure_sol_0",  name: "ProCell 2M",          type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "C303" },
    { id: "pure_sol_1",  name: "PreClean 2M",         type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "C303" },
    { id: "pure_sol_2",  name: "CleanCell M",         type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "C303" },
    { id: "pure_sol_3",  name: "ISE Inter Standard",  type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "C303 — إلكتروليتات" },
    { id: "pure_sol_4",  name: "ISE Diluent G2",      type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "C303 — إلكتروليتات" },
    { id: "pure_sol_5",  name: "ISE REF Electrolyte", type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "C303 — إلكتروليتات" },
    { id: "pure_sol_6",  name: "Basic Wash",          type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "C303" },
    { id: "pure_sol_7",  name: "Acid Wash",           type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "C303" },
    { id: "pure_sol_8",  name: "ECO-D",               type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "C303" },
    { id: "pure_sol_9",  name: "NAOHD",               type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "C303" },
    { id: "pure_sol_10", name: "SMS",                 type: "Solution", qty: 0, minQty: 3, kitDays: 30, note: "C303" },

    /* ══ قطع غيار C303 ══ */
    { id: "pure_part_0", name: "Na Electrode",         type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "C303 — إلكترود" },
    { id: "pure_part_1", name: "K Electrode",          type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "C303 — إلكترود" },
    { id: "pure_part_2", name: "Cl Electrode",         type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "C303 — إلكترود" },
    { id: "pure_part_3", name: "REF Electrode",        type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "C303 — إلكترود" },
    { id: "pure_part_4", name: "Tips",                 type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "C303" },
    { id: "pure_part_5", name: "Cups",                 type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "C303" },
    { id: "pure_part_6", name: "Reaction Cell C303",   type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "C303 — كوفيت" },
    { id: "pure_part_7", name: "Lamp",                 type: "Part", qty: 0, minQty: 1, kitDays: 90, note: "C303 — لمبة" }
  ]

};
