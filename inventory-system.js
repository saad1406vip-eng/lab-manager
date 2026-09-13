/* ═════════════════════════════════════════════════════════ */
/* نظام جرد المختبر - Inventory System Logic */
/* ═════════════════════════════════════════════════════════ */

// ═══════════ البيانات الأساسية ═══════════

let SYSTEM_DATA = {
  employees: [],
  employee_devices: {},  // { employeeId: [deviceIds] }
  inventories: []        // السجلات السابقة
};

// ═══════════ الموظفين (من الملف الذي أرسله) ═══════════

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

// ═══════════ الدالة الرئيسية للتهيئة ═══════════

function initInventorySystem() {
  loadSystemData();
  populateEmployeeSelect();
  populateAdminUI();
  showPage('inventory');
}

// ═══════════ إدارة البيانات ═══════════

function loadSystemData() {
  const saved = localStorage.getItem('lab_inventory_system');
  if (saved) {
    SYSTEM_DATA = JSON.parse(saved);
  } else {
    // تهيئة أولية
    SYSTEM_DATA.employees = EMPLOYEES_LIST.map((name, idx) => ({
      id: `emp_${idx}`,
      name: name
    }));

    // ربط تلقائي الموظفين بالأجهزة الحالية (توزيع عملي)
    const device_ids = Object.keys(SUPPLY_DATA);
    const emp_ids = SYSTEM_DATA.employees.map(e => e.id);

    emp_ids.forEach(empId => {
      // كل موظف يقدر يجرد جميع الأجهزة (يمكن تغييره لاحقاً)
      SYSTEM_DATA.employee_devices[empId] = device_ids;
    });

    saveSystemData();
  }
}

function saveSystemData() {
  localStorage.setItem('lab_inventory_system', JSON.stringify(SYSTEM_DATA));
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast active ${type}`;
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// ═══════════ عرض/إخفاء الصفحات ═══════════

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${pageId}`).classList.add('active');
}

// ═══════════ ملء اختيار الموظف ═══════════

function populateEmployeeSelect() {
  const select = document.getElementById('employeeSelect');
  select.innerHTML = '<option value="">-- اختر اسمك --</option>';
  
  SYSTEM_DATA.employees.forEach(emp => {
    const opt = document.createElement('option');
    opt.value = emp.id;
    opt.textContent = emp.name;
    select.appendChild(opt);
  });
}

// ═══════════ تحديث الأجهزة المتاحة ═══════════

function updateDevices() {
  const empId = document.getElementById('employeeSelect').value;
  const deviceSelect = document.getElementById('deviceSelect');

  deviceSelect.innerHTML = '<option value="">-- اختر الجهاز --</option>';
  deviceSelect.disabled = !empId;

  if (!empId) return;

  const deviceIds = SYSTEM_DATA.employee_devices[empId] || [];
  deviceIds.forEach(devId => {
    const opt = document.createElement('option');
    opt.value = devId;
    opt.textContent = SUPPLY_DATA[devId]?.name || devId;
    deviceSelect.appendChild(opt);
  });
}

// ═══════════ بدء الجرد ═══════════

function startInventory() {
  const empId = document.getElementById('employeeSelect').value;
  const deviceId = document.getElementById('deviceSelect').value;

  if (!empId || !deviceId) return;

  const employee = SYSTEM_DATA.employees.find(e => e.id === empId);
  const device = SUPPLY_DATA[deviceId];

  if (!device) return;

  renderInventoryForm(empId, deviceId, employee, device);
}

// ═══════════ رسم نموذج الجرد ═══════════

function renderInventoryForm(empId, deviceId, employee, device) {
  const container = document.getElementById('inventoryContent');

  let html = `
    <div class="card">
      <div class="card-title">📋 جرد: ${device.name}</div>
      <p class="hint">الموظف: ${employee.name} | التاريخ: ${getDateArabic(new Date())}</p>
      
      <table class="inventory-table">
        <thead>
          <tr>
            <th>اسم المحلول</th>
            <th>النوع</th>
            <th>الكمية</th>
            <th>الحالة</th>
            <th>التاريخ</th>
            <th>إجراء</th>
          </tr>
        </thead>
        <tbody id="inventoryBody">
  `;

  // إضافة المحاليل
  device.supplies.forEach((supply, idx) => {
    const status = getSupplyStatus(supply);
    const statusBadge = `<span class="status-badge status-${status.class}">${status.label}</span>`;
    const dateDisplay = supply.expiry ? supply.expiry : '--';
    
    html += `
      <tr>
        <td>${supply.name}</td>
        <td><small>${supply.type}</small></td>
        <td><strong>${supply.qty || 0}</strong></td>
        <td>${statusBadge}</td>
        <td><small>${dateDisplay}</small></td>
        <td>
          <button class="edit-btn" onclick="editSupply('${deviceId}', ${idx}, '${empId}')">
            ✏️ عدّل
          </button>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>

      <div style="margin-top: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <button class="btn-primary" onclick="printInventory('${empId}', '${deviceId}')">
          🖨️ طباعة A4
        </button>
        <button class="btn-primary" onclick="copyToWhatsApp('${empId}', '${deviceId}')">
          💬 نسخ للواتس
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// ═══════════ حالة المحلول ═══════════

function getSupplyStatus(supply) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = supply.expiry ? new Date(supply.expiry) : null;
  const minQty = supply.minQty || 5;
  const qty = supply.qty || 0;

  if (qty === 0) {
    return { class: 'danger', label: '❌ نافد' };
  }

  if (expiry) {
    const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) {
      return { class: 'danger', label: '❌ منتهى' };
    }
    if (daysLeft <= 7) {
      return { class: 'warning', label: '⚠️ قريب الانتهاء' };
    }
  }

  if (qty < minQty) {
    return { class: 'warning', label: '⚠️ ناقص' };
  }

  return { class: 'ok', label: '✅ جاهز' };
}

// ═══════════ تعديل المحلول ═══════════

let currentEditData = {};

function editSupply(deviceId, supplyIdx, empId) {
  const supply = SUPPLY_DATA[deviceId].supplies[supplyIdx];
  
  currentEditData = {
    deviceId,
    supplyIdx,
    empId,
    originalSupply: JSON.parse(JSON.stringify(supply))
  };

  document.getElementById('itemName').value = supply.name;
  document.getElementById('itemQty').value = supply.qty || '';
  document.getElementById('itemMinQty').value = supply.minQty || 5;
  document.getElementById('itemLot').value = supply.lot || '';
  document.getElementById('itemExpiry').value = supply.expiry || '';
  document.getElementById('itemOpenDate').value = supply.openDate || '';
  document.getElementById('itemKitDays').value = supply.kitDays || '';
  document.getElementById('itemLocation').value = supply.location || '';
  document.getElementById('itemNote').value = supply.note || '';

  document.getElementById('modalOverlay').classList.add('active');
}

function saveItem() {
  const { deviceId, supplyIdx } = currentEditData;
  const supply = SUPPLY_DATA[deviceId].supplies[supplyIdx];

  supply.qty = parseInt(document.getElementById('itemQty').value) || 0;
  supply.minQty = parseInt(document.getElementById('itemMinQty').value) || 5;
  supply.lot = document.getElementById('itemLot').value;
  supply.expiry = document.getElementById('itemExpiry').value;
  supply.openDate = document.getElementById('itemOpenDate').value;
  supply.kitDays = document.getElementById('itemKitDays').value;
  supply.location = document.getElementById('itemLocation').value;
  supply.note = document.getElementById('itemNote').value;

  localStorage.setItem('lab_supply_data', JSON.stringify(SUPPLY_DATA));
  closeModalDirect();
  startInventory();
  showToast('تم حفظ التعديل ✅');
}

function closeModal(e) {
  if (e.target.id === 'modalOverlay') {
    closeModalDirect();
  }
}

function closeModalDirect() {
  document.getElementById('modalOverlay').classList.remove('active');
}

// ═══════════ طباعة التقرير ═══════════

function printInventory(empId, deviceId) {
  const employee = SYSTEM_DATA.employees.find(e => e.id === empId);
  const device = SUPPLY_DATA[deviceId];

  let html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تقرير جرد المحاليل</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background: white;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #1565c0;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .hospital-name {
          font-size: 18px;
          font-weight: bold;
          color: #0d47a1;
          margin-bottom: 5px;
        }
        .report-title {
          font-size: 22px;
          font-weight: bold;
          color: #1565c0;
          margin-bottom: 10px;
        }
        .info-box {
          background: #f0f7ff;
          border: 1px solid #1565c0;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 4px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 10px;
        }
        .info-item {
          font-size: 12px;
        }
        .info-label {
          font-weight: bold;
          color: #0d47a1;
        }
        .section-title {
          background: #1565c0;
          color: white;
          padding: 10px;
          margin: 15px 0 10px 0;
          font-weight: bold;
          border-radius: 3px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          font-size: 12px;
        }
        table th {
          background: #0d47a1;
          color: white;
          padding: 8px;
          text-align: right;
          font-weight: bold;
        }
        table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: right;
        }
        table tbody tr:nth-child(even) {
          background: #f9f9f9;
        }
        .summary {
          background: #f0f7ff;
          padding: 10px;
          margin-top: 15px;
          border-radius: 4px;
          font-size: 11px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #666;
          font-size: 10px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        @media print {
          body { background: white; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="hospital-name">تجمع عسير الصحي - مستشفى سبت العلايا</div>
        <div class="report-title">📋 تقرير جرد المحاليل</div>
      </div>

      <div class="info-box">
        <div class="info-item">
          <div class="info-label">الموظف:</div>
          <div>${employee.name}</div>
        </div>
        <div class="info-item">
          <div class="info-label">الجهاز:</div>
          <div>${device.name}</div>
        </div>
        <div class="info-item">
          <div class="info-label">التاريخ:</div>
          <div>${getDateArabic(new Date())}</div>
        </div>
        <div class="info-item">
          <div class="info-label">الوقت:</div>
          <div>${new Date().toLocaleTimeString('ar-SA')}</div>
        </div>
      </div>

      ${generateSuppliesTables(device)}

      ${generateSummary(device)}

      <div class="footer">
        <p>تم إنشاء هذا التقرير بواسطة نظام جرد المختبر</p>
        <p>🔒 هذه وثيقة رسمية - يُرجى الحفاظ عليها في ملف القسم</p>
      </div>
    </body>
    </html>
  `;

  const printWin = window.open('', '', 'width=900,height=1200');
  printWin.document.write(html);
  printWin.document.close();
  
  setTimeout(() => {
    printWin.print();
  }, 250);
}

// ═══════════ توليد جداول المحاليل ═══════════

function generateSuppliesTables(device) {
  const suppliesByType = {};

  device.supplies.forEach(supply => {
    if (!suppliesByType[supply.type]) {
      suppliesByType[supply.type] = [];
    }
    suppliesByType[supply.type].push(supply);
  });

  let html = '';

  Object.entries(suppliesByType).forEach(([type, supplies]) => {
    html += `<div class="section-title">${getTypeEmoji(type)} ${getTypeLabel(type)}</div>`;
    html += `
      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الكمية</th>
            <th>الحد الأدنى</th>
            <th>Lot#</th>
            <th>الصلاحية</th>
            <th>الحالة</th>
            <th>الموقع</th>
          </tr>
        </thead>
        <tbody>
    `;

    supplies.forEach(supply => {
      const status = getSupplyStatus(supply);
      html += `
        <tr>
          <td>${supply.name}</td>
          <td>${supply.qty || 0}</td>
          <td>${supply.minQty || 5}</td>
          <td>${supply.lot || '-'}</td>
          <td>${supply.expiry || '-'}</td>
          <td>${status.label}</td>
          <td>${supply.location || '-'}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;
  });

  return html;
}

// ═══════════ توليد الملخص ═══════════

function generateSummary(device) {
  let ready = 0, warning = 0, danger = 0;

  device.supplies.forEach(supply => {
    const status = getSupplyStatus(supply);
    if (status.class === 'ok') ready++;
    else if (status.class === 'warning') warning++;
    else danger++;
  });

  return `
    <div class="summary">
      <strong>📊 ملخص الحالة:</strong><br>
      ✅ جاهزة: <strong>${ready}</strong> | 
      ⚠️ قريبة الانتهاء/ناقصة: <strong>${warning}</strong> | 
      ❌ نافدة/منتهية: <strong>${danger}</strong>
    </div>
  `;
}

// ═══════════ نسخ للواتس ═══════════

function copyToWhatsApp(empId, deviceId) {
  const employee = SYSTEM_DATA.employees.find(e => e.id === empId);
  const device = SUPPLY_DATA[deviceId];

  let text = `📋 *تقرير جرد المحاليل*\n`;
  text += `📌 الموظف: ${employee.name}\n`;
  text += `🔧 الجهاز: ${device.name}\n`;
  text += `📅 التاريخ: ${getDateArabic(new Date())}\n`;
  text += `🕐 الوقت: ${new Date().toLocaleTimeString('ar-SA')}\n`;
  text += `${'─'.repeat(50)}\n\n`;

  const suppliesByType = {};
  device.supplies.forEach(supply => {
    if (!suppliesByType[supply.type]) {
      suppliesByType[supply.type] = [];
    }
    suppliesByType[supply.type].push(supply);
  });

  Object.entries(suppliesByType).forEach(([type, supplies]) => {
    text += `${getTypeEmoji(type)} *${getTypeLabel(type)}*\n`;
    supplies.forEach(supply => {
      const status = getSupplyStatus(supply);
      text += `• ${supply.name} | الكمية: ${supply.qty || 0} | ${status.label}\n`;
    });
    text += `\n`;
  });

  text += `${'─'.repeat(50)}\n`;
  text += `✅ تم الجرد بنجاح\n`;
  text += `📱 نظام جرد المختبر`;

  // نسخ للكليببورد
  navigator.clipboard.writeText(text).then(() => {
    showToast('تم نسخ التقرير ✅ - الصقه في الواتس');
  });
}

// ═══════════ دوال مساعدة ═══════════

function getDateArabic(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', locale: 'ar-SA' };
  return date.toLocaleDateString('ar-SA', options);
}

function getTypeLabel(type) {
  const labels = {
    'reagents': 'كاشفات (Reagents)',
    'calibrators': 'معايرات (Calibrators)',
    'qc': 'ضبط الجودة (QC)',
    'solutions': 'محاليل التشغيل (Solutions)',
    'parts': 'قطع وإلكترودات (Parts)',
    'other': 'أخرى'
  };
  return labels[type] || type;
}

function getTypeEmoji(type) {
  const emojis = {
    'reagents': '🧪',
    'calibrators': '⚖️',
    'qc': '🔬',
    'solutions': '💧',
    'parts': '⚙️',
    'other': '📦'
  };
  return emojis[type] || '📌';
}

// ═══════════ واجهة الإدارة ═══════════

function populateAdminUI() {
  renderEmployeesAdmin();
  renderDevicesAdmin();
  renderAdminSelects();
  renderPreviousInventories();
}

function renderEmployeesAdmin() {
  const container = document.getElementById('employeesList');
  let html = '';

  SYSTEM_DATA.employees.forEach(emp => {
    html += `
      <div class="item-badge">
        <div class="badge-text">👤 ${emp.name}</div>
        <button class="badge-btn" onclick="removeEmployee('${emp.id}')">حذف</button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderDevicesAdmin() {
  const container = document.getElementById('devicesList');
  let html = '<p style="color: #666; margin-bottom: 1rem;">الأجهزة الحالية:</p>';

  Object.values(SUPPLY_DATA).forEach(device => {
    const supplyCount = device.supplies.length;
    html += `
      <div class="item-badge">
        <div class="badge-text">
          <strong>${device.name}</strong>
          <br/>
          <small style="color: #999;">المحاليل: ${supplyCount}</small>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderAdminSelects() {
  const empSelect = document.getElementById('adminEmployeeSelect');
  empSelect.innerHTML = '';

  SYSTEM_DATA.employees.forEach(emp => {
    const opt = document.createElement('option');
    opt.value = emp.id;
    opt.textContent = emp.name;
    empSelect.appendChild(opt);
  });

  renderDeviceCheckboxes();
}

function renderDeviceCheckboxes() {
  const empId = document.getElementById('adminEmployeeSelect').value;
  const container = document.getElementById('adminDevicesCheckbox');
  let html = '';

  const assignedDevices = SYSTEM_DATA.employee_devices[empId] || [];

  Object.entries(SUPPLY_DATA).forEach(([devId, device]) => {
    const isChecked = assignedDevices.includes(devId) ? 'checked' : '';
    html += `
      <label style="display: flex; align-items: center; margin-bottom: 0.5rem; cursor: pointer;">
        <input type="checkbox" value="${devId}" ${isChecked} style="margin-left: 0.5rem; cursor: pointer;">
        <span>${device.name}</span>
      </label>
    `;
  });

  container.innerHTML = html;
}

function addEmployee() {
  const name = document.getElementById('newEmployeeName').value.trim();
  if (!name) {
    showToast('أدخل اسم الموظف', 'error');
    return;
  }

  const emp = {
    id: `emp_${Date.now()}`,
    name: name
  };

  SYSTEM_DATA.employees.push(emp);
  SYSTEM_DATA.employee_devices[emp.id] = Object.keys(SUPPLY_DATA);

  saveSystemData();
  renderEmployeesAdmin();
  renderAdminSelects();
  populateEmployeeSelect();
  document.getElementById('newEmployeeName').value = '';
  showToast('تم إضافة الموظف ✅');
}

function removeEmployee(empId) {
  if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
    SYSTEM_DATA.employees = SYSTEM_DATA.employees.filter(e => e.id !== empId);
    delete SYSTEM_DATA.employee_devices[empId];
    saveSystemData();
    renderEmployeesAdmin();
    renderAdminSelects();
    populateEmployeeSelect();
    showToast('تم حذف الموظف ✅');
  }
}

function saveEmployeeDevices() {
  const empId = document.getElementById('adminEmployeeSelect').value;
  const checkboxes = document.querySelectorAll('#adminDevicesCheckbox input[type="checkbox"]:checked');
  const selectedDevices = Array.from(checkboxes).map(cb => cb.value);

  SYSTEM_DATA.employee_devices[empId] = selectedDevices;
  saveSystemData();
  showToast('تم حفظ الربط ✅');
}

function renderPreviousInventories() {
  const container = document.getElementById('previousInventories');
  
  if (SYSTEM_DATA.inventories.length === 0) {
    container.innerHTML = '<p style="color: #999;">لا توجد جرودات سابقة</p>';
    return;
  }

  let html = '<table class="inventory-table"><thead><tr><th>الموظف</th><th>الجهاز</th><th>التاريخ</th><th>الإجراء</th></tr></thead><tbody>';

  SYSTEM_DATA.inventories.forEach((inv, idx) => {
    html += `
      <tr>
        <td>${inv.employee}</td>
        <td>${inv.device}</td>
        <td>${inv.date}</td>
        <td>
          <button class="edit-btn" onclick="viewInventory(${idx})">👁️ عرض</button>
        </td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

function refreshAll() {
  populateAdminUI();
  populateEmployeeSelect();
  showToast('تم التحديث ✅');
}

// ═══════════ حفظ الجرد ═══════════

function saveInventory(empId, deviceId) {
  const employee = SYSTEM_DATA.employees.find(e => e.id === empId);
  const device = SUPPLY_DATA[deviceId];

  const inv = {
    employee: employee.name,
    device: device.name,
    date: getDateArabic(new Date()),
    time: new Date().toLocaleTimeString('ar-SA'),
    supplies: JSON.parse(JSON.stringify(device.supplies))
  };

  SYSTEM_DATA.inventories.push(inv);
  saveSystemData();
}

// تهيئة الموظفين عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('adminEmployeeSelect').addEventListener('change', renderDeviceCheckboxes);
});
