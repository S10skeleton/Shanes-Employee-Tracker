// Import necessary Node.js and sequalize modules
const inquirer = require("inquirer");
const mysql = require("mysql2");

// Set up MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL server.");
  startApp();
});

// Function to start the application and show all choices
function startApp() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add A Department",
          "Add A Role",
          "Add An Employee",
          "Update An Employee Role",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Add A Department":
          addDepartment();
          break;
        case "Add A Role":
          addRole();
          break;
        case "Add An Employee":
          addEmployee();
          break;
        case "Update An Employee Role":
          updateRole();
          break;
        case "Quit":
          quitApplication();
          break;
      }
    });
}

// Function to view all departments
function viewDepartments() {
  const query = "SELECT * FROM department";

  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log("\n");
    console.table(res);

    startApp();
  });
}

// Function to view all roles
function viewRoles() {
  const query = `
    SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    INNER JOIN department ON role.department_id = department.id
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log("\n");
    console.table(res);
    startApp();
  });
}

// Function to view all employees
function viewEmployees() {
  const query = `
    SELECT employee.id, employee.first_name, employee.last_name, 
           role.title, department.name AS department, role.salary, 
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log("\n");
    console.table(res);
    startApp();
  });
}

// function to add a deparment
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
      },
    ])
    .then((answer) => {
      const query = "INSERT INTO department (name) VALUES (?)";
      connection.query(query, answer.departmentName, (err, res) => {
        if (err) throw err;
        console.log(`Department added successfully!`);
        startApp();
      });
    });
}

// function to add a role
function addRole() {
  connection.query("SELECT id, name FROM department", (err, departments) => {
    if (err) throw err;

    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          name: "roleTitle",
          message: "Enter the title of the role:",
        },
        {
          type: "input",
          name: "roleSalary",
          message: "Enter the salary for this role:",
        },
        {
          type: "list",
          name: "departmentId",
          message: "Select the department for this role:",
          choices: departmentChoices,
        },
      ])
      .then((answer) => {
        const query =
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
        connection.query(
          query,
          [answer.roleTitle, answer.roleSalary, answer.departmentId],
          (err, res) => {
            if (err) throw err;
            console.log(`Role added successfully!`);
            startApp();
          }
        );
      });
  });
}

// funtion to add an employee
function addEmployee() {
  connection.query("SELECT id, title FROM role", (err, roles) => {
    if (err) throw err;

    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    connection.query(
      'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
      (err, employees) => {
        if (err) throw err;

        const managerChoices = employees.map(({ id, name }) => ({
          name: name,
          value: id,
        }));
        managerChoices.unshift({ name: "No Manager", value: null });

        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message: "Enter the employee's first name:",
            },
            {
              type: "input",
              name: "lastName",
              message: "Enter the employee's last name:",
            },
            {
              type: "list",
              name: "roleId",
              message: "Select the employee's role:",
              choices: roleChoices,
            },
            {
              type: "list",
              name: "managerId",
              message:
                "Select the employee's manager (select 'No Manager' if none):",
              choices: managerChoices,
            },
          ])
          .then((answer) => {
            const query =
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
            connection.query(
              query,
              [
                answer.firstName,
                answer.lastName,
                answer.roleId,
                answer.managerId,
              ],
              (err, res) => {
                if (err) throw err;
                console.log(`Employee added successfully!`);
                startApp();
              }
            );
          });
      }
    );
  });
}

// function to update a role
function updateRole() {
  connection.query(
    'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
    (err, employees) => {
      if (err) throw err;

      const employeeChoices = employees.map(({ id, name }) => ({
        name: name,
        value: id,
      }));

      connection.query("SELECT id, title FROM role", (err, roles) => {
        if (err) throw err;

        const roleChoices = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "employeeId",
              message: "Select the employee whose role you want to update:",
              choices: employeeChoices,
            },
            {
              type: "list",
              name: "newRoleId",
              message: "Select the new role for this employee:",
              choices: roleChoices,
            },
          ])
          .then((answer) => {
            const query = "UPDATE employee SET role_id = ? WHERE id = ?";
            connection.query(
              query,
              [answer.newRoleId, answer.employeeId],
              (err, res) => {
                if (err) throw err;
                console.log(`Employee's role updated successfully!`);
                startApp();
              }
            );
          });
      });
    }
  );
}
// Function to handle Quit action
function quitApplication() {
  console.log("Exiting application.");
  connection.end();
}

// Close the MySQL connection when done
function closeConnection() {
  connection.end();
}
