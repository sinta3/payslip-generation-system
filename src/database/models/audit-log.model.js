"use strict";
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      audit_log_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      request_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ip_address: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
    },
    {
      tableName: "audit_logs",
      timestamps: false,
      createdAt: "created_at",
      updatedAt: false,
    },
  );

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.Employee, {
      foreignKey: "created_by",
      as: "creator",
    });

    AuditLog.hasMany(models.Attendance, {
      foreignKey: "request_id",
      sourceKey: "request_id",
      as: "attendances",
    });
    AuditLog.hasMany(models.Reimbursement, {
      foreignKey: "request_id",
      sourceKey: "request_id",
      as: "reimbursements",
    });
    AuditLog.hasMany(models.Overtime, {
      foreignKey: "request_id",
      sourceKey: "request_id",
      as: "overtimes",
    });
    AuditLog.hasMany(models.EmployeePayroll, {
      foreignKey: "request_id",
      sourceKey: "request_id",
      as: "employeePayrolls",
    });
    AuditLog.hasMany(models.Payroll, {
      foreignKey: "request_id",
      sourceKey: "request_id",
      as: "payrolls",
    });
  };

  return AuditLog;
};
