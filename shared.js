/* ═══════════════════════════════════════════════════════════
   Lab Manager Pro v2 — shared.js
   الدوال المشتركة: الحفظ، التحميل، حالات الأصناف، الجاهزية
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   1) الحفظ والتحميل من localStorage
   ═══════════════════════════════════════════════════════════ */
var STORAGE_KEY = "labMgr_v2";

function saveAll() {
  try {
    var data = {
      sd: SUPPLY_DATA,
      ts: TEST_STATUS,
      st: SETTINGS,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("خطأ في الحفظ:", e);
    return false;
  }
}

function loadAll() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    var data = JSON.parse(raw);
    if (data && data.sd) {
      // استبدال بيانات الأصناف بالبيانات المحفوظة
      for (var dev in data.sd) {
        if (SUPPLY_DATA[dev]) {
          SUPPLY_DATA[dev] = data.sd[dev];
        }
      }
    }
    if (data && data.ts) {
      for (var d in data.ts) {
        TEST_STATUS[d] = data.ts[d];
      }
    }
    if (data && data.st) {
      for (var k in data.st) {
        SETTINGS[k] = data.st[k];
      }
    }
    return true;
  } catch (e) {
    console.error("خطأ في التحميل:", e);
    return false;
  }
}

function clearStorage() {
  if (confirm("سيتم حذف كل البيانات المحفوظة والعودة للبيانات الأساسية. متأكد؟")) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

/* ═══════════════════════════════════════════════════════════
   2) الإعدادات العامة
   ═══════════════════════════════════════════════════════════ */
var SETTINGS = {
  currentSampleType: "all",
  currentDevice: "atellica",
  currentAuditDevice: "atellica"
};

/* ═══════════════════════════════════════════════════════════
   3) حالة الاختبارات (Available / Unavailable)
   ═══════════════════════════════════════════════════════════ */
var TEST_STATUS = {};

/* ═══════════════════════════════════════════════════════════
   4) أدوات التواريخ
   ═══════════════════════════════════════════════════════════ */
function today() {
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDate(str) {
  if (!str) return null;
  var d = new Date(str);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(d1, d2) {
  return Math.floor((d2 - d1) / 86400000);
}

function daysLeft(dateStr) {
  var d = parseDate(dateStr);
  if (!d) return null;
  return daysBetween(today(), d);
}

function daysSince(dateStr) {
  var d = parseDate(dateStr);
  if (!d) return null;
  return daysBetween(d, today());
}

function formatDateArabic(date) {
  if (!date) return "";
  try {
    return date.toLocaleDateString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch (e) {
    return date.toLocaleDateString();
  }
}

function formatDateShort(dateStr) {
  if (!dateStr) return "—";
  var d = parseDate(dateStr);
  if (!d) return "—";
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "/" + m + "/" + day;
}

function expiryText(dateStr) {
  if (!dateStr) return "—";
  var d = daysLeft(dateStr);
  if (d === null) return "—";
  if (d < 0) return "منتهي منذ " + Math.abs(d) + " يوم";
  if (d === 0) return "ينتهي اليوم!";
  if (d === 1) return "ينتهي غدًا";
  if (d <= 30) return "باقي " + d + " يوم";
  if (d <= 90) return "باقي " + Math.floor(d / 7) + " أسبوع";
  return "باقي " + Math.floor(d / 30) + " شهر";
}

/* ═══════════════════════════════════════════════════════════
   5) حساب حالة الصنف
   ═══════════════════════════════════════════════════════════ */
function getStatus(item) {
  var s = "ok";
  var reasons = [];

  // فحص المخزون
  if (Number(item.minQty) > 0 && Number(item.qty) <= Number(item.minQty)) {
    if (Number(item.qty) === 0) {
      s = "red";
      reasons.push("نفد المخزون");
    } else {
      s = "orange";
      reasons.push("مخزون منخفض (" + item.qty + ")");
    }
  }

  // فحص الصلاحية
  if (item.expiry) {
    var dl = daysLeft(item.expiry);
    if (dl !== null) {
      if (dl < 0) {
        s = "red";
        reasons.push("منتهي الصلاحية");
      } else if (dl <= 7) {
        if (s !== "red") s = "red";
        reasons.push("ينتهي بعد " + dl + " يوم");
      } else if (dl <= 30) {
        if (s !== "red") s = "yellow";
        reasons.push("صلاحية: " + dl + " يوم");
      }
    }
  }

  // فحص الكتة المفتوحة
  if (item.openDate && item.kitDays && Number(item.kitDays) > 0) {
    var opened = parseDate(item.openDate);
    if (opened) {
      var kitEnd = new Date(opened.getTime() + Number(item.kitDays) * 86400000);
      var kitLeft = daysBetween(today(), kitEnd);
      if (kitLeft < 0) {
        if (s !== "red") s = "red";
        reasons.push("الكتة نفدت");
      } else if (kitLeft <= 7) {
        if (s !== "red") s = "yellow";
        reasons.push("باقي " + kitLeft + " يوم للكتة");
      }
    }
  }

  return { status: s, reasons: reasons };
}

/* ═══════════════════════════════════════════════════════════
   6) حساب تقدم الكتة المفتوحة
   ═══════════════════════════════════════════════════════════ */
function getKitProgress(item) {
  if (!item.openDate || !item.kitDays || Number(item.kitDays) <= 0) return null;
  var opened = parseDate(item.openDate);
  if (!opened) return null;

  var total = Number(item.kitDays);
  var elapsed = daysBetween(opened, today());
  var remaining = total - elapsed;
  var pct = Math.max(0, Math.min(100, Math.round((remaining / total) * 100)));

  return {
    remaining: remaining,
    total: total,
    pct: pct,
    elapsed: elapsed
  };
}

/* ═══════════════════════════════════════════════════════════
   7) وصف حالة الصنف (نص / لون / أيقونة)
   ═══════════════════════════════════════════════════════════ */
function statusPill(status) {
  if (status === "red")    return '<span class="status-pill pill-red">❌ تنبيه</span>';
  if (status === "yellow") return '<span class="status-pill pill-yellow">⚠️ قارب</span>';
  if (status === "orange") return '<span class="status-pill pill-orange">🔶 منخفض</span>';
  return '<span class="status-pill pill-ok">✓ جيد</span>';
}

function statusIcon(status) {
  if (status === "red")    return "❌";
  if (status === "yellow") return "⚠️";
  if (status === "orange") return "🔶";
  return "✅";
}

/* ═══════════════════════════════════════════════════════════
   8) جلب أصناف جهاز معين مع مراعاة المشاركة
   ═══════════════════════════════════════════════════════════ */
function getDeviceItems(deviceId) {
  var items = SUPPLY_DATA[deviceId] || [];
  var result = items.slice();

  // إضافة الأصناف المشتركة من الأجهزة المرتبطة
  var dev = DEVICES[deviceId];
  if (dev && dev.sharedWith && dev.sharedTypes) {
    var sharedItems = getSharedItemsFrom(deviceId, dev.sharedWith, dev.sharedTypes);
    sharedItems.forEach(function (item) {
      var copy = Object.assign({}, item);
      copy._sharedFrom = dev.sharedWith;
      result.push(copy);
    });
  }

  return result;
}

function getSharedItemsFrom(deviceId, otherDeviceKey, sharedTypes) {
  // deviceId = "c311" أو "e411"
  // otherDeviceKey = "c303" أو "e402"
  // نبحث في الجهاز المدمج (cobas_pure) عن الأصناف التي تنتمي لهذا القسم
  var items = SUPPLY_DATA.cobas_pure || [];
  var prefix = otherDeviceKey === "c303" ? "p_c3c_" : "p_e4c_";
  var result = [];

  items.forEach(function (item) {
    if (item.id && item.id.indexOf(prefix) === 0) {
      if (sharedTypes.indexOf(item.type) !== -1) {
        result.push(item);
      }
    }
  });

  return result;
}

/* ═══════════════════════════════════════════════════════════
   9) استخراج الأصناف حسب النوع
   ═══════════════════════════════════════════════════════════ */
function groupItemsByType(items) {
  var groups = {
    Reagent: [],
    Calibrator: [],
    QC: [],
    Solution: [],
    Part: []
  };
  items.forEach(function (item) {
    if (groups[item.type]) {
      groups[item.type].push(item);
    } else {
      groups.Reagent.push(item);
    }
  });
  return groups;
}

/* ═══════════════════════════════════════════════════════════
   10) إحصائيات الجهاز
   ═══════════════════════════════════════════════════════════ */
function getDeviceStats(deviceId) {
  var items = getDeviceItems(deviceId);
  var total = items.length;
  var ok = 0, warn = 0, danger = 0, orange = 0;

  items.forEach(function (item) {
    var s = getStatus(item).status;
    if (s === "ok") ok++;
    else if (s === "yellow") warn++;
    else if (s === "orange") orange++;
    else if (s === "red") danger++;
  });

  var pct = total > 0 ? Math.round((ok / total) * 100) : 0;

  return {
    total: total,
    ok: ok,
    warn: warn,
    danger: danger,
    orange: orange,
    alerts: warn + danger + orange,
    pct: pct
  };
}

/* ═══════════════════════════════════════════════════════════
   11) جلب كل التنبيهات (من كل الأجهزة)
   ═══════════════════════════════════════════════════════════ */
function getAllAlerts() {
  var alerts = [];
  for (var dev in SUPPLY_DATA) {
    if (!DEVICES[dev] || !DEVICES[dev].isActive) continue;
    var items = SUPPLY_DATA[dev] || [];
    items.forEach(function (item) {
      var st = getStatus(item);
      if (st.status !== "ok") {
        alerts.push({
          device: dev,
          deviceName: DEVICES[dev].name,
          deviceShort: DEVICES[dev].short,
          item: item,
          status: st.status,
          reasons: st.reasons
        });
      }
    });
  }
  // ترتيب: أحمر ثم برتقالي ثم أصفر
  var order = { red: 0, orange: 1, yellow: 2 };
  alerts.sort(function (a, b) {
    return order[a.status] - order[b.status];
  });
  return alerts;
}

/* ═══════════════════════════════════════════════════════════
   12) فحص جاهزية اختبار معين على جهاز معين
   ═══════════════════════════════════════════════════════════
   اختبار جاهز = (كاشف موجود > 0) + (معايرة موجودة > 0) + (QC موجود > 0)
   نُرجع: { status: "ready" | "partial" | "down", missing: [...], reason: "" }
   ═══════════════════════════════════════════════════════════ */
function getTestReadiness(deviceId, testName) {
  var items = getDeviceItems(deviceId);
  var result = {
    status: "ready",
    missing: [],
    reason: ""
  };

  // 1) فحص الكاشف
  var reagent = findReagent(items, testName);
  if (!reagent) {
    result.status = "down";
    result.missing.push("كاشف");
    result.reason = "الكاشف غير موجود في القائمة";
    return result;
  }

  if (Number(reagent.qty) === 0) {
    result.status = "down";
    result.missing.push("كاشف (نفد)");
    result.reason = "كاشف " + testName + " نفد";
  }

  // 2) فحص المعايرة (اختياري — بعض الأجهزة المعايرة داخل الكيت)
  var calibrator = findCalibrator(items, testName);
  if (calibrator && Number(calibrator.qty) === 0) {
    if (result.status !== "down") result.status = "partial";
    result.missing.push("معايرة");
    if (!result.reason) result.reason = "ناقص محلول معايرة";
  }

  // 3) فحص QC
  var qc = findQC(items, testName);
  if (qc && Number(qc.qty) === 0) {
    if (result.status !== "down") result.status = "partial";
    result.missing.push("QC");
    if (!result.reason) result.reason = "ناقص محلول QC";
  }

  if (result.status === "ready" && result.missing.length === 0) {
    result.reason = "جاهز";
  }

  return result;
}

function findReagent(items, testName) {
  var name = testName.toUpperCase();
  for (var i = 0; i < items.length; i++) {
    if (items[i].type !== "Reagent") continue;
    var iname = (items[i].name || "").toUpperCase();
    if (iname === name || iname.indexOf(name) !== -1 || name.indexOf(iname) !== -1) {
      return items[i];
    }
  }
  return null;
}

function findCalibrator(items, testName) {
  var shortName = shortenTestName(testName);
  for (var i = 0; i < items.length; i++) {
    if (items[i].type !== "Calibrator") continue;
    var iname = (items[i].name || "").toUpperCase();
    if (iname.indexOf(shortName.toUpperCase()) !== -1) {
      return items[i];
    }
  }
  return null;
}

function findQC(items, testName) {
  var shortName = shortenTestName(testName);
  for (var i = 0; i < items.length; i++) {
    if (items[i].type !== "QC") continue;
    var iname = (items[i].name || "").toUpperCase();
    if (iname.indexOf(shortName.toUpperCase()) !== -1) {
      return items[i];
    }
  }
  return null;
}

function shortenTestName(name) {
  var map = {
    "Glucose": "GLU", "Urea Nitrogen": "UREA", "Creatinine": "CREA",
    "Uric Acid": "UA", "Sodium": "Na", "Potassium": "K", "Chloride": "Cl",
    "Calcium": "Ca", "Magnesium": "Mg", "Phosphate": "PHOS",
    "Total Protein": "TP", "Albumin": "ALB",
    "Alanine Aminotransferase": "ALT", "Aspartate Aminotransferase": "AST",
    "Alkaline Phosphatase": "ALP", "Total Bilirubin": "TBIL",
    "Direct Bilirubin": "DBIL", "Cholesterol": "CHOL",
    "Triglycerides": "TG", "Creatine Kinase": "CK",
    "Lactate Dehydrogenase": "LDH", "Amylase": "AMY", "Lipase": "LIP",
    "C-Reactive Protein": "CRP", "Iron": "Fe",
    "Thyroid stimulating hormone": "TSH", "Free Triiodothyronine": "FT3",
    "Free Thyroxine": "FT4", "Luteinizing Hormone": "LH",
    "Follicular stimulating hormone": "FSH", "Prolactin": "PRL",
    "Human chorionic gonadotropin": "HCG", "Vitamin B12": "VB12",
    "Vitamin D": "VITD", "Ferritin": "FER", "Alpha-feto protein": "AFP",
    "Progesterone": "PRGE", "Cortisol": "CORP", "Estradiol": "E2",
    "Testosterone": "TSTII", "Parathyroid hormone": "PTH",
    "Creatine kinase MB": "CKMB", "NT-proBNP": "PBNP",
    "High-Sensitivity Troponin I": "TNI", "Procalcitonin": "PCT",
    "Hepatitis B surface Antigen": "HBsII", "Hepatitis C": "aHCV",
    "HIV": "CHIV", "Syphilis": "SYPH", "C-peptide": "Cps",
    "Insulin": "IRI", "Microalbumin": "uALB",
    "Urine/Cerebrospinal Fluid Protein": "UCFP",
    "Hemoglobin A1C": "A1C"
  };

  for (var key in map) {
    if (name.indexOf(key) !== -1) return map[key];
  }
  return name;
}

/* ═══════════════════════════════════════════════════════════
   13) تحليل الاختبارات لكل جهاز
   ═══════════════════════════════════════════════════════════ */
function analyzeAllDevices() {
  var result = {};
  for (var devId in DEVICES) {
    if (!DEVICES[devId].isActive) continue;
    var tests = DEVICE_TEST_NAMES[devId] || [];
    result[devId] = {
      device: DEVICES[devId],
      tests: tests.map(function (t) {
        return {
          name: t,
          readiness: getTestReadiness(devId, t)
        };
      })
    };
  }
  return result;
}

/* ═══════════════════════════════════════════════════════════
   14) الوظائف المساعدة للعرض
   ═══════════════════════════════════════════════════════════ */
function showToast(message, type) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = "toast show" + (type ? " " + type : "");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(function () {
    toast.className = "toast";
  }, 2500);
}

function openModal() {
  var overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.classList.add("open");
}

function closeModalDirect() {
  var overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.classList.remove("open");
}

function closeModal(event) {
  var overlay = document.getElementById("modalOverlay");
  if (event && event.target === overlay) {
    closeModalDirect();
  }
}

/* ═══════════════════════════════════════════════════════════
   15) توليد ID فريد
   ═══════════════════════════════════════════════════════════ */
function generateId(prefix) {
  return prefix + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

/* ═══════════════════════════════════════════════════════════
   16) نسخ البيانات للتصدير
   ═══════════════════════════════════════════════════════════ */
function exportAllData() {
  return {
    version: "2.0",
    exportedAt: new Date().toISOString(),
    sd: SUPPLY_DATA,
    ts: TEST_STATUS,
    st: SETTINGS
  };
}

function downloadJSON(data, filename) {
  var json = JSON.stringify(data, null, 2);
  var blob = new Blob([json], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ═══════════════════════════════════════════════════════════
   17) النسخ للحافظة
   ═══════════════════════════════════════════════════════════ */
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      showToast("✓ تم النسخ", "success");
    }).catch(function () {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  var ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showToast("✓ تم النسخ", "success");
  } catch (e) {
    showToast("تعذر النسخ", "error");
  }
  document.body.removeChild(ta);
}

/* ═══════════════════════════════════════════════════════════
   18) التحقق من كون اختبار "أساسي / طوارئ / نادر"
   ═══════════════════════════════════════════════════════════ */
function getTestCategory(testName) {
  var name = testName.toUpperCase();

  for (var i = 0; i < EMERGENCY_TESTS.length; i++) {
    if (name.indexOf(EMERGENCY_TESTS[i].toUpperCase()) !== -1) {
      return "emergency";
    }
  }
  for (var j = 0; j < RARE_TESTS.length; j++) {
    if (name.indexOf(RARE_TESTS[j].toUpperCase()) !== -1) {
      return "rare";
    }
  }
  return "routine";
}

function getTestPriority(testName) {
  var cat = getTestCategory(testName);
  if (cat === "emergency") return 1;
  if (cat === "routine") return 2;
  return 3;
}

/* ═══════════════════════════════════════════════════════════
   19) تهيئة TEST_STATUS
   ═══════════════════════════════════════════════════════════ */
function initTestStatus() {
  for (var devId in DEVICES) {
    if (!TEST_STATUS[devId]) TEST_STATUS[devId] = {};
    var tests = DEVICE_TEST_NAMES[devId] || [];
    tests.forEach(function (t) {
      if (TEST_STATUS[devId][t] === undefined) {
        TEST_STATUS[devId][t] = "yes";
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   20) حاسبة الصلاحية السريعة
   ═══════════════════════════════════════════════════════════ */
function calcExpiryInfo(dateStr) {
  var d = daysLeft(dateStr);
  if (d === null) {
    return { valid: false, text: "لا يوجد تاريخ", color: "gray", days: null };
  }
  if (d < 0) {
    return { valid: false, text: "منتهي منذ " + Math.abs(d) + " يوم", color: "red", days: d };
  }
  if (d <= 7) {
    return { valid: true, text: "باقي " + d + " يوم", color: "red", days: d };
  }
  if (d <= 30) {
    return { valid: true, text: "باقي " + d + " يوم", color: "orange", days: d };
  }
  if (d <= 90) {
    return { valid: true, text: "باقي " + d + " يوم", color: "yellow", days: d };
  }
  return { valid: true, text: "باقي " + d + " يوم", color: "green", days: d };
}

/* ═══════════════════════════════════════════════════════════
   نهاية shared.js
   ═══════════════════════════════════════════════════════════ */
