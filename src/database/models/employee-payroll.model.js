"use strict";
module.exports = (sequelize, DataTypes) => {
  const EmployeePayroll = sequelize.define(
    "EmployeePayroll",
    {
      employee_payroll_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      payroll_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_salary: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_overtime_salary: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_reimbursement_salary: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_reguler_salary: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_attendance_day: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_overtime_hours: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      hourly_salary: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_reimbursement_submitted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      request_id: DataTypes.STRING,
      is_locked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      processed_at: DataTypes.DATE,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
    },
    {
      tableName: "employee_payrolls",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["employee_id", "payroll_id"],
        },
      ],
    },
  );

  EmployeePayroll.associate = (models) => {
    EmployeePayroll.belongsTo(models.Payroll, {
      foreignKey: "payroll_id",
      as: "payroll",
    });
    EmployeePayroll.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });
    EmployeePayroll.belongsTo(models.Employee, {
      foreignKey: "created_by",
      as: "creator",
    });
    EmployeePayroll.belongsTo(models.Employee, {
      foreignKey: "updated_by",
      as: "updater",
    });
    EmployeePayroll.belongsTo(models.AuditLog, {
      foreignKey: "request_id",
      targetKey: "request_id",
      as: "auditLog",
    });
  };

  return EmployeePayroll;
};
