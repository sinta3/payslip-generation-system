"use strict";
module.exports = (sequelize, DataTypes) => {
  const Payroll = sequelize.define(
    "Payroll",
    {
      payroll_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      payroll_period_month: DataTypes.STRING,
      payroll_period_year: DataTypes.STRING,
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      cutoff_at: DataTypes.DATE,
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
      tableName: "payrolls",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["payroll_period_month", "payroll_period_year"],
        },
      ],
    },
  );

  Payroll.associate = (models) => {
    Payroll.hasMany(models.EmployeePayroll, {
      foreignKey: "payroll_id",
      as: "employeePayrolls",
    });

    Payroll.belongsTo(models.Employee, {
      foreignKey: "created_by",
      as: "creator",
    });
    Payroll.belongsTo(models.Employee, {
      foreignKey: "updated_by",
      as: "updater",
    });
    Payroll.belongsTo(models.AuditLog, {
      foreignKey: "request_id",
      targetKey: "request_id",
      as: "auditLogs",
    });
  };

  return Payroll;
};
