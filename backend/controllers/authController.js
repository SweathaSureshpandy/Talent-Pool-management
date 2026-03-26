const { users, students, hr, skills, student_skills } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');   // ✅ FIXED
require('dotenv').config();            // ✅ for secret key

exports.register = async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    const {
      user_name,
      email,
      password,
      role,
      university,
      degree,
      skills: userSkills,
      company_name,
      website_url,
      industry_type,
      industry_id
    } = req.body;

    // 🔹 Normalize role (VERY IMPORTANT)
    const userRole = role.toLowerCase();

    const hashed_password = await bcrypt.hash(password, 10);

    // 🔹 Create User
    const newUser = await users.create({
      user_name,
      email,
      hashed_password,
      role: userRole
    });

    console.log("User created:", newUser.user_id);

    // =========================
    // 🔹 STUDENT LOGIC
    // =========================
    if (userRole === 'student') {
      console.log("Creating student...");

      const newStudent = await students.create({
        user_id: newUser.user_id,
        university,
        degree
      });

      console.log("Student created:", newStudent.student_id);

      // 🔹 Add skills
      if (userSkills && userSkills.length > 0) {
        for (let skillName of userSkills) {

          let skill = await skills.findOne({
            where: { skill_name: skillName }
          });

          if (!skill) {
            skill = await skills.create({
              skill_name: skillName
            });
          }

          await student_skills.create({
            student_id: newStudent.student_id,
            skill_id: skill.skill_id
          });
        }

        console.log("Skills added");
      }
    }

    // =========================
    // 🔹 HR LOGIC
    // =========================
    if (userRole === 'hr') {
      console.log("Creating HR...");

      await hr.create({
        user_id: newUser.user_id,
        company_name,
        website_url,
        industry_type,
        industry_id
      });

      console.log("HR created");
    }

    return res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.error("FULL ERROR:", err); // 🔥 IMPORTANT
    return res.status(500).json({ error: err.message });
  }
};

// 🔹 LOGIN API
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user exists
    const user = await users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.hashed_password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role
      },
      process.env.JWT_SECRET || "SECRET_KEY",   // ✅ FIXED
      { expiresIn: "1d" }
    );

    // 4. Send response
    res.json({
      message: "Login successful",
      token,
      role: user.role,   // ✅ IMPORTANT for frontend redirect
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};