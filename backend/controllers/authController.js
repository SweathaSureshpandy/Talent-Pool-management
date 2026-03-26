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
      resume_name,
      company_name,
      website_url,
      company_website,
      industry_type,
      industry_id,
      file_name
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
        degree,
        resume: resume_name
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
        website_url: website_url || company_website,
        industry_type,
        industry_id,
        incorporation_cert: file_name
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
        email: user.email,
        role: user.role, // 🔥 ADDED THIS
        student_id: user.role === 'student' ? (await students.findOne({ where: { user_id: user.user_id } }))?.student_id : null,
        hr_id: user.role === 'hr' ? (await hr.findOne({ where: { user_id: user.user_id } }))?.hr_id : null
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { user_id, role } = req.params;
    if (role === 'student') {
      const studentProfile = await students.findOne({
        where: { user_id },
        include: [
          { model: users, attributes: ['user_name', 'email'] },
          { model: skills, through: { attributes: [] } }
        ]
      });
      return res.json(studentProfile);
    } else if (role === 'hr') {
      const hrProfile = await hr.findOne({
        where: { user_id },
        include: [{ model: users, attributes: ['user_name', 'email'] }]
      });
      return res.json(hrProfile);
    }
    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { student_id, skill_name } = req.body;
    let [skillInstance, created] = await skills.findOrCreate({ where: { skill_name } });
    const studentInstance = await students.findByPk(student_id);
    if (!studentInstance) return res.status(404).json({ message: "Student not found" });
    await studentInstance.addSkill(skillInstance);
    res.json({ message: "Skill added successfully", skill: skillInstance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { student_id, resume_filename } = req.body;
    await students.update({ resume: resume_filename }, { where: { student_id } });
    res.json({ message: "Resume updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    const { student_id } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const filename = req.file.filename;
    await students.update({ resume: filename }, { where: { student_id } });
    res.json({ message: "File uploaded successfully", filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudentStatus = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { status } = req.body;

    const [updatedRows] = await students.update(
      { status: status },
      { where: { student_id: student_id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Student not found or status already updated" });
    }

    res.json({ message: "Student status updated successfully" });
  } catch (err) {
    console.error("UPDATE STUDENT STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};