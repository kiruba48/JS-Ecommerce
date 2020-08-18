const fs = require("fs");

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
    const userRecords = await this.getAll(); //Accessing the parsed data
    userRecords.push(attributes); //Pushing the user data into empty array
    // convert the attributes into JSON and write it in users.json file.
    await fs.promises.writeFile(this.filename, JSON.stringify(userRecords));
  }
}

const test = async () => {
  const repo = new UserRepository("users.json");
  await repo.create({ email: "kirutest@test.com", password: "passowrd" });
  const users = await repo.getAll();
  console.log(users);
};

test();
