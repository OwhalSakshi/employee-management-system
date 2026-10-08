function EmployeeForm({
    formData,
    editingId,
    handleChange,
    handleSubmit,
    handleCancelEdit
}) {

    return (
        <section className="card">

            <div className="card-header">

                <div>

                    <h2>
                        {editingId !== null
                            ? "Edit Employee"
                            : "Add Employee"}
                    </h2>

                    <p>
                        {editingId !== null
                            ? "Update employee information"
                            : "Enter employee information"}
                    </p>

                </div>

            </div>


            <form
                className="employee-form"
                onSubmit={handleSubmit}
            >

                <div className="input-group">

                    <label>
                        First Name
                    </label>

                    <input
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />

                </div>


                <div className="input-group">

                    <label>
                        Last Name
                    </label>

                    <input
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />

                </div>


                <div className="input-group">

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                </div>


                <div className="input-group">

                    <label>
                        Department
                    </label>

                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Department
                        </option>

                        <option value="IT">
                            IT
                        </option>

                        <option value="HR">
                            HR
                        </option>

                        <option value="Finance">
                            Finance
                        </option>

                        <option value="Marketing">
                            Marketing
                        </option>

                    </select>

                </div>


                <div className="input-group">

                    <label>
                        Salary
                    </label>

                    <input
                        type="number"
                        name="salary"
                        placeholder="Enter salary"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                    />

                </div>


                <div className="form-button">

                    <button type="submit">

                        {editingId !== null
                            ? "Update Employee"
                            : "Add Employee"}

                    </button>


                    {editingId !== null && (

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleCancelEdit}
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </form>

        </section>
    );
}

export default EmployeeForm;