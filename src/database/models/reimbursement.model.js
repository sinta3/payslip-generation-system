"use strict";
module.exports = (sequelize, DataTypes) => {
  const Reimbursement = sequelize.define(
    "Reimbursement",
    {
      reimbursement_id: {
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
      total_reimbursement: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      description: DataTypes.STRING,
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
      tableName: "reimbursements",
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

  Reimbursement.associate = (models) => {
    Reimbursement.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });
    Reimbursement.belongsTo(models.Payroll, {
      foreignKey: "payroll_id",
      as: "payroll",
    });
    Reimbursement.belongsTo(models.Employee, {
      foreignKey: "created_by",
      as: "creator",
    });
    Reimbursement.belongsTo(models.Employee, {
      foreignKey: "updated_by",
      as: "updater",
    });
    Reimbursement.belongsTo(models.AuditLog, {
      foreignKey: "request_id",
      targetKey: "request_id",
      as: "auditLog",
    });
  };

  return Reimbursement;
};
