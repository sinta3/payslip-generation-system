"use strict";
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      attendance_id: {
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
      checkin_at: DataTypes.DATE,
      checkout_at: DataTypes.DATE,
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
      tableName: "attendances",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["employee_id", "date"],
        },
      ],
    },
  );

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });
    Attendance.belongsTo(models.Payroll, {
      foreignKey: "payroll_id",
      as: "payroll",
    });
    Attendance.belongsTo(models.Employee, {
      foreignKey: "created_by",
      as: "creator",
    });
    Attendance.belongsTo(models.Employee, {
      foreignKey: "updated_by",
      as: "updater",
    });
    Attendance.belongsTo(models.AuditLog, {
      foreignKey: "request_id",
      targetKey: "request_id",
      as: "auditLog",
    });
  };

  return Attendance;
};
