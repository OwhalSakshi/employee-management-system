```jsx
function EmployeeTable({
    filteredEmployees,
    searchTerm,
    setSearchTerm,
    handleEdit,
    handleDelete
}) {

    return (
        <section className="card">

            <div className="card-header">

                <div>
                    <h2>Employee List</h2>
                    <p>Manage all employees</p>
                </div>

                {/* Search */}
                <div className="employee-list-actions">

                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />

                    <div className="employee-count">
                        {filteredEmployees.length} Employees
                    </div>

                </div>

            </div>

            {/* Employee Table */}
            <div className="table-container">

                <table>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredEmployees.length > 0 ? (

                            filteredEmployees.map(employee => (

                                <tr key={employee.id}>

                                    <td>
                                        #{employee.id}
                                    </td>

                                    <td>
                                        <div className="employee-name">

                                            <div className="avatar">
                                                {employee.firstName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <strong>
                                                    {employee.firstName}{" "}
                                                    {employee.lastName}
                                                </strong>

                                                <small>
                                                    Employee
                                                </small>
                                            </div>

                                        </div>
                                    </td>

                                    <td>
                                        {employee.email}
                                    </td>

                                    <td>
                                        <span className="department">
                                            {employee.department}
                                        </span>
                                    </td>

                                    <td>
                                        ₹{Number(employee.salary)
                                            .toLocaleString("en-IN")}
                                    </td>

                                    <td>
                                        <div className="action-buttons">

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEdit(employee)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(employee.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>
                                <td colSpan="6">
                                    No employees found
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </section>
    );
}

export default EmployeeTable;
```
