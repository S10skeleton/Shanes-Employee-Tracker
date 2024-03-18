-- Insert data into the 'department' table
INSERT INTO department (name) VALUES 
('Engineering'),
('Human Resources'),
('Marketing'),
('Sales');

-- Insert data into the 'role' table
INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 70000, 1),
('Senior Software Engineer', 90000, 1),
('HR Manager', 75000, 2),
('HR Associate', 50000, 2),
('Marketing Manager', 60000, 3),
('Sales Representative', 55000, 4);

-- Insert data into the 'employee' table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Doe', 2, 1),
('Jim', 'Beam', 3, NULL),
('Jill', 'Valentine', 4, 3),
('Jack', 'Daniels', 5, NULL),
('Josie', 'Wales', 6, 5);
