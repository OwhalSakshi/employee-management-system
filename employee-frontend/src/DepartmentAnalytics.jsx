import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./DepartmentAnalytics.css";

const API_URL = "http://localhost:8080/api/employees";

const COLORS = ["#6759e8", "#16a085", "#f39c12", "#e65b75", "#3498db"];

function DepartmentAnalytics() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load employee analytics.");
        }
        return response.json();
      })
      .then((data) => setEmployees(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const departmentCounts = Object.values(
    employees.reduce((result, employee) => {
      const department = employee.department || "Unassigned";
      result[department] ??= { name: department, employees: 0 };
      result[department].employees += 1;
      return result;
    }, {})
  );

  const departmentSalaries = Object.values(
    employees.reduce((result, employee) => {
      const department = employee.department || "Unassigned";
      result[department] ??= { department, totalSalary: 0, count: 0 };
      result[department].totalSalary += Number(employee.salary) || 0;
      result[department].count += 1;
      return result;
    }, {})
  ).map((item) => ({
    department: item.department,
    averageSalary: Math.round(item.totalSalary / item.count),
  }));

  if (loading) {
    return <section className="analytics-message">Loading analytics...</section>;
  }

  if (error) {
    return (
      <section className="analytics-message analytics-error">
        {error}
        <p>Check that your Spring Boot backend is running on port 8080.</p>
      </section>
    );
  }

  if (employees.length === 0) {
    return (
      <section className="analytics-message">
        Add employees to see department analytics.
      </section>
    );
  }

  return (
    <section className="analytics-section">
      <div className="analytics-heading">
        <div>
          <h2>Employee Analytics</h2>
          <p>Department distribution and average salary overview</p>
        </div>
        <span className="analytics-total">
          {employees.length} employees
        </span>
      </div>

      <div className="analytics-grid">
        <article className="analytics-card">
          <h3>Employees by Department</h3>
          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentCounts}
                  dataKey="employees"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={48}
                  paddingAngle={3}
                >
                  {departmentCounts.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="analytics-card">
          <h3>Average Salary by Department</h3>
          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentSalaries}
                margin={{ top: 15, right: 12, left: 12, bottom: 45 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="department"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Average salary",
                  ]}
                />
                <Bar
                  dataKey="averageSalary"
                  name="Average salary"
                  fill="#6759e8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  );
}

export default DepartmentAnalytics;
