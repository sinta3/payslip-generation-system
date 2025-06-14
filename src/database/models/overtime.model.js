"use strict";
module.exports = (sequelize, DataTypes) => {
  const Overtime = sequelize.define(
    "Overtime",
    {
      overtime_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      overtime_hours: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      request_id: DataTypes.STRING,
      is_locked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      payroll_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
    },
    {
      tableName: "overtimes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["employee_id", "date"],
        },
      ],
    },
  );

  Overtime.associate = (models) => {
    Overtime.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });
    Overtime.belongsTo(models.Payroll, {
      foreignKey: "payroll_id",
      as: "payroll",
    });
    Overtime.belongsTo(models.Employee, {
      foreignKey: "created_by",
      as: "creator",
    });
    Overtime.belongsTo(models.Employee, {
      foreignKey: "updated_by",
      as: "updater",
    });
    Overtime.belongsTo(models.AuditLog, {
      foreignKey: "request_id",
      targetKey: "request_id",
      as: "auditLog",
    });
  };

  return Overtime;
};
