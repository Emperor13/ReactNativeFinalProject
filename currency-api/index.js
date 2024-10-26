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
    exchangeHistory: [],
  };

  users.push(newUser);
  writeUsersToFile(users);
  console.log("User registered successfully!");
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

  res.json({ message: "Login successful", token, exchangeHistory: user.exchangeHistory });
});

// เพิ่มประวัติการแลกเปลี่ยน
app.post("/exchange", (req, res) => {
  const { username, from, to, rate, amount, result, fromFlag, toFlag, timestamp } = req.body;

  const users = readUsersFromFile();
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const exchangeRecord = {
    from,
    to,
    rate,
    amount,
    result,
    fromFlag: fromFlag || "",
    toFlag: toFlag || "",
    timestamp: timestamp || new Date().toISOString(),
  };

  user.exchangeHistory.push(exchangeRecord);
  writeUsersToFile(users);
  console.log("Exchange record added:", exchangeRecord);

  res.json({ message: "Exchange record added", exchangeRecord });
});

//ดึงข้อมูลของประวัติที่แลกเปลี่ยนทั้งหมด
app.get("/exchange-history/:username", (req, res) => {
  const { username } = req.params;

  const users = readUsersFromFile();
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  res.json({ exchangeHistory: user.exchangeHistory || [] });
});

//ลบประวัติทั้งหมด
app.delete("/exchange-history/:username", (req, res) => {
  const { username } = req.params;

  const users = readUsersFromFile();
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Clear the exchange history
  user.exchangeHistory = [];
  writeUsersToFile(users);
  console.log(`All exchange history deleted for user: ${username}`);

  res.json({ message: "All exchange history deleted" });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); 

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); 
    req.user = user; 
    next();
  });
};

app.get("/profile", authenticateToken, (req, res) => {
  const users = readUsersFromFile();
  const user = users.find((user) => user.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { id, firstName, lastName, username, exchangeHistory } = user;
  res.json({ id, firstName, lastName, username, exchangeHistory });
  console.log("Get Profile Success!");
});

app.listen(PORT, () => {
  console.log(`Currency Converter API is running on http://172.20.10.6:${PORT}`);
});
