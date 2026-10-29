/* ═══════════════════════════════════════════════════════════
   نظام جرد المختبر — inventory-system.js
   النسخة النهائية — الطباعة بالترويسة الرسمية
   ═══════════════════════════════════════════════════════════ */

var SYSTEM_DATA = {
  employees: [],
  employee_devices: {},
  custom_supplies: {}
};

var currentEdit = {
  deviceId: null,
  supplyIdx: null,
  employeeId: null,
  isCustom: false
};

/* ═══════════════════════════════════════════════════════════
   1) التهيئة
   ═══════════════════════════════════════════════════════════ */
function initInventorySystem() {
  loadSystemData();
  populateEmployeeSelect();
  populateAdminUI();
  console.log("✅ النظام جاهز");
}

/* ═══════════════════════════════════════════════════════════
   2) تحميل وحفظ البيانات
   ═══════════════════════════════════════════════════════════ */
function loadSystemData() {
  var savedSystem = localStorage.getItem(APP_CONFIG.storageKey);
  if (savedSystem) {
    try {
      var parsed = JSON.parse(savedSystem);
      if (parsed.employees && parsed.employees.length > 0) {
        SYSTEM_DATA.employees = parsed.employees;
        SYSTEM_DATA.employee_devices = parsed.employee_devices || {};
        SYSTEM_DATA.custom_supplies = parsed.custom_supplies || {};
      }
    } catch (e) {
      console.error("خطأ في تحميل النظام:", e);
    }
  }

  if (SYSTEM_DATA.employees.length === 0) {
    SYSTEM_DATA.employees = EMPLOYEES_LIST.map(function (name, idx) {
      return { id: "emp_" + idx, name: name };
    });
    var allDevices = Object.keys(SUPPLY_DATA);
    SYSTEM_DATA.employees.forEach(function (emp) {
      SYSTEM_DATA.employee_devices[emp.id] = allDevices.slice();
    });
  }

  var savedSupplies = localStorage.getItem(APP_CONFIG.storageKey + "_supplies");
  if (savedSupplies) {
    try {
      var suppliesObj = JSON.parse(savedSupplies);
      Object.keys(suppliesObj).forEach(function (devId) {
        if (SUPPLY_DATA[devId] && suppliesObj[devId]) {
          SUPPLY_DATA[devId].supplies = suppliesObj[devId];
        }
      });
    } catch (e) {
      console.error("خطأ في تحميل المخزون:", e);
    }
  }

  Object.keys(SYSTEM_DATA.custom_supplies).forEach(function (devId) {
    if (SUPPLY_DATA[devId]) {
      SYSTEM_DATA.custom_supplies[devId].forEach(function (item) {
        var exists = SUPPLY_DATA[devId].supplies.some(function (s) {
          return s.id === item.id;
        });
        if (!exists) {
          SUPPLY_DATA[devId].supplies.push(item);
        }
      });
    }
  });
}

function saveSystemData() {
  try {
    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(SYSTEM_DATA));
  } catch (e) { console.error(e); }
}

function saveSupplies() {
  try {
    var obj = {};
    Object.keys(SUPPLY_DATA).forEach(function (devId) {
      obj[devId] = JSON.parse(JSON.stringify(SUPPLY_DATA[devId].supplies));
    });
    localStorage.setItem(APP_CONFIG.storageKey + "_supplies", JSON.stringify(obj));
  } catch (e) { console.error(e); }
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

function goHome() { showPage("inventory"); }
function goAdmin() { showPage("admin"); populateAdminUI(); }

function refreshAll() {
  loadSystemData();
  populateEmployeeSelect();
  populateAdminUI();
  var empId = document.getElementById("employeeSelect").value;
  var deviceId = document.getElementById("deviceSelect").value;
  if (empId && deviceId) renderInventoryForm(empId, deviceId);
  showToast("✓ تم التحديث", "success");
}

/* ═══════════════════════════════════════════════════════════
   4) واجهة الموظف
   ═══════════════════════════════════════════════════════════ */
function populateEmployeeSelect() {
  var select = document.getElementById("employeeSelect");
  if (!select) return;
  var currentVal = select.value;
  select.innerHTML = '<option value="">— اختر اسمك من القائمة —</option>';
  SYSTEM_DATA.employees.forEach(function (emp) {
    var opt = document.createElement("option");
    opt.value = emp.id;
    opt.textContent = emp.name;
    select.appendChild(opt);
  });
  if (currentVal) select.value = currentVal;
}

function onEmployeeChange() {
  var empId = document.getElementById("employeeSelect").value;
  var deviceSelect = document.getElementById("deviceSelect");
  var content = document.getElementById("inventoryContent");

  content.innerHTML = "";
  deviceSelect.innerHTML = '<option value="">— اختر الجهاز —</option>';
  deviceSelect.disabled = true;

  if (!empId) return;

  var deviceIds = SYSTEM_DATA.employee_devices[empId] || [];
  if (deviceIds.length === 0) {
    showToast("⚠️ لا توجد أجهزة مخصصة لك", "warning");
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

  var grouped = groupByType(device.supplies);
  var summary = getSummary(device.supplies);

  var html = '<div class="card inventory-card">';

  html += '<div class="inventory-header">';
  html += '<div class="inventory-header-icon">' + (device.icon || "🔬") + '</div>';
  html += '<div class="inventory-header-info">';
  html += '<h3 class="inventory-device-name">' + device.name + '</h3>';
  html += '<p class="inventory-meta">👤 ' + employee.name + ' · 📅 ' + formatDateArabic(new Date()) + '</p>';
  html += '</div>';
  html += '</div>';

  html += '<div class="inventory-summary">';
  html += '<div class="summary-item summary-ok"><span class="summary-num">' + summary.ok + '</span><span class="summary-lbl">جاهز</span></div>';
  html += '<div class="summary-item summary-warn"><span class="summary-num">' + summary.warn + '</span><span class="summary-lbl">تحذير</span></div>';
  html += '<div class="summary-item summary-danger"><span class="summary-num">' + summary.danger + '</span><span class="summary-lbl">نافد</span></div>';
  html += '</div>';

  html += '<div class="add-item-bar">';
  html += '<button class="btn-add-item" onclick="openAddItem(\'' + deviceId + '\',\'' + empId + '\')">';
  html += '<span class="btn-add-icon">➕</span><span>إضافة بند جديد</span></button>';
  html += '</div>';

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
      var isCustom = item.custom === true;

      html += '<div class="supply-item supply-' + status.class + (isCustom ? ' supply-custom' : '') + '">';
      html += '<div class="supply-item-main" onclick="openEdit(\'' + deviceId + '\',' + idx + ',\'' + empId + '\')">';
      html += '<div class="supply-item-name">' + item.name;
      if (isCustom) html += ' <span class="custom-badge">مضاف</span>';
      html += '</div>';
      html += '<div class="supply-item-meta">';
      html += '<span class="supply-item-qty">📦 ' + (item.qty || 0) + '</span>';
      if (item.expiry) html += '<span class="supply-item-expiry">📅 ' + item.expiry + '</span>';
      if (item.lot) html += '<span class="supply-item-lot">🏷️ ' + item.lot + '</span>';
      html += '</div></div>';
      html += '<div class="supply-item-status status-badge-' + status.class + '">' + status.icon + '</div>';
      html += '<button class="btn-delete-item" onclick="event.stopPropagation();confirmDeleteItem(\'' + deviceId + '\',' + idx + ',\'' + empId + '\')" title="حذف">🗑</button>';
      html += '</div>';
    });

    html += '</div></div>';
  });

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
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var qty = Number(supply.qty) || 0;
  var minQty = Number(supply.minQty) || 0;

  if (qty === 0) return { class: "danger", icon: "❌", label: "نافد" };

  if (supply.expiry) {
    var exp = new Date(supply.expiry); exp.setHours(0, 0, 0, 0);
    var daysLeft = Math.floor((exp - today) / 86400000);
    if (daysLeft < 0) return { class: "danger", icon: "❌", label: "منتهي" };
    if (daysLeft <= APP_CONFIG.warnDaysExpirySoon) return { class: "warn", icon: "⚠️", label: "قارب " + daysLeft + "ي" };
    if (daysLeft <= APP_CONFIG.warnDaysExpiry) return { class: "warn", icon: "⚠️", label: "باقي " + daysLeft + "ي" };
  }

  if (qty < minQty) return { class: "warn", icon: "⚠️", label: "منخفض" };
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

/* ═══════════════════════════════════════════════════════════
   7) نافذة التعديل / الإضافة
   ═══════════════════════════════════════════════════════════ */
function openEdit(deviceId, supplyIdx, empId) {
  var device = SUPPLY_DATA[deviceId];
  if (!device) return;
  var supply = device.supplies[supplyIdx];
  if (!supply) return;

  currentEdit = { deviceId: deviceId, supplyIdx: supplyIdx, employeeId: empId, isCustom: supply.custom === true };

  document.getElementById("modalTitle").textContent = "تعديل: " + supply.name;
  document.getElementById("itemName").value = supply.name;
  document.getElementById("itemType").value = supply.type;
  document.getElementById("itemQty").value = supply.qty || "";
  document.getElementById("itemMinQty").value = supply.minQty || 5;
  document.getElementById("itemLot").value = supply.lot || "";
  document.getElementById("itemExpiry").value = supply.expiry || "";
  document.getElementById("itemOpenDate").value = supply.openDate || "";
  document.getElementById("itemKitDays").value = supply.kitDays || "";
  document.getElementById("itemLocation").value = supply.location || "";
  document.getElementById("itemNote").value = supply.note || "";

  document.getElementById("btnDeleteModal").style.display = "block";
  document.getElementById("modalOverlay").classList.add("active");

  setTimeout(function () { document.getElementById("itemQty").focus(); }, 300);
}

function openAddItem(deviceId, empId) {
  currentEdit = { deviceId: deviceId, supplyIdx: -1, employeeId: empId, isCustom: true };

  document.getElementById("modalTitle").textContent = "➕ إضافة بند جديد";
  document.getElementById("itemName").value = "";
  document.getElementById("itemType").value = "reagents";
  document.getElementById("itemQty").value = "0";
  document.getElementById("itemMinQty").value = "5";
  document.getElementById("itemLot").value = "";
  document.getElementById("itemExpiry").value = "";
  document.getElementById("itemOpenDate").value = "";
  document.getElementById("itemKitDays").value = "14";
  document.getElementById("itemLocation").value = "";
  document.getElementById("itemNote").value = "";

  document.getElementById("btnDeleteModal").style.display = "none";
  document.getElementById("modalOverlay").classList.add("active");

  setTimeout(function () { document.getElementById("itemName").focus(); }, 300);
}

function saveItem() {
  var deviceId = currentEdit.deviceId;
  if (!deviceId) return;

  var name = document.getElementById("itemName").value.trim();
  if (!name) { showToast("⚠️ أدخل اسم البند", "warning"); return; }

  var device = SUPPLY_DATA[deviceId];

  var itemData = {
    name: name,
    type: document.getElementById("itemType").value,
    qty: parseInt(document.getElementById("itemQty").value) || 0,
    minQty: parseInt(document.getElementById("itemMinQty").value) || 5,
    lot: document.getElementById("itemLot").value.trim(),
    expiry: document.getElementById("itemExpiry").value,
    openDate: document.getElementById("itemOpenDate").value,
    kitDays: parseInt(document.getElementById("itemKitDays").value) || 0,
    location: document.getElementById("itemLocation").value.trim(),
    note: document.getElementById("itemNote").value.trim()
  };

  var empId = currentEdit.employeeId;
  var idx = currentEdit.supplyIdx;

  if (idx === -1) {
    itemData.id = Date.now();
    itemData.custom = true;
    device.supplies.push(itemData);

    if (!SYSTEM_DATA.custom_supplies[deviceId]) SYSTEM_DATA.custom_supplies[deviceId] = [];
    SYSTEM_DATA.custom_supplies[deviceId].push(itemData);

    saveSystemData();
    saveSupplies();
    showToast("✓ تم إضافة البند", "success");
  } else {
    var supply = device.supplies[idx];
    itemData.id = supply.id;
    itemData.custom = supply.custom || false;
    device.supplies[idx] = itemData;

    if (itemData.custom && SYSTEM_DATA.custom_supplies[deviceId]) {
      SYSTEM_DATA.custom_supplies[deviceId] = SYSTEM_DATA.custom_supplies[deviceId].map(function (s) {
        return s.id === itemData.id ? itemData : s;
      });
      saveSystemData();
    }

    saveSupplies();
    showToast("✓ تم الحفظ", "success");
  }

  closeModal();
  setTimeout(function () { renderInventoryForm(empId, deviceId); }, 100);
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
  currentEdit = { deviceId: null, supplyIdx: null, employeeId: null, isCustom: false };
}

function handleOverlayClick(event) {
  if (event.target.id === "modalOverlay") closeModal();
}

/* ═══════════════════════════════════════════════════════════
   8) حذف بند
   ═══════════════════════════════════════════════════════════ */
function confirmDeleteItem(deviceId, supplyIdx, empId) {
  var device = SUPPLY_DATA[deviceId];
  if (!device) return;
  var supply = device.supplies[supplyIdx];
  if (!supply) return;

  if (!confirm("هل تريد حذف: " + supply.name + "؟")) return;
  deleteItem(deviceId, supplyIdx, empId);
}

function deleteItem(deviceId, supplyIdx, empId) {
  var device = SUPPLY_DATA[deviceId];
  var supply = device.supplies[supplyIdx];
  if (!supply) return;

  var itemId = supply.id;
  device.supplies.splice(supplyIdx, 1);

  if (SYSTEM_DATA.custom_supplies[deviceId]) {
    SYSTEM_DATA.custom_supplies[deviceId] = SYSTEM_DATA.custom_supplies[deviceId].filter(function (s) {
      return s.id !== itemId;
    });
    saveSystemData();
  }

  saveSupplies();
  renderInventoryForm(empId, deviceId);
  showToast("🗑 تم الحذف", "success");
}

function deleteFromModal() {
  if (currentEdit.supplyIdx === null || currentEdit.supplyIdx === -1) return;
  var device = SUPPLY_DATA[currentEdit.deviceId];
  var supply = device.supplies[currentEdit.supplyIdx];
  if (!supply) return;

  if (!confirm("هل تريد حذف: " + supply.name + "؟")) return;

  var empId = currentEdit.employeeId;
  var deviceId = currentEdit.deviceId;
  var idx = currentEdit.supplyIdx;

  closeModal();
  deleteItem(deviceId, idx, empId);
}

/* ═══════════════════════════════════════════════════════════
   9) طباعة التقرير A4 (النسخة المصححة جذرياً)
   ═══════════════════════════════════════════════════════════ */
function printInventory(empId, deviceId) {
  var employee = SYSTEM_DATA.employees.find(function (e) { return e.id === empId; });
  var device = SUPPLY_DATA[deviceId];
  if (!employee || !device) return;

  var now = new Date();
  var grouped = groupByType(device.supplies);
  var summary = getSummary(device.supplies);

  // إنشاء نافذة الطباعة
  var win = window.open("", "_blank");
  if (!win) {
    showToast("⚠️ اسمح بالنوافذ المنبثقة للطباعة", "warning");
    return;
  }

  // بناء التقرير الجديد (بدون الترويسة القديمة)
  var html = '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">';
  html += '<title>تقرير الجرد - ' + device.name + '</title>';
  
  // ربط ملف التصميم الأساسي (style.css) حيث توجد الترويسة BG.PNG
  html += '<link rel="stylesheet" href="./style.css">';
  
  // إضافة ستايل صغير خاص بالنافذة المنبثقة لضمان الطباعة
  html += '<style>';
  html += 'body { background: white; margin: 0; padding: 0; }';
  html += '.print-container { width: 100%; max-width: 210mm; margin: 0 auto; padding: 15mm; }';
  html += '@media print { .print-container { padding: 0; } }';
  html += '</style>';

  html += '</head><body>';

  // المحتوى الذي سيظهر فوق صورة الترويسة
  html += '<div class="print-container inventory-card">';

  html += '<div class="inventory-header">';
  html += '<div class="inventory-header-icon">' + (device.icon || "🔬") + '</div>';
  html += '<div class="inventory-header-info">';
  html += '<h3 class="inventory-device-name">الجهاز: ' + device.name + '</h3>';
  html += '<p class="inventory-meta">👤 الموظف: ' + employee.name + ' | 📅 التاريخ: ' + formatDateArabic(now) + ' | 🕐 الوقت: ' + now.toLocaleTimeString("ar-SA") + '</p>';
  html += '</div></div>';

  // الجداول
  Object.keys(SUPPLY_TYPES).forEach(function (type) {
    if (!grouped[type] || grouped[type].length === 0) return;
    var typeInfo = SUPPLY_TYPES[type];

    html += '<div class="supply-section">';
    html += '<div class="supply-section-header">' + typeInfo.icon + ' ' + typeInfo.label + ' (' + grouped[type].length + ')</div>';
    html += '<table style="width:100%; border-collapse:collapse; margin-bottom:15px; font-size:12px; background:rgba(255,255,255,0.85);">';
    html += '<thead><tr style="background:#1565c0; color:white;">';
    html += '<th style="padding:6px; border:1px solid #999;">الاسم</th>';
    html += '<th style="padding:6px; border:1px solid #999;">الكمية</th>';
    html += '<th style="padding:6px; border:1px solid #999;">الحد الأدنى</th>';
    html += '<th style="padding:6px; border:1px solid #999;">رقم الكتة</th>';
    html += '<th style="padding:6px; border:1px solid #999;">الصلاحية</th>';
    html += '<th style="padding:6px; border:1px solid #999;">الحالة</th>';
    html += '<th style="padding:6px; border:1px solid #999;">الموقع</th>';
    html += '</tr></thead><tbody>';

    grouped[type].forEach(function (item) {
      var st = getSupplyStatus(item);
      html += '<tr>';
      html += '<td style="padding:6px; border:1px solid #999;">' + item.name + '</td>';
      html += '<td style="padding:6px; border:1px solid #999; text-align:center;">' + (item.qty || 0) + '</td>';
      html += '<td style="padding:6px; border:1px solid #999; text-align:center;">' + (item.minQty || 0) + '</td>';
      html += '<td style="padding:6px; border:1px solid #999; text-align:center;">' + (item.lot || "—") + '</td>';
      html += '<td style="padding:6px; border:1px solid #999; text-align:center;">' + (item.expiry || "—") + '</td>';
      html += '<td style="padding:6px; border:1px solid #999; text-align:center; font-weight:bold;">' + st.icon + '</td>';
      html += '<td style="padding:6px; border:1px solid #999; text-align:center;">' + (item.location || "—") + '</td>';
      html += '</tr>';
    });

    html += '</tbody></table></div>';
  });

  // الملخص والتوقيعات
  html += '<div style="margin-top:20px; padding:10px; border:1px solid #1565c0; border-radius:5px; background:rgba(255,255,255,0.9); display:flex; justify-content:space-between; font-weight:bold;">';
  html += '<span>📊 إجمالي: ' + summary.total + '</span>';
  html += '<span>✅ جاهز: ' + summary.ok + '</span>';
  html += '<span>⚠️ تحذير: ' + summary.warn + '</span>';
  html += '<span>❌ نافد: ' + summary.danger + '</span>';
  html += '</div>';

  html += '<div style="margin-top:40px; display:flex; justify-content:space-between;">';
  html += '<div style="border-top:1px solid #000; width:200px; text-align:center; padding-top:5px;">توقيع الموظف</div>';
  html += '<div style="border-top:1px solid #000; width:200px; text-align:center; padding-top:5px;">توقيع المسؤول</div>';
  html += '</div>';

  html += '</div>'; // إغلاق الحاوية

  // أوامر الطباعة التلقائية
  html += '<scr' + 'ipt>';
  html += 'window.onload = function() {';
  html += '  setTimeout(function() { window.print(); }, 500);';
  html += '};';
  html += '</scr' + 'ipt>';

  html += '</body></html>';

  win.document.write(html);
  win.document.close();
}

/* ═══════════════════════════════════════════════════════════
   10) نسخ للواتس
   ═══════════════════════════════════════════════════════════ */
function copyToWhatsApp(empId, deviceId) {
  var employee = SYSTEM_DATA.employees.find(function (e) { return e.id === empId; });
  var device = SUPPLY_DATA[deviceId];
  if (!employee || !device) return;

  var now = new Date();
  var grouped = groupByType(device.supplies);
  var summary = getSummary(device.supplies);

  var text = "📋 *تقرير جرد المحاليل*\n";
  text += "━━━━━━━━━━━━━━━━━━━━\n";
  text += "👤 الموظف: " + employee.name + "\n";
  text += "🔬 الجهاز: " + device.name + "\n";
  text += "📅 " + formatDateArabic(now) + "\n";
  text += "🕐 " + now.toLocaleTimeString("ar-SA") + "\n";
  text += "━━━━━━━━━━━━━━━━━━━━\n\n";

  Object.keys(SUPPLY_TYPES).forEach(function (type) {
    if (!grouped[type] || grouped[type].length === 0) return;
    var typeInfo = SUPPLY_TYPES[type];
    text += typeInfo.icon + " *" + typeInfo.label + "*\n";

    grouped[type].forEach(function (item) {
      var st = getSupplyStatus(item);
      text += "• " + item.name + " — " + (item.qty || 0) + " " + st.icon + "\n";
    });

    text += "\n";
  });

  text += "━━━━━━━━━━━━━━━━━━━━\n";
  text += "📊 *الملخص:*\n";
  text += "✅ جاهز: " + summary.ok + "\n";
  text += "⚠️ تحذير: " + summary.warn + "\n";
  text += "❌ نافد: " + summary.danger + "\n";

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      showToast("✓ تم نسخ التقرير — الصقه في الواتس", "success");
    }).catch(function () { fallbackCopy(text); });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  var ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed"; ta.style.opacity = "0";
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
   11) واجهة الإدارة
   ═══════════════════════════════════════════════════════════ */
function populateAdminUI() {
  renderEmployeesAdmin();
  renderDevicesAdmin();
  renderAdminSelect();
  renderStats();
}

function renderEmployeesAdmin() {
  var container = document.getElementById("employeesList");
  var countEl = document.getElementById("employeesCount");
  if (!container) return;
  if (countEl) countEl.textContent = SYSTEM_DATA.employees.length;

  var html = "";
  SYSTEM_DATA.employees.forEach(function (emp) {
    html += '<div class="admin-item">';
    html += '<div class="admin-item-info"><span class="admin-item-icon">👤</span><span class="admin-item-name">' + emp.name + '</span></div>';
    html += '<button class="btn-delete" onclick="removeEmployee(\'' + emp.id + '\')">🗑</button>';
    html += '</div>';
  });
  container.innerHTML = html || '<p class="empty-msg">لا يوجد موظفون</p>';
}

function renderDevicesAdmin() {
  var container = document.getElementById("devicesList");
  var countEl = document.getElementById("devicesCount");
  if (!container) return;

  var devices = Object.values(SUPPLY_DATA);
  if (countEl) countEl.textContent = devices.length;

  var html = "";
  devices.forEach(function (device) {
    html += '<div class="device-card-admin">';
    html += '<div class="device-card-icon">' + (device.icon || "🔬") + '</div>';
    html += '<div class="device-card-info">';
    html += '<h4 class="device-card-name">' + device.name + '</h4>';
    html += '<p class="device-card-meta">' + (device.company || '') + ' · ' + device.supplies.length + ' بند</p>';
    html += '</div></div>';
  });
  container.innerHTML = html;
}

function renderAdminSelect() {
  var select = document.getElementById("adminEmployeeSelect");
  if (!select) return;
  select.innerHTML = '<option value="">— اختر موظف —</option>';
  SYSTEM_DATA.employees.forEach(function (emp) {
    var opt = document.createElement("option");
    opt.value = emp.id; opt.textContent = emp.name;
    select.appendChild(opt);
  });
}

function renderDeviceCheckboxes() {
  var empId = document.getElementById("adminEmployeeSelect").value;
  var container = document.getElementById("adminDevicesCheckbox");
  if (!container) return;
  if (!empId) { container.innerHTML = '<p class="empty-msg">اختر موظفاً أولاً</p>'; return; }

  var assigned = SYSTEM_DATA.employee_devices[empId] || [];
  var html = "";
  Object.keys(SUPPLY_DATA).forEach(function (devId) {
    var device = SUPPLY_DATA[devId];
    var checked = assigned.indexOf(devId) !== -1 ? "checked" : "";
    html += '<label class="checkbox-item">';
    html += '<input type="checkbox" value="' + devId + '" ' + checked + '>';
    html += '<span class="checkbox-icon">' + (device.icon || "🔬") + '</span>';
    html += '<span class="checkbox-label">' + device.short + '</span>';
    html += '</label>';
  });
  container.innerHTML = html;
}

function renderStats() {
  var container = document.getElementById("statsGrid");
  if (!container) return;

  var totalDevices = Object.keys(SUPPLY_DATA).length;
  var totalOk = 0, totalWarn = 0, totalDanger = 0;

  Object.values(SUPPLY_DATA).forEach(function (device) {
    device.supplies.forEach(function (s) {
      var st = getSupplyStatus(s);
      if (st.class === "ok") totalOk++;
      else if (st.class === "warn") totalWarn++;
      else totalDanger++;
    });
  });

  var html = "";
  html += '<div class="stat-box stat-blue"><span class="stat-box-num">' + SYSTEM_DATA.employees.length + '</span><span class="stat-box-lbl">موظف</span></div>';
  html += '<div class="stat-box stat-purple"><span class="stat-box-num">' + totalDevices + '</span><span class="stat-box-lbl">جهاز</span></div>';
  html += '<div class="stat-box stat-green"><span class="stat-box-num">' + totalOk + '</span><span class="stat-box-lbl">جاهز</span></div>';
  html += '<div class="stat-box stat-orange"><span class="stat-box-num">' + totalWarn + '</span><span class="stat-box-lbl">تحذير</span></div>';
  html += '<div class="stat-box stat-red"><span class="stat-box-num">' + totalDanger + '</span><span class="stat-box-lbl">نافد</span></div>';

  container.innerHTML = html;
}

function addNewEmployee() {
  var input = document.getElementById("newEmployeeName");
  var name = input.value.trim();
  if (!name) { showToast("⚠️ أدخل اسم الموظف", "warning"); return; }

  var exists = SYSTEM_DATA.employees.some(function (e) { return e.name === name; });
  if (exists) { showToast("الموظف موجود مسبقاً", "warning"); return; }

  var newEmp = { id: "emp_" + Date.now(), name: name };
  SYSTEM_DATA.employees.push(newEmp);
  SYSTEM_DATA.employee_devices[newEmp.id] = Object.keys(SUPPLY_DATA);

  saveSystemData();
  input.value = "";
  populateAdminUI();
  populateEmployeeSelect();
  showToast("✓ تمت الإضافة", "success");
}

function removeEmployee(empId) {
  var emp = SYSTEM_DATA.employees.find(function (e) { return e.id === empId; });
  if (!emp) return;
  if (!confirm("هل تريد حذف: " + emp.name + "؟")) return;

  SYSTEM_DATA.employees = SYSTEM_DATA.employees.filter(function (e) { return e.id !== empId; });
  delete SYSTEM_DATA.employee_devices[empId];

  saveSystemData();
  populateAdminUI();
  populateEmployeeSelect();
  showToast("🗑 تم الحذف", "success");
}

function saveEmployeeDevices() {
  var empId = document.getElementById("adminEmployeeSelect").value;
  if (!empId) { showToast("⚠️ اختر موظفاً", "warning"); return; }

  var checkboxes = document.querySelectorAll("#adminDevicesCheckbox input[type='checkbox']:checked");
  var selected = [];
  checkboxes.forEach(function (cb) { selected.push(cb.value); });

  SYSTEM_DATA.employee_devices[empId] = selected;
  saveSystemData();
  showToast("✓ تم حفظ الربط", "success");
}

/* ═══════════════════════════════════════════════════════════
   12) أدوات مساعدة
   ═══════════════════════════════════════════════════════════ */
function formatDateArabic(date) {
  try {
    return date.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
  } catch (e) { return date.toLocaleDateString(); }
}

function showToast(message, type) {
  var toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = "toast active" + (type ? " toast-" + type : "");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(function () {
    toast.classList.remove("active");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  initInventorySystem();
});
