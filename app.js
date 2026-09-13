/* ═══════════════════════════════════════════════════════════
   Lab Manager Pro v2 — app.js
   منطق التطبيق: التنقل، العرض، الجرد، التقارير
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   1) التهيئة الأولية
   ═══════════════════════════════════════════════════════════ */
function init() {
  // تحميل البيانات المحفوظة إن وُجدت
  loadAll();

  // تهيئة حالة الاختبارات
  initTestStatus();

  // بناء الواجهة
  buildAll();

  // عرض صفحة الصباح افتراضيًا
  showPage("home");
}

function buildAll() {
  updateHeaderBadge();
  buildSampleFilter();
  buildMorningPlan();
  buildDeviceSummary();
  buildDeviceTabs();
  buildCompareTable();
  buildAuditDeviceGrid();
  buildReportDeviceSelect();
  updateReportPreview();
}

function refreshAll() {
  buildAll();
  showToast("✓ تم التحديث", "success");
}

/* ═══════════════════════════════════════════════════════════
   2) التنقل بين الصفحات
   ═══════════════════════════════════════════════════════════ */
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(function (p) {
    p.classList.remove("active");
  });
  document.querySelectorAll(".nav-btn").forEach(function (b) {
    b.classList.remove("active");
  });

  var page = document.getElementById("page-" + pageId);
  var navBtn = document.getElementById("nav-" + pageId);
  if (page) page.classList.add("active");
  if (navBtn) navBtn.classList.add("active");

  // إعادة بناء المحتوى عند الدخول
  if (pageId === "home") {
    buildMorningPlan();
    buildDeviceSummary();
  } else if (pageId === "devices") {
    buildDeviceTabs();
  } else if (pageId === "compare") {
    buildCompareTable();
  } else if (pageId === "audit") {
    buildAuditContent();
  } else if (pageId === "report") {
    updateReportPreview();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToShortages() {
  showPage("report");
  var radio = document.querySelector('input[name="reportType"][value="shortages"]');
  if (radio) {
    radio.checked = true;
    updateReportPreview();
  }
}

/* ═══════════════════════════════════════════════════════════
   3) شارة الهيدر (عدد التنبيهات)
   ═══════════════════════════════════════════════════════════ */
function updateHeaderBadge() {
  var badge = document.getElementById("globalAlertBadge");
  if (!badge) return;
  var alerts = getAllAlerts();
  if (alerts.length > 0) {
    badge.textContent = alerts.length + " تنبيه";
    badge.classList.add("show");
  } else {
    badge.classList.remove("show");
  }
}

/* ═══════════════════════════════════════════════════════════
   4) فلاتر نوع العينة
   ═══════════════════════════════════════════════════════════ */
function buildSampleFilter() {
  var container = document.getElementById("sampleFilter");
  if (!container) return;

  container.innerHTML = SAMPLE_TYPES.map(function (st) {
    var active = SETTINGS.currentSampleType === st.id ? " active" : "";
    return '<button class="sample-chip' + active + '" onclick="selectSampleType(\'' + st.id + '\')">' +
           st.icon + " " + st.label + "</button>";
  }).join("");
}

function selectSampleType(id) {
  SETTINGS.currentSampleType = id;
  saveAll();
  buildSampleFilter();
  buildMorningPlan();
}

/* ═══════════════════════════════════════════════════════════
   5) شاشة الصباح — التاريخ والملخص
   ═══════════════════════════════════════════════════════════ */
function updateHeroDate() {
  var el = document.getElementById("heroDate");
  if (el) el.textContent = formatDateArabic(new Date());
}

function updateHeroSummary() {
  var el = document.getElementById("heroSummary");
  if (!el) return;

  var stats = [];
  var okDevices = 0, warnDevices = 0, dangerDevices = 0;

  for (var devId in DEVICES) {
    if (!DEVICES[devId].isActive) continue;
    var s = getDeviceStats(devId);
    if (s.alerts === 0) okDevices++;
    else if (s.danger > 0) dangerDevices++;
    else warnDevices++;
  }

  el.innerHTML =
    '<div class="summary-stat ok">' +
      '<div class="stat-value">' + okDevices + '</div>' +
      '<div class="stat-label">جاهز</div>' +
    '</div>' +
    '<div class="summary-stat warn">' +
      '<div class="stat-value">' + warnDevices + '</div>' +
      '<div class="stat-label">تنبيهات</div>' +
    '</div>' +
    '<div class="summary-stat danger">' +
      '<div class="stat-value">' + dangerDevices + '</div>' +
      '<div class="stat-label">متوقف</div>' +
    '</div>';
}

/* ═══════════════════════════════════════════════════════════
   6) خطة الصباح — توزيع العينات
   ═══════════════════════════════════════════════════════════ */
function buildMorningPlan() {
  updateHeroDate();
  updateHeroSummary();

  var container = document.getElementById("morningPlan");
  if (!container) return;

  // اختبارات شائعة لعرض الخطة
  var planTests = [
    { name: "GLU",          priority: "routine" },
    { name: "UREA",         priority: "routine" },
    { name: "CREA",         priority: "routine" },
    { name: "Na",           priority: "routine" },
    { name: "K",            priority: "routine" },
    { name: "Ca",           priority: "routine" },
    { name: "ALT",          priority: "routine" },
    { name: "AST",          priority: "routine" },
    { name: "TBIL",         priority: "routine" },
    { name: "CRP",          priority: "routine" },
    { name: "HbA1c",        priority: "routine" },
    { name: "TSH",          priority: "routine" },
    { name: "FT4",          priority: "routine" },
    { name: "Vitamin-D",    priority: "routine" },
    { name: "Vitamin-B12",  priority: "routine" },
    { name: "Ferritin",     priority: "routine" },
    { name: "Troponin",     priority: "emergency" },
    { name: "bHCG",         priority: "emergency" }
  ];

  var html = "";

  planTests.forEach(function (pt) {
    var bestDevices = findBestDevicesForTest(pt.name);
    if (bestDevices.length === 0) return;

    var priorityClass = "priority-" + pt.priority;
    var arrow = "→";
    var best = bestDevices[0];

    html += '<div class="plan-item ' + priorityClass + '">' +
              '<span>' + (pt.priority === "emergency" ? "🚨" : "📌") + '</span>' +
              '<div>' +
                '<div class="plan-test">' + pt.name + '</div>' +
                '<div class="plan-device">' + best.deviceName + (bestDevices.length > 1 ? " (وأيضًا " + bestDevices.length + " أجهزة أخرى)" : "") + '</div>' +
              '</div>' +
              '<span class="plan-arrow">' + arrow + '</span>' +
            '</div>';
  });

  if (!html) {
    html = '<p class="hint">لا توجد بيانات كافية. ابدأ بالجرد من صفحة "الجرد".</p>';
  }

  container.innerHTML = html;
}

function findBestDevicesForTest(testName) {
  var results = [];

  for (var devId in DEVICES) {
    if (!DEVICES[devId].isActive) continue;

    var tests = DEVICE_TEST_NAMES[devId] || [];
    var hasTest = tests.some(function (t) {
      return t.toUpperCase().indexOf(testName.toUpperCase()) !== -1 ||
             testName.toUpperCase().indexOf(t.toUpperCase()) !== -1;
    });

    if (!hasTest) continue;

    var readiness = getTestReadiness(devId, testName);
    results.push({
      deviceId: devId,
      deviceName: DEVICES[devId].name,
      deviceShort: DEVICES[devId].short,
      status: readiness.status,
      missing: readiness.missing,
      reason: readiness.reason
    });
  }

  // ترتيب: ready أولًا، ثم partial، ثم down
  var order = { ready: 0, partial: 1, down: 2 };
  results.sort(function (a, b) {
    return order[a.status] - order[b.status];
  });

  // إعادة الأجهزة الجاهزة فقط
  return results.filter(function (r) { return r.status === "ready"; });
}

/* ═══════════════════════════════════════════════════════════
   7) ملخص الأجهزة
   ═══════════════════════════════════════════════════════════ */
function buildDeviceSummary() {
  var container = document.getElementById("deviceSummary");
  if (!container) return;

  var html = "";
  var deviceOrder = ["atellica", "cobas_pure", "c311", "e411", "dimension", "vidas", "variant"];

  deviceOrder.forEach(function (devId) {
    var dev = DEVICES[devId];
    if (!dev) return;

    var stats = getDeviceStats(devId);
    var badgeClass = "ok";
    var badgeText = "جاهز";

    if (stats.danger > 0) {
      badgeClass = "danger";
      badgeText = stats.danger + " توقف";
    } else if (stats.alerts > 0) {
      badgeClass = "warn";
      badgeText = stats.alerts + " تنبيه";
    }

    html += '<div class="device-summary-row">' +
              '<div>' +
                '<div class="dsr-name">' + dev.short + '</div>' +
                '<div class="dsr-bar-track">' +
                  '<div class="dsr-bar-fill" style="width:' + stats.pct + '%"></div>' +
                '</div>' +
              '</div>' +
              '<span class="dsr-pct">' + stats.pct + '%</span>' +
              '<span class="dsr-badge ' + badgeClass + '">' + badgeText + '</span>' +
            '</div>';
  });

  container.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════════
   8) تبويبات الأجهزة
   ═══════════════════════════════════════════════════════════ */
function buildDeviceTabs() {
  var nav = document.getElementById("devTabsNav");
  var content = document.getElementById("devTabsContent");
  if (!nav || !content) return;

  nav.innerHTML = "";
  content.innerHTML = "";

  var deviceOrder = ["atellica", "cobas_pure", "c311", "e411", "dimension", "vidas", "variant"];
  var firstDevice = null;

  deviceOrder.forEach(function (devId) {
    var dev = DEVICES[devId];
    if (!dev || !dev.isActive) return;
    if (!firstDevice) firstDevice = devId;

    var isActive = SETTINGS.currentDevice === devId ? " active" : "";
    var btn = document.createElement("button");
    btn.className = "dev-tab-btn" + isActive;
    btn.textContent = dev.short;
    btn.onclick = function () {
      SETTINGS.currentDevice = devId;
      saveAll();
      buildDeviceTabs();
    };
    nav.appendChild(btn);
  });

  // لو الجهاز الحالي غير موجود، اختر أول جهاز
  if (!SETTINGS.currentDevice || !DEVICES[SETTINGS.currentDevice]) {
    SETTINGS.currentDevice = firstDevice;
  }

  // عرض محتوى الجهاز الحالي
  content.innerHTML = buildDeviceContent(SETTINGS.currentDevice);
}

function buildDeviceContent(devId) {
  var dev = DEVICES[devId];
  if (!dev) return '<p class="hint">جهاز غير معروف</p>';

  var items = getDeviceItems(devId);
  var groups = groupItemsByType(items);
  var html = "";

  // معلومات الجهاز
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
            '<div>' +
              '<div style="font-size:15px;font-weight:700;">' + dev.name + '</div>' +
              '<div style="font-size:12px;color:var(--text2);margin-top:2px;">' + dev.typeLabel + ' — ' + dev.description + '</div>' +
            '</div>' +
            '<span class="dsr-badge ok">' + getDeviceStats(devId).pct + '%</span>' +
          '</div>';

  // عرض كل نوع
  var order = ["Reagent", "Calibrator", "QC", "Solution", "Part"];

  order.forEach(function (type) {
    var arr = groups[type];
    if (!arr || arr.length === 0) return;

    html += '<div class="section-header">' +
              TYPE_ICON[type] + " " + TYPE_AR[type] +
              ' <span class="section-count">' + arr.length + '</span>' +
            '</div>';

    html += '<div class="reagent-list">';

    arr.forEach(function (item) {
      var st = getStatus(item);
      var kp = getKitProgress(item);

      // شارة "مشترك"
      var sharedTag = "";
      if (item._sharedFrom) {
        sharedTag = '<div class="reagent-shared">🔗 مشترك مع ' + (SHARED_RULES[devId] ? SHARED_RULES[devId].displayName : item._sharedFrom) + '</div>';
      } else if (item.note && item.note.indexOf("مشترك") !== -1) {
        sharedTag = '<div class="reagent-shared">🔗 ' + item.note + '</div>';
      }

      html += '<div class="reagent-item status-' + st.status + '" onclick="editItem(\'' + devId + '\',\'' + item.id + '\')">';

      // رأس البطاقة
      html += '<div class="reagent-top">' +
                '<div>' +
                  '<div class="reagent-name">' + (item.name || "—") + '</div>' +
                  '<div class="reagent-type">' + TYPE_AR[item.type] + '</div>' +
                  sharedTag +
                '</div>' +
                statusPill(st.status) +
              '</div>';

      // شريط الكتة
      if (kp !== null) {
        var bc = kp.pct > 40 ? "green" : kp.pct > 15 ? "yellow" : "red";
        var dt = kp.remaining <= 0 ? "نفدت!" : "باقي " + kp.remaining + " يوم";
        html += '<div class="kit-progress">' +
                  '<div class="kit-progress-label">' +
                    '<span class="kpl-text">الكتة المفتوحة</span>' +
                    '<span class="kpl-days ' + bc + '">' + dt + '</span>' +
                  '</div>' +
                  '<div class="kit-bar-track">' +
                    '<div class="kit-bar-fill ' + bc + '" style="width:' + kp.pct + '%"></div>' +
                  '</div>' +
                '</div>';
      }

      // بيانات الصنف
      html += '<div class="reagent-meta">' +
                '<div class="meta-field">' +
                  '<div class="meta-label">المخزون</div>' +
                  '<div class="meta-val">' + (item.qty || 0) + '</div>' +
                '</div>' +
                '<div class="meta-field">' +
                  '<div class="meta-label">الصلاحية</div>' +
                  '<div class="meta-val">' + expiryText(item.expiry) + '</div>' +
                '</div>' +
                '<div class="meta-field">' +
                  '<div class="meta-label">Lot#</div>' +
                  '<div class="meta-val">' + (item.lot || "—") + '</div>' +
                '</div>' +
                '<div class="meta-field">' +
                  '<div class="meta-label">الموقع</div>' +
                  '<div class="meta-val">' + (item.location || "—") + '</div>' +
                '</div>' +
              '</div>';

      html += '</div>';
    });

    html += '</div>';
  });

  if (items.length === 0) {
    html += '<p class="hint" style="text-align:center;padding:20px;">لا توجد أصناف لهذا الجهاز. اضغط على "إضافة صنف" لبدء الجرد.</p>';
  }

  // زر إضافة صنف
  html += '<div style="margin-top:16px;">' +
            '<button class="btn-primary" style="width:100%;" onclick="openAddItem(\'' + devId + '\')">+ إضافة صنف جديد</button>' +
          '</div>';

  return html;
}

/* ═══════════════════════════════════════════════════════════
   9) جدول المقارنة
   ═══════════════════════════════════════════════════════════ */
function buildCompareTable() {
  var table = document.getElementById("compareTable");
  if (!table) return;

  // الأجهزة الأساسية (بدون vidas و variant)
  var compareDevices = ["atellica", "cobas_pure", "c311", "e411", "dimension"];

  // اختبارات موحّدة
  var testList = [
    "GLU", "UREA", "CREA", "UA", "Na", "K", "Cl", "Ca", "PHOS", "Mg",
    "ALT", "AST", "ALP", "GGT", "TBIL", "DBIL", "TP", "ALB",
    "CHOL", "TG", "HDL", "LDL", "CK", "CK-MB", "LDH", "AMY", "LIP",
    "CRP", "Fe-Iron", "UIBC", "NH3", "HbA1c",
    "TSH", "FT4", "FT3", "LH", "FSH", "Prolactin", "HCG-Beta",
    "Testosterone", "Estradiol", "Progesterone", "Cortisol",
    "Ferritin", "Vitamin-B12", "Vitamin-D", "Folate", "PSA",
    "AFP", "CEA", "CA-125", "CA-15-3", "CA-19-9", "TnI"
  ];

  // رأس الجدول
  var html = "<thead><tr>";
  html += "<th>الاختبار</th>";
  compareDevices.forEach(function (d) {
    html += "<th>" + DEVICE_SHORT[d] + "</th>";
  });
  html += "<th>الأنسب</th>";
  html += "</tr></thead><tbody>";

  testList.forEach(function (testName) {
    var readyOn = [];
    var partialOn = [];

    var rowHtml = "<tr>";
    rowHtml += '<td>' + testName + '</td>';

    compareDevices.forEach(function (devId) {
      var tests = DEVICE_TEST_NAMES[devId] || [];
      var hasTest = tests.some(function (t) {
        return t.toUpperCase() === testName.toUpperCase() ||
               t.toUpperCase().indexOf(testName.toUpperCase()) !== -1 ||
               testName.toUpperCase().indexOf(t.toUpperCase()) !== -1;
      });

      if (!hasTest) {
        rowHtml += '<td class="cell-na">—</td>';
        return;
      }

      var readiness = getTestReadiness(devId, testName);
      if (readiness.status === "ready") {
        rowHtml += '<td class="cell-ok">✓</td>';
        readyOn.push(devId);
      } else if (readiness.status === "partial") {
        rowHtml += '<td class="cell-partial">◐</td>';
        partialOn.push(devId);
      } else {
        rowHtml += '<td class="cell-no">✗</td>';
      }
    });

    // عمود الأنسب
    var bestHtml = "";
    if (readyOn.length > 0) {
      bestHtml = readyOn.map(function (d) {
        return '<span class="best-device-tag">' + DEVICE_SHORT[d] + '</span>';
      }).join(" ");
    } else if (partialOn.length > 0) {
      bestHtml = '<span class="cell-partial">جزئي: ' + partialOn.map(function (d) { return DEVICE_SHORT[d]; }).join("، ") + '</span>';
    } else {
      bestHtml = '<span class="cell-no">لا يوجد</span>';
    }
    rowHtml += "<td>" + bestHtml + "</td>";

    // إضافة كلاس row-best إن كان فيه جهاز جاهز
    if (readyOn.length > 0) {
      rowHtml = rowHtml.replace("<tr>", '<tr class="row-best" data-test="' + testName + '">');
    } else {
      rowHtml = rowHtml.replace("<tr>", '<tr data-test="' + testName + '">');
    }

    rowHtml += "</tr>";
    html += rowHtml;
  });

  html += "</tbody>";
  table.innerHTML = html;

  // تطبيق الفلتر إن وُجد
  filterCompare();
}

function filterCompare() {
  var query = (document.getElementById("compareSearch") || {}).value || "";
  query = query.trim().toUpperCase();

  var rows = document.querySelectorAll("#compareTable tbody tr");
  rows.forEach(function (row) {
    var testName = (row.getAttribute("data-test") || "").toUpperCase();
    if (!query || testName.indexOf(query) !== -1) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   10) وضع الجرد
   ═══════════════════════════════════════════════════════════ */
function buildAuditDeviceGrid() {
  var grid = document.getElementById("auditDeviceGrid");
  if (!grid) return;

  var deviceOrder = ["atellica", "cobas_pure", "c311", "e411", "dimension", "vidas", "variant"];

  grid.innerHTML = deviceOrder.map(function (devId) {
    var dev = DEVICES[devId];
    if (!dev) return "";
    var items = SUPPLY_DATA[devId] || [];
    var active = SETTINGS.currentAuditDevice === devId ? " active" : "";
    return '<button class="audit-device-btn' + active + '" onclick="selectAuditDevice(\'' + devId + '\')">' +
             dev.short +
             '<span class="adb-count">' + items.length + ' صنف</span>' +
           '</button>';
  }).join("");
}

function selectAuditDevice(devId) {
  SETTINGS.currentAuditDevice = devId;
  saveAll();
  buildAuditDeviceGrid();
  buildAuditContent();
}

function buildAuditContent() {
  var container = document.getElementById("auditContent");
  if (!container) return;

  var devId = SETTINGS.currentAuditDevice || "atellica";
  var dev = DEVICES[devId];
  if (!dev) {
    container.innerHTML = "";
    return;
  }

  var items = SUPPLY_DATA[devId] || [];

  var html = '<div class="card">' +
               '<div class="card-title">' + dev.name + ' — ' + items.length + ' صنف</div>' +
               '<p class="hint">اضغط على أي صنف لتعديل كميته وتاريخه بسرعة.</p>' +
               '<div class="reagent-list" style="margin-top:12px;">';

  if (items.length === 0) {
    html += '<p class="hint" style="text-align:center;padding:16px;">لا توجد أصناف.</p>';
  } else {
    items.forEach(function (item) {
      var st = getStatus(item);
      html += '<div class="reagent-item status-' + st.status + '" onclick="editItem(\'' + devId + '\',\'' + item.id + '\')">' +
                '<div class="reagent-top">' +
                  '<div>' +
                    '<div class="reagent-name">' + (item.name || "—") + '</div>' +
                    '<div class="reagent-type">' + TYPE_AR[item.type] + '</div>' +
                  '</div>' +
                  statusPill(st.status) +
                '</div>' +
                '<div class="reagent-meta">' +
                  '<div class="meta-field">' +
                    '<div class="meta-label">الكمية</div>' +
                    '<div class="meta-val">' + (item.qty || 0) + '</div>' +
                  '</div>' +
                  '<div class="meta-field">' +
                    '<div class="meta-label">الصلاحية</div>' +
                    '<div class="meta-val">' + expiryText(item.expiry) + '</div>' +
                  '</div>' +
                  '<div class="meta-field">' +
                    '<div class="meta-label">Lot#</div>' +
                    '<div class="meta-val">' + (item.lot || "—") + '</div>' +
                  '</div>' +
                  '<div class="meta-field">' +
                    '<div class="meta-label">الموقع</div>' +
                    '<div class="meta-val">' + (item.location || "—") + '</div>' +
                  '</div>' +
                '</div>' +
              '</div>';
    });
  }

  html += '</div>' +
          '<div style="margin-top:14px;">' +
            '<button class="btn-primary" style="width:100%;" onclick="openAddItem(\'' + devId + '\')">+ إضافة صنف جديد</button>' +
          '</div>' +
        '</div>';

  container.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════════
   11) نافذة الإضافة / التعديل
   ═══════════════════════════════════════════════════════════ */
var editingItem = null; // { devId, itemId }

function openAddItem(devId) {
  editingItem = { devId: devId, itemId: null };
  document.getElementById("modalTitle").textContent = "إضافة صنف — " + DEVICES[devId].short;

  // تفريغ الحقول
  ["fName", "fLot", "fExpiry", "fQty", "fMinQty", "fOpenDate", "fKitDays", "fLocation", "fNote"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("fType").value = "Reagent";
  document.getElementById("fDevice").value = devId;
  document.getElementById("fQty").value = "0";
  document.getElementById("fMinQty").value = "5";

  document.getElementById("btnDelete").style.display = "none";
  document.getElementById("deleteConfirm").style.display = "none";

  buildDeviceSelect();
  openModal();
}

function editItem(devId, itemId) {
  var items = SUPPLY_DATA[devId] || [];
  var item = items.find(function (i) { return i.id === itemId; });

  // لو الصنف مشترك من جهاز آخر
  if (!item) {
    // نبحث في الأصناف المشتركة
    var shared = getDeviceItems(devId);
    item = shared.find(function (i) { return i.id === itemId; });
  }

  if (!item) return;

  editingItem = { devId: devId, itemId: itemId };

  document.getElementById("modalTitle").textContent = "تعديل: " + (item.name || "");
  document.getElementById("fName").value = item.name || "";
  document.getElementById("fType").value = item.type || "Reagent";
  document.getElementById("fLot").value = item.lot || "";
  document.getElementById("fExpiry").value = item.expiry || "";
  document.getElementById("fQty").value = item.qty !== undefined ? item.qty : "";
  document.getElementById("fMinQty").value = item.minQty !== undefined ? item.minQty : "";
  document.getElementById("fOpenDate").value = item.openDate || "";
  document.getElementById("fKitDays").value = item.kitDays !== undefined ? item.kitDays : "";
  document.getElementById("fLocation").value = item.location || "";
  document.getElementById("fNote").value = item.note || "";

  buildDeviceSelect();
  document.getElementById("fDevice").value = devId;

  document.getElementById("btnDelete").style.display = "block";
  document.getElementById("deleteConfirm").style.display = "none";

  openModal();
}

function buildDeviceSelect() {
  var select = document.getElementById("fDevice");
  if (!select) return;
  select.innerHTML = Object.keys(DEVICES).filter(function (d) {
    return DEVICES[d].isActive;
  }).map(function (d) {
    return '<option value="' + d + '">' + DEVICES[d].name + '</option>';
  }).join("");
}

function saveItem() {
  if (!editingItem) return;

  var name = document.getElementById("fName").value.trim();
  if (!name) {
    showToast("أدخل اسم الصنف", "error");
    return;
  }

  var itemData = {
    name: name,
    type: document.getElementById("fType").value,
    lot: document.getElementById("fLot").value.trim(),
    expiry: document.getElementById("fExpiry").value,
    qty: Number(document.getElementById("fQty").value) || 0,
    minQty: Number(document.getElementById("fMinQty").value) || 0,
    openDate: document.getElementById("fOpenDate").value,
    kitDays: Number(document.getElementById("fKitDays").value) || getDefaultKitDays(name),
    location: document.getElementById("fLocation").value.trim(),
    note: document.getElementById("fNote").value.trim()
  };

  var devId = document.getElementById("fDevice").value;

  if (editingItem.itemId) {
    // تعديل صنف موجود
    var oldDevId = editingItem.devId;
    if (oldDevId !== devId) {
      // نقل بين الأجهزة
      var items = SUPPLY_DATA[oldDevId] || [];
      var idx = items.findIndex(function (i) { return i.id === editingItem.itemId; });
      if (idx !== -1) {
        items.splice(idx, 1);
        itemData.id = generateId(devId);
        if (!SUPPLY_DATA[devId]) SUPPLY_DATA[devId] = [];
        SUPPLY_DATA[devId].push(itemData);
      } else {
        showToast("الصنف غير موجود", "error");
        return;
      }
    } else {
      var arr = SUPPLY_DATA[oldDevId] || [];
      var idx2 = arr.findIndex(function (i) { return i.id === editingItem.itemId; });
      if (idx2 !== -1) {
        itemData.id = editingItem.itemId;
        arr[idx2] = itemData;
      }
    }
    showToast("✓ تم التعديل", "success");
  } else {
    // إضافة صنف جديد
    itemData.id = generateId(devId);
    if (!SUPPLY_DATA[devId]) SUPPLY_DATA[devId] = [];
    SUPPLY_DATA[devId].push(itemData);
    showToast("✓ تمت الإضافة", "success");
  }

  saveAll();
  closeModalDirect();
  refreshAll();
}

function confirmDelete() {
  document.getElementById("deleteConfirm").style.display = "block";
  document.getElementById("btnDelete").style.display = "none";
}

function cancelDelete() {
  document.getElementById("deleteConfirm").style.display = "none";
  document.getElementById("btnDelete").style.display = "block";
}

function doDelete() {
  if (!editingItem || !editingItem.itemId) return;

  var arr = SUPPLY_DATA[editingItem.devId] || [];
  var idx = arr.findIndex(function (i) { return i.id === editingItem.itemId; });
  if (idx !== -1) {
    arr.splice(idx, 1);
    saveAll();
    closeModalDirect();
    refreshAll();
    showToast("🗑 تم الحذف", "success");
  }
}

function getDefaultKitDays(name) {
  var upper = (name || "").toUpperCase();
  for (var key in DEFAULT_KIT_DAYS) {
    if (upper.indexOf(key.toUpperCase()) !== -1) {
      return DEFAULT_KIT_DAYS[key];
    }
  }
  return 21;
}

/* ═══════════════════════════════════════════════════════════
   12) تقرير التموين
   ═══════════════════════════════════════════════════════════ */
function buildReportDeviceSelect() {
  var select = document.getElementById("reportDeviceValue");
  if (!select) return;
  select.innerHTML = Object.keys(DEVICES).filter(function (d) {
    return DEVICES[d].isActive;
  }).map(function (d) {
    return '<option value="' + d + '">' + DEVICES[d].name + '</option>';
  }).join("");
}

function updateReportPreview() {
  var preview = document.getElementById("reportPreview");
  if (!preview) return;

  var radios = document.querySelectorAll('input[name="reportType"]');
  var type = "all";
  radios.forEach(function (r) { if (r.checked) type = r.value; });

  var devSelect = document.getElementById("reportDeviceSelect");
  if (type === "device") {
    devSelect.style.display = "block";
  } else {
    devSelect.style.display = "none";
  }

  var text = buildReportText(type);
  preview.textContent = text;
}

function buildReportText(type) {
  var now = new Date();
  var dateStr = formatDateArabic(now);
  var timeStr = now.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

  var lines = [];
  lines.push("══════════════════════════════════════");
  lines.push("     📋 تقرير المختبر — " + REPORT_INFO.facility);
  lines.push("══════════════════════════════════════");
  lines.push("📅 " + dateStr);
  lines.push("🕐 " + timeStr);
  lines.push("👤 " + REPORT_INFO.name + " — " + REPORT_INFO.title);
  lines.push("");

  if (type === "all") {
    lines.push("📦 تقرير كل الأجهزة");
    lines.push("──────────────────────────────────────");
    for (var devId in DEVICES) {
      if (!DEVICES[devId].isActive) continue;
      lines = lines.concat(buildDeviceReportLines(devId));
      lines.push("");
    }
  } else if (type === "device") {
    var devId2 = document.getElementById("reportDeviceValue").value || "atellica";
    lines.push("📦 تقرير جهاز: " + DEVICES[devId2].name);
    lines.push("──────────────────────────────────────");
    lines = lines.concat(buildDeviceReportLines(devId2));
    lines.push("");
  } else if (type === "shortages") {
    lines.push("⚠️ النواقص فقط");
    lines.push("──────────────────────────────────────");
    var alerts = getAllAlerts();
    if (alerts.length === 0) {
      lines.push("✅ لا توجد نواقص");
    } else {
      alerts.forEach(function (a) {
        lines.push(statusIcon(a.status) + " " + a.item.name + " (" + a.deviceShort + ")");
        lines.push("   " + a.reasons.join("، "));
      });
    }
    lines.push("");
  } else if (type === "expired") {
    lines.push("❌ المواد المنتهية");
    lines.push("──────────────────────────────────────");
    var expired = [];
    for (var devId3 in DEVICES) {
      if (!DEVICES[devId3].isActive) continue;
      var items = SUPPLY_DATA[devId3] || [];
      items.forEach(function (item) {
        if (item.expiry) {
          var dl = daysLeft(item.expiry);
          if (dl !== null && dl < 0) {
            expired.push({
              name: item.name,
              device: DEVICES[devId3].short,
              expiry: item.expiry,
              days: dl
            });
          }
        }
      });
    }
    if (expired.length === 0) {
      lines.push("✅ لا توجد مواد منتهية");
    } else {
      expired.forEach(function (e) {
        lines.push("❌ " + e.name + " (" + e.device + ")");
        lines.push("   انتهى منذ " + Math.abs(e.days) + " يوم — " + formatDateShort(e.expiry));
      });
    }
    lines.push("");
  }

  lines.push("══════════════════════════════════════");
  lines.push("توقيع: " + REPORT_INFO.name);
  lines.push("══════════════════════════════════════");

  return lines.join("\n");
}

function buildDeviceReportLines(devId) {
  var dev = DEVICES[devId];
  var items = getDeviceItems(devId);
  var lines = [];
  var stats = getDeviceStats(devId);

  lines.push("🔹 " + dev.name + " [" + dev.typeLabel + "]");
  lines.push("   جاهزية: " + stats.pct + "% — إجمالي: " + stats.total + " صنف");

  var groups = groupItemsByType(items);
  var order = ["Reagent", "Calibrator", "QC", "Solution", "Part"];

  order.forEach(function (t) {
    var arr = groups[t];
    if (!arr || arr.length === 0) return;
    var hasAlert = arr.some(function (i) { return getStatus(i).status !== "ok"; });
    if (!hasAlert) return;

    lines.push("   " + TYPE_ICON[t] + " " + TYPE_AR[t] + ":");
    arr.forEach(function (item) {
      var st = getStatus(item);
      if (st.status === "ok") return;
      lines.push("     " + statusIcon(st.status) + " " + item.name + " — كمية: " + item.qty + " | " + st.reasons.join("، "));
    });
  });

  return lines;
}

function printReport() {
  var radios = document.querySelectorAll('input[name="reportType"]');
  var type = "all";
  radios.forEach(function (r) { if (r.checked) type = r.value; });

  var text = buildReportText(type);

  var html = '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">' +
             '<title>تقرير المختبر</title><style>' +
             'body{font-family:Arial,sans-serif;direction:rtl;font-size:11pt;padding:15mm;color:#000;}' +
             'pre{white-space:pre-wrap;word-break:break-word;line-height:1.7;font-family:Arial,sans-serif;}' +
             '@page{size:A4;margin:10mm;}' +
             '</style></head><body><pre>' +
             text.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
             '</pre><scr' + 'ipt>window.onload=function(){setTimeout(function(){window.print();},400);};</scr' + 'ipt>' +
             '</body></html>';

  var win = window.open("", "_blank");
  if (!win) {
    showToast("اسمح بالنوافذ المنبثقة للطباعة", "error");
    return;
  }
  win.document.write(html);
  win.document.close();
}

function shareReport() {
  var radios = document.querySelectorAll('input[name="reportType"]');
  var type = "all";
  radios.forEach(function (r) { if (r.checked) type = r.value; });

  var text = buildReportText(type);

  if (navigator.share) {
    navigator.share({
      title: "تقرير مختبر " + REPORT_INFO.facility,
      text: text
    }).catch(function () {
      copyToClipboard(text);
    });
  } else {
    copyToClipboard(text);
  }
}

function copyReport() {
  var preview = document.getElementById("reportPreview");
  if (!preview || !preview.textContent.trim()) {
    showToast("لا يوجد تقرير للنسخ", "error");
    return;
  }
  copyToClipboard(preview.textContent);
}

function exportReportExcel() {
  var radios = document.querySelectorAll('input[name="reportType"]');
  var type = "all";
  radios.forEach(function (r) { if (r.checked) type = r.value; });

  var rows = [["الجهاز", "الصنف", "النوع", "الكمية", "حد التنبيه", "الصلاحية", "Lot#", "الموقع", "الحالة", "الأسباب"]];

  if (type === "all" || type === "device") {
    var devices = type === "all" ?
      Object.keys(DEVICES).filter(function (d) { return DEVICES[d].isActive; }) :
      [document.getElementById("reportDeviceValue").value];

    devices.forEach(function (devId) {
      var items = getDeviceItems(devId);
      items.forEach(function (item) {
        var st = getStatus(item);
        rows.push([
          DEVICES[devId].short,
          item.name || "",
          TYPE_AR[item.type] || "",
          item.qty || 0,
          item.minQty || 0,
          item.expiry || "",
          item.lot || "",
          item.location || "",
          st.status === "ok" ? "جيد" : st.status === "orange" ? "منخفض" : st.status === "yellow" ? "قارب" : "تنبيه",
          st.reasons.join("، ")
        ]);
      });
    });
  }

  var csv = rows.map(function (r) {
    return r.map(function (c) {
      return '"' + String(c).replace(/"/g, '""') + '"';
    }).join(",");
  }).join("\n");

  // BOM لضمان ظهور العربية في Excel
  var blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "lab-report-" + new Date().toISOString().slice(0, 10) + ".csv";
  a.click();
  URL.revokeObjectURL(url);
  showToast("✓ تم تصدير التقرير", "success");
}

/* ═══════════════════════════════════════════════════════════
   13) التصدير والاستيراد
   ═══════════════════════════════════════════════════════════ */
function exportData() {
  var data = exportAllData();
  var filename = "lab-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  downloadJSON(data, filename);
  showToast("✓ تم التصدير", "success");
}

function importData(event) {
  var file = event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function (e) {
    try {
      var data = JSON.parse(e.target.result);
      if (!data || typeof data !== "object") {
        showToast("ملف غير صالح", "error");
        return;
      }

      if (data.sd) {
        for (var dev in data.sd) {
          if (SUPPLY_DATA[dev]) SUPPLY_DATA[dev] = data.sd[dev];
        }
      }
      if (data.ts) {
        for (var d in data.ts) TEST_STATUS[d] = data.ts[d];
      }
      if (data.st) {
        for (var k in data.st) SETTINGS[k] = data.st[k];
      }

      saveAll();
      refreshAll();
      showToast("✓ تم الاستيراد بنجاح", "success");
    } catch (err) {
      console.error(err);
      showToast("خطأ في قراءة الملف", "error");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

/* ═══════════════════════════════════════════════════════════
   14) تشغيل التطبيق عند التحميل
   ═══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {
  init();
});

/* ═══════════════════════════════════════════════════════════
   نهاية app.js
   ═══════════════════════════════════════════════════════════ */
