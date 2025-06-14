"use strict";

const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const adminPlain = faker.internet.password(8);
    const adminHash = await bcrypt.hash(adminPlain, 10);

    const records = [];
    const passwordLog = [{ username: "admin", password: adminPlain }];

    //admin
    records.push({
      username: "admin",
      full_name: "System Administrator",
      password: adminHash,
      salary: 0,
      role: "admin",
      created_by: null,
      updated_by: null,
      created_at: now,
      updated_at: now,
    });

    // 100 employees
    for (let i = 0; i < 100; i++) {
      const username =
        faker.internet.username().toLowerCase() +
        faker.number.int({ min: 1, max: 999 });
      const plain = faker.internet.password(8);
      const hash = await bcrypt.hash(plain, 10);

      records.push({
        username,
        full_name: faker.person.fullName(),
        password: hash,
        salary: faker.number.int({ min: 3000000, max: 10000000 }),
        role: "employee",
        created_by: null,
        updated_by: null,
        created_at: now,
        updated_at: now,
      });

      passwordLog.push({ username, password: plain });
    }

    const logPath = path.resolve(__dirname, "../seed-passwords.json");
    fs.writeFileSync(logPath, JSON.stringify(passwordLog, null, 2));

    await queryInterface.bulkInsert(
      { schema: "payslip_generation_schema", tableName: "employees" },
      records,
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      { schema: "payslip_generation_schema", tableName: "employees" },
      { role: ["admin", "employee"] },
    );
  },
};
