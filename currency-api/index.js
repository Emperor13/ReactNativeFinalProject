const express = require("express");
const cors = require('cors');
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();


const PORT = 3000;
const JWT_SECRET = "your_jwt_secret_key"; 
const USERS_FILE = "./users.json"; 
app.use(cors());
app.use(express.json());



const readUsersFromFile = () => {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};


const writeUsersToFile = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};


const exchangeRates = {
  THB: { 
    USD: 0.03,
    EUR: 0.028,
    JPY: 3.5,
  },
  USD: {
    THB: 33.0,
    EUR: 0.94,
    JPY: 130.0,
  },
  EUR: {
    THB: 35.0,
    USD: 1.06,
    JPY: 138.0,
  },
  JPY: {
    THB: 0.29,
    USD: 0.0077,
    EUR: 0.0072,
  },
};

// Register API
app.post("/register", async (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  if (!firstName || !lastName || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const users = readUsersFromFile();
  console.log(users);
  
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  
  const hashedPassword = await bcrypt.hash(password, 10);


  const newUser = {
    id: users.length + 1, 
    firstName,
    lastName,
    username,
    password: hashedPassword,
  };

  users.push(newUser);
  writeUsersToFile(users);

  res.json({ message: "User registered successfully" });
});

// Login API
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const users = readUsersFromFile();
  console.log(users);

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }


  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("Password valid:", isPasswordValid);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }


  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  console.log("Generated token:", token);
  
  res.json({ message: "Login successful", token });
});


app.get("/convert", (req, res) => {
  const { from, to, amount } = req.query;

  if (
    !from ||
    !to ||
    !amount ||
    !exchangeRates[from] ||
    !exchangeRates[from][to]
  ) {
    return res.status(400).json({ error: "Invalid query parameters." });
  }

  const convertedAmount = exchangeRates[from][to] * parseFloat(amount);

  res.json({
    from,
    to,
    amount: parseFloat(amount),
    convertedAmount,
  });
});

app.listen(PORT, () => {
  console.log(`Currency Converter API is running on http://172.20.10.6:${PORT}`);
});
