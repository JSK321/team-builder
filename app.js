const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

// Create team array
const team = [];

//Prompt the user for roles
function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is your employee name?",
            name: "name",
        },
        {
            type: "input",
            message: "What is your employee id number?",
            name: "id",
        },
        {
            type: "input",
            message: "What is your employee email?",
            name: "email",
        },
        {
            type: "list",
            message: "What is the role of the employee?",
            name: "role",
            choices: ["Manager", "Engineer", "Intern",]
        },
    ]).then(function (response) {
        // Creates new employee
        const employees = new Employee(response.name, response.id, response.email);
        // If role is manager inquire office number
        if (response.role === "Manager") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is your office number?",
                    name: "officeNumber",
                },
            ]).then(function (response) {
                // Creates new manager
                const manager = new Manager(employees.name, employees.id, employees.email, response.officeNumber);
                team.push(manager);
                addNewEmployee();
            });
        // If role is engineer inquire github username
        } else if (response.role === "Engineer") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is your Github username?",
                    name: "github",
                },
            ]).then(function (response) {
                // Creates new engineer
                const engineer = new Engineer(employees.name, employees.id, employees.email, response.github);
                team.push(engineer);
                addNewEmployee();
            })
        // If role is intern inquire school
        } else if (response.role === "Intern") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Which school did you attend?",
                    name: "school",
                },
            ]).then(function (response) {
                // Creates new intern
                const intern = new Intern(employees.name, employees.id, employees.email, response.school);
                team.push(intern);
                addNewEmployee();
            });
        };
    });
};

// Function to add more employees
function addNewEmployee() {
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to add another employee?",
            name: "question",
            choices: ["Yes", "No"],
        },
    ]).then(function (response) {
        if (response.question === "No") {
            const create = render(team);
            createHTML(create);
        } else {
            addEmployee();
        };
    });
};

// Function to create output folder and html file
function createHTML(data) {
    fs.mkdir("./output", function (err) {
        if (err) {
            throw err;
        };
    });
    fs.writeFile(outputPath, data, function (err) {
        if (err) {
            throw err;
        } else {
            console.log("Success, you've created your team profile!");
        };
    });
};

addEmployee();