"use strict";
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      employee_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      full_name: DataTypes.STRING,
      password: DataTypes.STRING,
      salary: DataTypes.INTEGER,
      role: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
    },
    {
      tableName: "employees",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  Employee.associate = (models) => {
    Employee.hasMany(models.Employee, {
      foreignKey: "created_by",
      as: "createdEmployees",
    });
    Employee.hasMany(models.Payroll, {
      foreignKey: "created_by",
      as: "createdPayrolls",
    });
    Employee.hasMany(models.AuditLog, {
      foreignKey: "created_by",
      as: "createdAuditLogs",
    });
    Employee.hasMany(models.Attendance, {
      foreignKey: "created_by",
      as: "createdAttendances",
    });
    Employee.hasMany(models.Overtime, {
      foreignKey: "created_by",
      as: "createdOvertimes",
    });
    Employee.hasMany(models.Reimbursement, {
      foreignKey: "created_by",
      as: "createdReimbursements",
    });
    Employee.hasMany(models.EmployeePayroll, {
      foreignKey: "created_by",
      as: "createdEmployeePayrolls",
    });

    Employee.hasMany(models.Employee, {
      foreignKey: "updated_by",
      as: "updatedEmployees",
    });
    Employee.hasMany(models.Payroll, {
      foreignKey: "updated_by",
      as: "updatedPayrolls",
    });
    Employee.hasMany(models.Attendance, {
      foreignKey: "updated_by",
      as: "updatedAttendances",
    });
    Employee.hasMany(models.Overtime, {
      foreignKey: "updated_by",
      as: "updatedOvertimes",
    });
    Employee.hasMany(models.Reimbursement, {
      foreignKey: "updated_by",
      as: "updatedReimbursements",
    });
    Employee.hasMany(models.EmployeePayroll, {
      foreignKey: "updated_by",
      as: "updatedEmployeePayrolls",
    });

    Employee.hasMany(models.Attendance, {
      foreignKey: "employee_id",
      as: "attendances",
    });
    Employee.hasMany(models.Overtime, {
      foreignKey: "employee_id",
      as: "overtimes",
    });
    Employee.hasMany(models.Reimbursement, {
      foreignKey: "employee_id",
      as: "reimbursements",
    });
    Employee.hasMany(models.EmployeePayroll, {
      foreignKey: "employee_id",
      as: "employeePayrolls",
    });
  };

  return Employee;
};
