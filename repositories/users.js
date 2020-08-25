const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository {
  // Password compare
  async passwordCompare(saved, supplied) {
    // saved -> Saved password in our database.
    // supplied -> user supplied password while sign in.
    const [hashed, salt] = saved.split('.');
    const suppliedHash = await scrypt(supplied, salt, 64);

    return hashed === suppliedHash.toString('Hex');
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
