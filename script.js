let data = [];

function addItem() {
    let name = prompt("أدخل اسم العنصر:");
    if (!name) return;

    data.push(name);
    render();
    saveData();
}

function render() {
    let list = document.getElementById("list");
    list.innerHTML = "";

    data.forEach((item, index) => {
        let li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });

    document.getElementById("result").textContent = data.join("\n");
}

function copyReport() {
    let text = document.getElementById("result").textContent;

    if (!text.trim()) {
        showToast("⚠️ لا يوجد بيانات");
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => showToast("✅ تم النسخ"))
        .catch(() => showToast("❌ فشل النسخ"));
}

function showToast(msg) {
    let t = document.getElementById("toast");
    t.textContent = msg;
    t.style.opacity = "1";

    setTimeout(() => {
        t.style.opacity = "0";
    }, 2000);
}

function saveData() {
    localStorage.setItem("labData", JSON.stringify(data));
}

function loadData() {
    let saved = localStorage.getItem("labData");
    if (saved) {
        data = JSON.parse(saved);
        render();
    }
}

loadData();
