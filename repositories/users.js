const fs = require("fs");
const crypto = require("crypto");

class UserRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Filename required");
    }

    this.filename = filename;
    //   checking if the filename already exists
    try {
      fs.accessSync(this.filename);
    } catch (error) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  //   Asynchronous method to get and read the file.
  async getAll() {
    // open the file - this.filename.
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  //  Asynchronous method to create users.
  async create(attributes) {
    attributes.ID = this.randomId();
    const userRecords = await this.getAll(); //Accessing the parsed data
    userRecords.push(attributes); //Pushing the user data into empty array

    // calling writeAll method to write the records
    await this.writeAll(userRecords);
  }

  //   Method to write the data.
  async writeAll(userRecords) {
    // convert the attributes into JSON and write it in users.json file.
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(userRecords, null, 2)
    );
  }

  //   Method to generate randomID.
  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  //   Getting user by ID.
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.ID === id);
  }

  //   Deleting the user by ID.
  async delete(id) {
    const records = await this.getAll();
    const filterRecords = records.filter((record) => record.ID !== id);
    await this.writeAll(filterRecords);
  }

  // Update records be ID.
  async update(id, attributes) {
    const records = await this.getAll();
    const record = records.find((record) => record.ID === id);
    // if no record found
    if (!record) {
      throw new Error(`Record with ID${id} is not found`);
    }
    Object.assign(record, attributes);
    await this.writeAll(records);
  }

  //   Find user by any attributes
  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UserRepository("users.json");

/*TEST FUNCTION */
// const test = async () => {
//   const repo = new UserRepository("users.json");
//   //await repo.create({ email: "kirutest@test.com" });
//   //await repo.update("6e600078", { password: "mapassword" });
//   //   const users = await repo.getAll();
//   //   const user = await repo.getOne("620eff1f");
//   //repo.delete("75f00877");
//   const user = await repo.getOneBy({ ID: "6e600078" });
//   console.log(user);
// };

// test();
