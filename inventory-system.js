/* ═══════════════════════════════════════════════════════════
   نظام جرد المختبر — inventory-system.js
   منطق التطبيق: الجرد + الإدارة + التقارير
   ═══════════════════════════════════════════════════════════ */

/* ─── حالة النظام ─── */
var SYSTEM_DATA = {
  employees: [],
  employee_devices: {},
  inventories: []
};

var currentEdit = {
  deviceId: null,
  supplyIdx: null,
  employeeId: null
};

/* ═══════════════════════════════════════════════════════════
   1) التهيئة الأولية
   ═══════════════════════════════════════════════════════════ */
function initInventorySystem() {
  loadSystemData();
  populateEmployeeSelect();
  populateAdminUI();
  console.log("✅ تم تهيئة النظام");
  console.log("👥 عدد الموظفين:", SYSTEM_DATA.employees.length);
  console.log("🔬 عدد الأجهزة:", Object.keys(SUPPLY_DATA).length);
}

/* ═══════════════════════════════════════════════════════════
   2) إدارة البيانات (localStorage)
   ═══════════════════════════════════════════════════════════ */
function loadSystemData() {
  /* استعادة الموظفين والأجهزة */
  var savedSystem = localStorage.getItem(APP_CONFIG.storageKey);
  if (savedSystem) {
    try {
      var parsed = JSON.parse(savedSystem);
      if (parsed.employees && parsed.employees.length > 0) {
        SYSTEM_DATA = parsed;
      }
    } catch (e) {
      console.error("خطأ في تحميل البيانات:", e);
    }
  }

  /* تهيئة أولية إن كانت فارغة */
  if (SYSTEM_DATA.employees.length === 0) {
    SYSTEM_DATA.employees = EMPLOYEES_LIST.map(function (name, idx) {
      return { id: "emp_" + idx, name: name };
    });

    var allDevices = Object.keys(SUPPLY_DATA);
    SYSTEM_DATA.employees.forEach(function (emp) {
      SYSTEM_DATA.employee_devices[emp.id] = allDevices.slice();
    });
  }

  /* استعادة المخزون */
  var savedSupplies = localStorage.getItem(APP_CONFIG.storageKey + "_supplies");
  if (savedSupplies) {
    try {
      var suppliesObj = JSON.parse(savedSupplies);
      Object.keys(suppliesObj).forEach(function (devId) {
        if (SUPPLY_DATA[devId]) {
          SUPPLY_DATA[devId].supplies = suppliesObj[devId];
        }
      });
    } catch (e) {
      console.error("خطأ في تحميل المخزون:", document e);
    }
  }
}

function saveSystemData.getElementById() {
  try {
    localStorage.setItem(APP_CONFIG(".storageKey, JSON.stringify(SYSTEM_DATA));
item  } catch (e) {
    console.error("خطأExp في الحفظ:", e);
  }
}

function saveirySupplies() {
  try {
    var obj = {};
    Object.keys(SUPPLY_DATA).forEach(function (devId) {
      obj[devId] = SUPPLY_DATA[devId].supplies;
    });
    localStorage.setItem(APP_CONFIG.storageKey + "_supplies", JSON.stringify(obj));
  } catch (e) {
    console.error("خطأ في حفظ المخزون:", e);
  }
}

/* ═══════════════════════════════════════════════════════════
   3) التنقل بين الصفحات
   ═══════════════════════════════════════════════════════════ */
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(function (p) {
    p.classList.remove("active");
  });
  var page = document.getElementById("page-" + pageId);
  if (page) {
    page.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function goHome() {
  showPage("inventory");
}

function goAdmin() {
  showPage("admin");
  populateAdminUI();
}

function refreshAll() {
  loadSystemData();
  populateEmployeeSelect();
  populateAdminUI();
  showToast("✓ تم التحديث", "success");
}

/* ═══════════════════════════════════════════════════════════
   4) واجهة الموظف — الاختيارات
   ═══════════════════════════════════════════════════════════ */
function populateEmployeeSelect() {
  var select = document.getElementById("employeeSelect");
  if (!select) return;

  select.innerHTML = '<option value="">— اختر اسمك من القائمة —</option>';
  SYSTEM_DATA.employees.forEach(function (emp) {
    var opt = document.createElement("option");
    opt.value = emp.id;
    opt.textContent = emp.name;
    select.appendChild(opt);
  });
}

function onEmployeeChange() {
  var empId = document.getElementById("employeeSelect").value;
  var deviceSelect = document.getElementById("deviceSelect");
  var content = document.getElementById("inventoryContent");

  /* تفريغ المحتوى */
  content.innerHTML = "";
  deviceSelect.innerHTML = '<option value="">— اختر الجهاز —</option>';
  deviceSelect.disabled = true;

  if (!empId) return;

  var deviceIds = SYSTEM_DATA.employee_devices[empId] || [];
  if (deviceIds.length === 0) {
    showToast("⚠️ لا توجد أجهزة مخصصة لك. راجع الإدارة", "warning");
    return;
  }

  deviceIds.forEach(function (devId) {
    if (!SUPPLY_DATA[devId]) return;
    var opt = document.createElement("option");
    opt.value = devId;
    opt.textContent = SUPPLY_DATA[devId].name;
    deviceSelect.appendChild(opt);
  });

  deviceSelect.disabled = false;
}

function onDeviceChange() {
  var empId = document.getElementById("employeeSelect").value;
  var deviceId = document.getElementById("deviceSelect").value;

  if (!empId || !deviceId) {
    document.getElementById("inventoryContent").innerHTML = "";
    return;
  }

  renderInventoryForm(empId, deviceId);
}

/* ═══════════════════════════════════════════════════════════
   5) رسم جدول الجرد
   ═══════════════════════════════════════════════════════════ */
function renderInventoryForm(empId, deviceId) {
  var employee = SYSTEM_DATA.employees.find(function (e) { return e.id === empId; });
  var device = SUPPLY_DATA[deviceId];
  var container = document.getElementById("inventoryContent");

  if (!employee || !device) return;

  /* تجميع المحاليل حسب النوع */
  var grouped = groupByType(device.supplies);

  var html = '<div class="card inventory-card">';

  /* رأس البطاقة */
  html += '<div class="inventory-header">';
  html += '<div class="inventory-header-icon">' + getDeviceIcon(device.id) + '</div>';
  html += '<div class="inventory-header-info">';
  html += '<h3 class="inventory-device-name">' + device.name + '</h3>';
  html += '<p class="inventory-meta">👤 ' + employee.name + ' · 📅 ' + formatDateArabic(new Date()) + '</p>';
  html += '</div>';
  html += '</div>';

  /* ملخص سريع */
  var summary = getSummary(device.supplies);
  html += '<div class="inventory-summary">';
  html += '<div class="summary-item summary-ok"><span class="summary-num">' + summary.ok + '</span><span class="summary-lbl">جاهز</span></div>';
  html += '<div class="summary-item summary-warn"><span class="summary-num">' + summary.warn + '</span><span class="summary-lbl">تحذير</span></div>';
  html += '<div class="summary-item summary-danger"><span class="summary-num">' + summary.danger + '</span><span class="summary-lbl">نافد</span></div>';
  html += '</div>';

  /* المحاليل حسب النوع */
  Object.keys(SUPPLY_TYPES).forEach(function (type) {
    if (!grouped[type] || grouped[type].length === 0) return;
    var typeInfo = SUPPLY_TYPES[type];

    html += '<div class="supply-section">';
    html += '<div class="supply-section-header" style="border-right-color:' + typeInfo.color + '">';
    html += '<span class="supply-section-icon">' + typeInfo.icon + '</span>';
    html += '<span class="supply-section-title">' + typeInfo.label + '</span>';
    html += '<span class="supply-section-count">' + grouped[type].length + '</span>';
    html += '</div>';
    html += '<div class="supply-list">';

    grouped[type].forEach(function (item) {
      var idx = device.supplies.indexOf(item);
      var status = getSupplyStatus(item);
      html += '<div class="supply-item supply-' + status.class + '" onclick="openEdit(\'' + deviceId + '\',' + idx + ',\'' + empId + '\')">';
      html += '<div class="supply-item-main">';
      html += '<div class="supply-item-name">' + item.name + '</div>';
      html += '<div class="supply-item-meta">';
      html += '<span class="supply-item-qty">📦 ' + (item.qty || 0) + '</span>';
      if (item.expiry) {
        html += '<span class="supply-item-expiry">📅 ' + item.expiry + '</span>';
      }
      html += '</div>';
      html += '</div>';
      html += '<div class="supply-item-status status-badge-' + status.class + '">' + status.icon + '</div>';
      html += '</div>';
    });

    html += '</div>';
    html += '</div>';
  });

  /* أزرار التقارير */
  html += '<div class="report-actions">';
  html += '<button class="btn-report btn-print" onclick="printInventory(\'' + empId + '\',\'' + deviceId + '\')">🖨️ طباعة A4</button>';
  html += '<button class="btn-report btn-whatsapp" onclick="copyToWhatsApp(\'' + empId + '\',\'' + deviceId + '\')">💬 نسخ واتس</button>';
  html += '</div>';

  html += '</div>';

  container.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════════
   6) حالة المحلول
   ═══════════════════════════════════════════════════════════ */
function getSupplyStatus(supply) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var qty = Number(supply.qty) || 0;
  var minQty = Number(supply.minQty) || 0;

  /* نافد */
  if (qty === 0) {
    return { class: "danger", icon: "❌", label: "نافد" };
  }

  /* منتهي الصلاحية */
  if (supply.expiry) {
    var exp = new Date(supply.expiry);
    exp.setHours(0, 0, 0, 0);
    var daysLeft = Math.floor((exp - today) / 86400000);
    if (daysLeft < 0) {
      return { class: "danger", icon: "❌", label: "منتهي" };
    }
    if (daysLeft <= APP_CONFIG.warnDaysExpirySoon) {
      return { class: "warn", icon: "⚠️", label: "قارب " + daysLeft + "ي" };
    }
    if (daysLeft <= APP_CONFIG.warnDaysExpiry) {
      return { class: "warn", icon: "⚠️", label: "باقي " + daysLeft + "ي" };
    }
  }

  /* مخزون منخفض */
  if (qty < minQty) {
    return { class: "warn", icon: "⚠️", label: "منخفض" };
  }

  return { class: "ok", icon: "✅", label: "جاهز" };
}

function getSummary(supplies) {
  var ok = 0, warn = 0, danger = 0;
  supplies.forEach(function (s) {
    var st = getSupplyStatus(s);
    if (st.class === "ok") ok++;
    else if (st.class === "warn") warn++;
    else danger++;
  });
  return { ok: ok, warn: warn, danger: danger, total: supplies.length };
}

function groupByType(supplies) {
  var grouped = {};
  supplies.forEach(function (s) {
    if (!grouped[s.type]) grouped[s.type] = [];
    grouped[s.type].push(s);
  });
  return grouped;
}

function getDeviceIcon(deviceId) {
  var icons = {
    siemens_atellica: "🔬",
    cobas_pure: "🧬",
    cobas_c311: "🧪",
    cobas_e411: "⚗️",
    dimension_exl200: "🔭",
    mini_vidas: "🩺",
    variant_ii: "🩸"
  };
  return icons[deviceId] || "🔬";
}

/* ═══════════════════════════════════════════════════════════
   7) نافذة التعديل
   ═══════════════════════════════════════════════════════════ */
function openEdit(deviceId, supplyIdx, empId) {
  var device = SUPPLY_DATA[deviceId];
  if (!device) return;
  var supply = device.supplies[supplyIdx];
  if (!supply) return;

  currentEdit = {
    deviceId: deviceId,
    supplyIdx: supplyIdx,
    employeeId: empId
  };

  document.getElementById("modalTitle").textContent = "تعديل: " + supply.name;
  document.getElementById("itemName").value = supply.name;
  document.getElementById("itemQty").value = supply.qty || "";
  document.getElementById("itemMinQty").value = supply.minQty || 5;
  document.getElementById("itemLot").value = supply.lot || "";
 ").value = supply.expiry || "";
  document.getElementById("itemOpenDate").value = supply.openDate || "";
  document.getElementById("itemKitDays").value = supply.kitDays || "";
  document.getElementById("itemLocation").value = supply.location || "";
  document.getElementById("itemNote").value = supply.note || "";

  document.getElementById("modalOverlay").classList.add("active");

  /* تركيز تلقائي على حقل الكمية */
  setTimeout(function () {
    var qtyInput = document.getElementById("itemQty");
    if (qtyInput) qtyInput.focus();
  }, 300);
}

function saveItem() {
  if (currentEdit.deviceId === null) return;

  var device = SUPPLY_DATA[currentEdit.deviceId];
  var supply = device.supplies[currentEdit.supplyIdx];

  supply.qty = parseInt(document.getElementById("itemQty").value) || 0;
  supply.minQty = parseInt(document.getElementById("itemMinQty").value) || 5;
