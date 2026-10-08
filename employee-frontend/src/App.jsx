import DepartmentAnalytics from "./DepartmentAnalytics.jsx";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:8080/api/employees";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  salary: "",
};

function getErrorMessage(data, fallback) {
  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.detail) return data.detail;
  if (data?.error) return data.error;
  return fallback;
}

async function requestApi(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();

  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, `Request failed (${response.status})`)
    );
  }

  return data;
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const data = await requestApi(API_URL);

      if (!Array.isArray(data)) {
        throw new Error("The API response is not an employee list.");
      }

      setEmployees(data);
    } catch (error) {
      setPageError(
        `${error.message}. Check that Spring Boot is running and the API is available at ${API_URL}.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const departments = useMemo(
    () => [
      "All",
      ...new Set(
        employees
          .map((employee) => employee.department)
          .filter(Boolean)
      ),
    ],
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const fullName =
        `${employee.firstName || ""} ${employee.lastName || ""}`.toLowerCase();

      const matchesSearch =
        !term ||
        fullName.includes(term) ||
        (employee.email || "").toLowerCase().includes(term) ||
        (employee.department || "").toLowerCase().includes(term) ||
        String(employee.id).includes(term);

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, departmentFilter]);

  const totalSalary = employees.reduce(
    (total, employee) => total + (Number(employee.salary) || 0),
    0
  );

  function openAddModal() {
    setEditingEmployee(null);
    setForm(EMPTY_FORM);
    setNotice("");
    setModalOpen(true);
  }

  function openEditModal(employee) {
    setEditingEmployee(employee);
    setForm({
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      department: employee.department || "",
      salary: String(employee.salary ?? ""),
    });
    setNotice("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditingEmployee(null);
    setForm(EMPTY_FORM);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice("");

    const salary = Number(form.salary);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setNotice("Please enter the employee's first and last name.");
      return;
    }

    if (!form.email.trim()) {
      setNotice("Please enter an email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setNotice("Please enter a valid email address.");
      return;
    }

    if (!form.department.trim()) {
      setNotice("Please enter a department.");
      return;
    }

    if (!form.salary.trim() || !Number.isFinite(salary) || salary <= 0) {
      setNotice("Salary must be a number greater than zero.");
      return;
    }

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      department: form.department.trim(),
      salary,
    };

    setSaving(true);

    try {
      if (editingEmployee) {
        await requestApi(`${API_URL}/${editingEmployee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setNotice("Employee updated successfully.");
      } else {
        await requestApi(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setNotice("Employee added successfully.");
      }

      setModalOpen(false);
      setEditingEmployee(null);
      setForm(EMPTY_FORM);
      await loadEmployees();
      setNotice(
        editingEmployee
          ? "Employee updated successfully."
          : "Employee added successfully."
      );
    } catch (error) {
      setNotice(error.message || "Unable to save the employee.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(employee) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
    );

    if (!confirmed) return;

    setDeletingId(employee.id);
    setNotice("");

    try {
      await requestApi(`${API_URL}/${employee.id}`, {
        method: "DELETE",
      });

      setEmployees((current) =>
        current.filter((item) => item.id !== employee.id)
      );
      setNotice("Employee deleted successfully.");
    } catch (error) {
      setNotice(error.message || "Unable to delete the employee.");
    } finally {
      setDeletingId(null);
    }
  }

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">E</div>
          <div>
            <strong>EmployEase</strong>
            <span>Management Portal</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <div className="nav-item active">
          <span className="nav-icon">▦</span>
          Dashboard
        </div>
        <div className="nav-item">
          <span className="nav-icon">♙</span>
          Employees
        </div>

        <div className="sidebar-bottom">
          <div className="help-icon">?</div>
          <div>
            <strong>Need help?</strong>
            <span>Manage your team with ease.</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Dashboard</div>
          <div className="profile">
            <div className="profile-avatar">S</div>
            <div className="profile-info">
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>Employee Dashboard</h1>
              <p className="subtitle">
                Manage your people, track your team, and keep everything organized.
              </p>
            </div>
            <button className="primary-button" onClick={openAddModal}>
              <span className="plus">＋</span> Add Employee
            </button>
          </div>

          {pageError && (
            <div className="error-banner" role="alert">
              <div>
                <strong>Couldn't load employees</strong>
                <p>{pageError}</p>
              </div>
              <button className="secondary-button" onClick={loadEmployees}>
                Try again
              </button>
            </div>
          )}

          {notice && (
            <div className="notice-banner" role="status">
              <span>{notice}</span>
              <button
                className="notice-close"
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          )}

          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Total Employees</span>
                <span className="stat-icon purple">♙</span>
              </div>
              <div className="stat-value">
                {loading ? "—" : employees.length}
              </div>
              <div className="stat-foot">People in your organization</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Departments</span>
                <span className="stat-icon blue">▤</span>
              </div>
              <div className="stat-value">
                {loading
                  ? "—"
                  : new Set(
                      employees
                        .map((employee) => employee.department)
                        .filter(Boolean)
                    ).size}
              </div>
              <div className="stat-foot">Across your organization</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Total Salary</span>
                <span className="stat-icon green">₹</span>
              </div>
              <div className="stat-value salary-value">
                {loading ? "—" : money(totalSalary)}
              </div>
              <div className="stat-foot">Combined listed salaries</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-label">Showing Results</span>
                <span className="stat-icon orange">⌕</span>
              </div>
              <div className="stat-value">
                {loading ? "—" : filteredEmployees.length}
              </div>
              <div className="stat-foot">Employees matching your filters</div>
            </article>
          </section>

          <DepartmentAnalytics />

          <section className="table-card">
            <div className="table-heading">
              <div>
                <h2>All Employees</h2>
                <p>View and manage your employee records.</p>
              </div>
              <span className="record-count">
                {filteredEmployees.length} records
              </span>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <span>⌕</span>
                <input
                  type="search"
                  placeholder="Search by name, email, department or ID..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search employees"
                />
              </div>

              <select
                className="department-select"
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                aria-label="Filter by department"
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department === "All" ? "All departments" : department}
                  </option>
                ))}
              </select>

              <button
                className="secondary-button refresh-button"
                onClick={loadEmployees}
                disabled={loading}
              >
                ↻ Refresh
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>EMPLOYEE ID</th>
                    <th>DEPARTMENT</th>
                    <th>EMAIL ADDRESS</th>
                    <th>SALARY</th>
                    <th className="actions-heading">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <div className="spinner" />
                        <strong>Loading employees...</strong>
                        <span>Connecting to your employee database.</span>
                      </td>
                    </tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <div className="empty-symbol">♙</div>
                        <strong>
                          {employees.length === 0
                            ? "No employees found"
                            : "No matching employees"}
                        </strong>
                        <span>
                          {employees.length === 0
                            ? "Add your first employee to get started."
                            : "Try a different search or department filter."}
                        </span>
                        {employees.length === 0 && !pageError && (
                          <button
                            className="primary-button small-button"
                            onClick={openAddModal}
                          >
                            Add Employee
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">
                              {`${employee.firstName || "?"}`
                                .charAt(0)
                                .toUpperCase()}
                              {`${employee.lastName || ""}`
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <strong>
                                {employee.firstName} {employee.lastName}
                              </strong>
                              <span>{employee.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="id-text">
                            EMP-{String(employee.id).padStart(3, "0")}
                          </span>
                        </td>
                        <td>
                          <span className="department-badge">
                            {employee.department || "Unassigned"}
                          </span>
                        </td>
                        <td className="email-text">{employee.email}</td>
                        <td className="salary-text">{money(employee.salary)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-button"
                              onClick={() => openEditModal(employee)}
                              title="Edit employee"
                              aria-label={`Edit ${employee.firstName}`}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDelete(employee)}
                              disabled={deletingId === employee.id}
                              title="Delete employee"
                              aria-label={`Delete ${employee.firstName}`}
                            >
                              {deletingId === employee.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>
                {loading
                  ? "Loading records..."
                  : `Showing ${filteredEmployees.length} of ${employees.length} employees`}
              </span>
              <span>Employee Management System</span>
            </div>
          </section>

          <footer className="page-footer">
            <span>© 2026 EmployEase</span>
            <span>Employee Management System</span>
          </footer>
        </section>
      </main>

      {modalOpen && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="employee-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-modal-title"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  {editingEmployee ? "UPDATE RECORD" : "NEW RECORD"}
                </p>
                <h2 id="employee-modal-title">
                  {editingEmployee ? "Edit Employee" : "Add New Employee"}
                </h2>
                <p>
                  {editingEmployee
                    ? "Update the employee details below."
                    : "Enter the details to add an employee to your team."}
                </p>
              </div>
              <button
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  First Name <span>*</span>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    required
                    maxLength={100}
                  />
                </label>

                <label>
                  Last Name <span>*</span>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    required
                    maxLength={100}
                  />
                </label>

                <label className="full-field">
                  Email Address <span>*</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                  />
                </label>

                <label className="full-field">
                  Department <span>*</span>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleInputChange}
                    placeholder="e.g. IT, Finance, HR"
                    required
                    maxLength={100}
                  />
                </label>

                <label className="full-field">
                  Monthly Salary (₹) <span>*</span>
                  <input
                    name="salary"
                    type="number"
                    value={form.salary}
                    onChange={handleInputChange}
                    placeholder="Enter salary"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </label>
              </div>

              {notice && (
                <div className="form-error" role="alert">
                  {notice}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingEmployee
                      ? "Save Changes"
                      : "Add Employee"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;