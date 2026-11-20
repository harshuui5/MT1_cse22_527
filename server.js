const express = require("express");
const app = express();

app.use(express.json());

let students = [];
let nextId = 1;


app.post("/api/students", (req, res) => {
    const { name, course, age } = req.body;

    if (!name || !course || age === undefined) {
        return res.status(400).json({ message: "Missing data" });
    }

    const exists = students.find(
        s => s.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
        return res.status(409).json({ message: "Student name already exists" });
    }

    const student = {
        id: nextId++,
        name,
        course,
        age
    };

    students.push(student);

    res.status(201).json(student);
});


app.get("/api/students", (req, res) => {
    const { course } = req.query;

    if (course) {
        const filtered = students.filter(
            s => s.course.toLowerCase() === course.toLowerCase()
        );
        return res.status(200).json(filtered);
    }

    res.status(200).json(students);
});

// GET /api/students/:id
app.get("/api/students/:id", (req, res) => {
    const student = students.find(
        s => s.id === parseInt(req.params.id)
    );

    if (!student) {
        return res.status(404).json({ message: "Wrong id" });
    }

    res.status(200).json(student);
});

// PUT /api/students/:id
app.put("/api/students/:id", (req, res) => {
    const student = students.find(
        s => s.id === parseInt(req.params.id)
    );

    if (!student) {
        return res.status(404).json({ message: "Wrong id" });
    }

    const { name, course, age } = req.body;

    if (!name || !course || age === undefined) {
        return res.status(400).json({ message: "Missing data" });
    }

    const duplicate = students.find(
        s =>
            s.id !== student.id &&
            s.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({ message: "Student name already exists" });
    }

    student.name = name;
    student.course = course;
    student.age = age;

    res.status(200).json(student);
});

// DELETE /api/students/:id
app.delete("/api/students/:id", (req, res) => {
    const index = students.findIndex(
        s => s.id === parseInt(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({ message: "Wrong id" });
    }

    const deletedStudent = students.splice(index, 1);

    res.status(200).json(deletedStudent[0]);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});