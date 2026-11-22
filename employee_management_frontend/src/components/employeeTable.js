const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2
}).format(Number(value || 0));

export function renderEmployees(employees) {
  const body = document.getElementById("employeeTableBody");
  document.getElementById("recordCount").textContent = `${employees.length} records`;
  document.getElementById("tableSummary").textContent = `Showing ${employees.length} employee${employees.length === 1 ? "" : "s"}`;
  if (!employees.length) {
    body.innerHTML = '<tr><td colspan="8" class="empty-state">No employees found. Add an employee or change your search.</td></tr>';
    return;
  }
  body.innerHTML = employees.map((employee) => `
    <tr>
      <td class="id-cell">#${employee.employee_id}</td>
      <td><div class="employee-cell"><div class="employee-avatar">${escapeHtml(employee.employee_name.trim().charAt(0).toUpperCase())}</div><strong>${escapeHtml(employee.employee_name)}</strong></div></td>
      <td><span class="department-pill ${String(employee.department).toLowerCase()}">${escapeHtml(employee.department)}</span></td>
      <td>${escapeHtml(employee.designation)}</td>
      <td class="email-cell">${escapeHtml(employee.email)}</td>
      <td class="salary-cell">${money(employee.salary)}</td>
      <td>${escapeHtml(employee.joining_date)}</td>
      <td><div class="action-buttons"><button class="icon-btn edit-btn" data-edit="${employee.employee_id}" aria-label="Edit employee">✎</button><button class="icon-btn delete-btn" data-delete="${employee.employee_id}" aria-label="Delete employee">⌫</button></div></td>
    </tr>`).join("");
}
