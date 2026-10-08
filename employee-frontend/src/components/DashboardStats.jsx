function DashboardStats({
    totalEmployees,
    itEmployees,
    hrEmployees,
    financeEmployees
}) {

    return (
        <section className="stats">

            {/* Total Employees */}

            <div className="stat-card">

                <div className="stat-icon blue">
                    Total
                </div>

                <div>

                    <p>
                        Total Employees
                    </p>

                    <h2>
                        {totalEmployees}
                    </h2>

                </div>

            </div>


            {/* IT Employees */}

            <div className="stat-card">

                <div className="stat-icon green">
                    IT
                </div>

                <div>

                    <p>
                        IT Employees
                    </p>

                    <h2>
                        {itEmployees}
                    </h2>

                </div>

            </div>


            {/* HR Employees */}

            <div className="stat-card">

                <div className="stat-icon orange">
                    HR
                </div>

                <div>

                    <p>
                        HR Employees
                    </p>

                    <h2>
                        {hrEmployees}
                    </h2>

                </div>

            </div>


            {/* Finance Employees */}

            <div className="stat-card">

                <div className="stat-icon purple">
                    FIN
                </div>

                <div>

                    <p>
                        Finance
                    </p>

                    <h2>
                        {financeEmployees}
                    </h2>

                </div>

            </div>

        </section>
    );
}

export default DashboardStats;