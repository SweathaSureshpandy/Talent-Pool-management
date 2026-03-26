const { skills, assessments, questions } = require('./models');
const sequelize = require('./config/database');

async function seed() {
  try {
    await sequelize.sync();

    // Seed Skills
    const skillList = ['React.js', 'Node.js', 'JavaScript', 'TypeScript', 'SQL', 'Python', 'Java', 'HTML', 'CSS', 'Redux'];
    for (const name of skillList) {
      await skills.findOrCreate({ where: { skill_name: name } });
    }

    // Seed Assessment
    const [assessment] = await assessments.findOrCreate({
      where: { title: 'Full Stack Web Development' },
      defaults: {
        description: 'Required for Frontend Developer Role at TechCorp Inc.',
        time_limit: 20
      }
    });

    // Seed Questions
    const questionsData = [
      {
        assessment_id: assessment.assessment_id,
        question_text: 'What is the virtual DOM in React?',
        options: { A: 'A direct copy of the real DOM', B: 'A lightweight representation of the real DOM', C: 'A server-side rendered DOM' },
        correct_answer: 'B'
      },
      {
        assessment_id: assessment.assessment_id,
        question_text: 'Which hook is used for side effects in React?',
        options: { A: 'useState', B: 'useContext', C: 'useEffect' },
        correct_answer: 'C'
      }
    ];

    for (const q of questionsData) {
      await questions.findOrCreate({
        where: { question_text: q.question_text },
        defaults: q
      });
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
