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
-- Managers
('John', 'Doe', 1, NULL),       -- Assuming John Doe is a manager with no manager above him
('Jim', 'Beam', 3, NULL),       -- Jim Beam as HR Manager
('Jack', 'Daniels', 5, NULL),   -- Jack Daniels as Marketing Manager

-- Employees with Managers
('Jane', 'Doe', 2, 1),          -- Managed by John Doe (id: 1)
('Jill', 'Valentine', 4, 3),    -- Managed by Jim Beam (id: 3)
('Josie', 'Wales', 6, 5);       -- Managed by Jack Daniels (id: 5)
