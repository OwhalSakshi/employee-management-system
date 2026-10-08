const API_URL = "http://localhost:8080/api/employees";

export async function getEmployees() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch employees");
    }

    return response.json();
}