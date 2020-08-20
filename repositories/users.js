const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UserRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error('Filename required');
    }

    this.filename = filename;
    //   checking if the filename already exists
    try {
      fs.accessSync(this.filename);
    } catch (error) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  //   Asynchronous method to get and read the file.
  async getAll() {
    // open the file - this.filename.
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    );
  }

  //  Asynchronous method to create users.
  async create(attributes) {
    // attributes === {email:'', password:''}
    attributes.ID = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const hashedBuffer = await scrypt(attributes.password, salt, 64);
    const userRecords = await this.getAll(); //Accessing the parsed data
    const record = {
      ...attributes,
      password: `${hashedBuffer.toString('Hex')}.${salt}`, //.toString used to convert buffer to string
    };
    userRecords.push(record); //Pushing the user data into empty array

    // calling writeAll method to write the records
    await this.writeAll(userRecords);

    return record;
  }

  // Password compare
  async passwordCompare(saved, supplied) {
    // saved -> Saved password in our database.
    // supplied -> user supplied password while sign in.
    const [hashed, salt] = saved.split('.');
    const suppliedHash = await scrypt(supplied, salt, 64);

    return hashed === suppliedHash.toString('Hex');
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
    return crypto.randomBytes(4).toString('hex');
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

module.exports = new UserRepository('users.json');

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
