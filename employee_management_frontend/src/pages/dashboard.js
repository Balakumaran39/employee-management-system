import { employeeApi } from "../services/api.js";
import { renderEmployees } from "../components/employeeTable.js";

const employeeModal = new bootstrap.Modal(document.getElementById("employeeModal"));
const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
let searchTimer;

function showAlert(message, type = "success") {
  const area = document.getElementById("alertArea");
  area.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
}
function showLoading(message = "Loading employee records...") {
  document.getElementById("employeeTableBody").innerHTML = `<tr><td colspan="8" class="empty-state">${message}</td></tr>`;
}
function formPayload() {
  return {
    employee_name: document.getElementById("employeeName").value.trim(),
    email: document.getElementById("email").value.trim(),
    department: document.getElementById("department").value,
    designation: document.getElementById("designation").value.trim(),
    salary: document.getElementById("salary").value,
    joining_date: document.getElementById("joiningDate").value,
  };
}
function displayError(error) {
  if (error.data && typeof error.data === "object") {
    return Object.entries(error.data).map(([key, value]) =>
      `${key.replaceAll("_", " ")}: ${Array.isArray(value) ? value.join(", ") : value}`
    ).join("<br>");
  }
  return "Something went wrong. Please check the server and try again.";
}
async function loadEmployees() {
  showLoading();
  try {
    const search = document.getElementById("searchInput").value.trim();
    const department = document.getElementById("departmentFilter").value;
    const employees = await employeeApi.list({ search, department });
    renderEmployees(employees);
  } catch (error) {
    showLoading("Unable to load records. Check that the Django backend is running.");
    showAlert(displayError(error), "danger");
  }
}
async function loadStats() {
  try {
    const stats = await employeeApi.stats();
    document.getElementById("totalEmployees").textContent = stats.total_employees;
    document.getElementById("itCount").textContent = stats.department_counts.IT;
    document.getElementById("hrCount").textContent = stats.department_counts.HR;
    document.getElementById("financeCount").textContent = stats.department_counts.Finance;
  } catch {
    ["totalEmployees", "itCount", "hrCount", "financeCount"].forEach(id => {
      document.getElementById(id).textContent = "—";
    });
  }
}
async function refresh() {
  await Promise.all([loadEmployees(), loadStats()]);
}
function openCreateModal() {
  document.getElementById("employeeForm").reset();
  document.getElementById("employeeId").value = "";
  document.getElementById("modalTitle").textContent = "Add employee";
  document.getElementById("saveBtn").textContent = "Save employee";
  document.getElementById("formError").innerHTML = "";
  employeeModal.show();
}
async function openEditModal(id) {
  try {
    const employee = await employeeApi.get(id);
    document.getElementById("employeeId").value = employee.employee_id;
    document.getElementById("employeeName").value = employee.employee_name;
    document.getElementById("email").value = employee.email;
    document.getElementById("department").value = employee.department;
    document.getElementById("designation").value = employee.designation;
    document.getElementById("salary").value = employee.salary;
    document.getElementById("joiningDate").value = employee.joining_date;
    document.getElementById("modalTitle").textContent = "Update employee";
    document.getElementById("saveBtn").textContent = "Update employee";
    document.getElementById("formError").innerHTML = "";
    employeeModal.show();
  } catch (error) {
    showAlert(displayError(error), "danger");
  }
}

document.getElementById("addEmployeeBtn").addEventListener("click", openCreateModal);
document.getElementById("refreshBtn").addEventListener("click", refresh);
document.getElementById("searchInput").addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadEmployees, 250);
});
document.getElementById("departmentFilter").addEventListener("change", loadEmployees);

document.getElementById("employeeTableBody").addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");
  if (editButton) openEditModal(editButton.dataset.edit);
  if (deleteButton) {
    document.getElementById("deleteEmployeeId").value = deleteButton.dataset.delete;
    deleteModal.show();
  }
});

document.getElementById("employeeForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const errorBox = document.getElementById("formError");
  errorBox.innerHTML = "";
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  const id = document.getElementById("employeeId").value;
  const button = document.getElementById("saveBtn");
  button.disabled = true;
  button.textContent = "Saving...";
  try {
    if (id) await employeeApi.update(id, formPayload());
    else await employeeApi.create(formPayload());
    employeeModal.hide();
    form.classList.remove("was-validated");
    showAlert(id ? "Employee updated successfully." : "Employee created successfully.");
    await refresh();
  } catch (error) {
    errorBox.innerHTML = displayError(error);
  } finally {
    button.disabled = false;
    button.textContent = id ? "Update employee" : "Save employee";
  }
});

document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
  const id = document.getElementById("deleteEmployeeId").value;
  const button = document.getElementById("confirmDeleteBtn");
  button.disabled = true;
  button.textContent = "Deleting...";
  try {
    await employeeApi.remove(id);
    deleteModal.hide();
    showAlert("Employee deleted successfully.");
    await refresh();
  } catch (error) {
    showAlert(displayError(error), "danger");
  } finally {
    button.disabled = false;
    button.textContent = "Yes, delete employee";
  }
});

refresh();
